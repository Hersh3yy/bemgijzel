import type { ApiResponse, ApiError, ApiConfig, AlbumData, AlbumImage } from '~/types/api';
import { useMedia } from './useMedia';

interface UseApiOptions {
  immediate?: boolean;
  server?: boolean;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const { parseProperties } = useMedia();
  
  const getApiUrl = (): string => {
    const apiUrl = config.public.apiUrl || config.public.vamsUrl;
    if (!apiUrl) {
      throw new Error('API URL not configured. Please check your environment variables (VAMS_URL).');
    }
    return apiUrl;
  };

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    const apiKey = config.public.apiKey || config.public.vamsBgApiKey;
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    return headers;
  };

  const createApiError = (response: Response, errorText: string): ApiError => {
    let errorMessage = `API Error (${response.status}): `;
    
    switch (response.status) {
      case 404:
        errorMessage += 'Resource not found';
        break;
      case 401:
        errorMessage += 'Authentication failed. Please check your API key.';
        break;
      case 403:
        errorMessage += 'Access forbidden. You may not have permission to access this resource.';
        break;
      case 429:
        errorMessage += 'Rate limit exceeded. Please try again later.';
        break;
      case 422:
        errorMessage += 'Validation error. Please check your request data.';
        break;
      case 500:
      case 502:
      case 503:
        errorMessage += 'Server error. Please try again later.';
        break;
      default:
        errorMessage += errorText || response.statusText;
    }
    
    return {
      status: response.status,
      message: errorMessage,
      originalError: new Error(errorText)
    };
  };

  const transformApiResponse = <T>(apiResponse: any): T => {
    // Handle nested response structures consistently
    if (apiResponse.data?.data) {
      return apiResponse.data.data as T;
    } else if (apiResponse.data) {
      return apiResponse.data as T;
    }
    
    return apiResponse as T;
  };

  const transformAlbumData = (data: AlbumData): AlbumData => {
    // Ensure properties are parsed for images
    if (data.images) {
      data.images = data.images.map((img: AlbumImage) => ({
        ...img,
        properties: parseProperties(img.properties)
      }));
    }
    
    return data;
  };

  const fetchApi = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const baseUrl = getApiUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = { ...getHeaders(), ...options.headers };

    try {
      const response = await fetch(url, { 
        ...options,
        headers 
      });

      if (!response.ok) {
        const errorText = await response.text();
        const apiError = createApiError(response, errorText);
        throw new Error(apiError.message);
      }

      const apiResponse = await response.json();
      return transformApiResponse<T>(apiResponse);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown API error occurred');
    }
  };

  const fetchWithFallback = async <T>(
    primaryEndpoint: string, 
    fallbackEndpoint: string
  ): Promise<T> => {
    try {
      return await fetchApi<T>(primaryEndpoint);
    } catch (error) {
      console.warn(`Primary endpoint failed (${primaryEndpoint}), trying fallback (${fallbackEndpoint}):`, error);
      return await fetchApi<T>(fallbackEndpoint);
    }
  };

  return {
    fetchApi,
    fetchWithFallback,
    getApiUrl,
    getHeaders,
    createApiError,
    transformApiResponse,
    transformAlbumData
  };
}; 