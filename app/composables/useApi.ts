interface ApiResponse<T = any> {
  data?: {
    data?: T;
    album?: T;
    albums?: T;
    images?: T;
  } | T;
  album?: T;
  albums?: T;
  images?: T;
}

interface UseApiOptions {
  immediate?: boolean;
  server?: boolean;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  
  const getApiUrl = () => {
    const apiUrl = config.public.apiUrl || config.public.vamsUrl;
    if (!apiUrl) {
      throw new Error('API URL not configured. Please check your environment variables (VAMS_URL).');
    }
    return apiUrl;
  };

  const getHeaders = () => {
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

  const fetchApi = async <T = any>(endpoint: string): Promise<T> => {
    const baseUrl = getApiUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = getHeaders();

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
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
        case 500:
        case 502:
        case 503:
          errorMessage += 'Server error. Please try again later.';
          break;
        default:
          errorMessage += errorText || response.statusText;
      }
      
      throw new Error(errorMessage);
    }

    const apiResponse: any = await response.json();
    
    // Handle nested response structures
    if (apiResponse.data?.data) {
      return apiResponse.data.data as T;
    } else if (apiResponse.data) {
      return apiResponse.data as T;
    }
    
    return apiResponse as T;
  };

  return {
    fetchApi,
    getApiUrl,
    getHeaders
  };
}; 