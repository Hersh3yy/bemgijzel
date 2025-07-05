import { useApi } from './useApi';

export interface Album {
  id: string;
  title: string;
  description: string;
  cover_image_path: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ImageProperties {
  webp_url?: string;
  type?: string;
  video_id?: string;
  video_type?: string;
  year?: number;
  thumbnail_url?: string;
  video_url?: string;
}

export interface AlbumImage {
  id: string;
  title: string | null;
  description: string | null;
  path: string;
  webp_path: string | null;
  thumbnail_url: string | null;
  webp_url: string | null;
  caption: string | null;
  order: number;
  properties: ImageProperties | string;
  created_at: string;
  updated_at: string;
}

export interface AlbumData {
  album: Album;
  images: AlbumImage[];
}

export const useAlbum = () => {
  const { fetchApi } = useApi();

  const fetchAlbumByTitle = async (title: string): Promise<AlbumData> => {
    const response = await fetchApi<AlbumData>(`/public/albums/by-title/${title}`);
    
    // Ensure properties are parsed for images
    if (response.images) {
      response.images = response.images.map((img: AlbumImage) => ({
        ...img,
        properties: typeof img.properties === 'string' 
          ? JSON.parse(img.properties) 
          : img.properties
      }));
    }
    
    return response;
  };

  const fetchAlbumById = async (id: string): Promise<AlbumData> => {
    const response = await fetchApi<AlbumData>(`/public/albums/${id}`);
    
    // Ensure properties are parsed for images
    if (response.images) {
      response.images = response.images.map((img: AlbumImage) => ({
        ...img,
        properties: typeof img.properties === 'string' 
          ? JSON.parse(img.properties) 
          : img.properties
      }));
    }
    
    return response;
  };

  const fetchAllAlbums = async (): Promise<Album[]> => {
    try {
      // Try public endpoint first
      return await fetchApi<Album[]>('/public/albums');
    } catch (error) {
      // Fallback to authenticated endpoint
      return await fetchApi<Album[]>('/albums');
    }
  };

  const isVideoItem = (image: AlbumImage): boolean => {
    if (typeof image.properties === 'object' && image.properties?.type === 'video') {
      return true;
    }
    
    const path = image.path.toLowerCase();
    const isVideoByPath = path.includes('youtube.com') || 
           path.includes('youtu.be') || 
           path.includes('vimeo.com');
           
    return isVideoByPath;
  };

  const getVideoThumbnail = (image: AlbumImage): string => {
    // First priority: properties.thumbnail_url (parsed object)
    if (typeof image.properties === 'object' && image.properties?.thumbnail_url) {
      return image.properties.thumbnail_url;
    }
    
    // Second priority: direct thumbnail_url field
    if (image.thumbnail_url) {
      return image.thumbnail_url;
    }
    
    // Third priority: try to parse properties if it's a string
    if (typeof image.properties === 'string') {
      try {
        const parsed = JSON.parse(image.properties);
        if (parsed?.thumbnail_url) {
          return parsed.thumbnail_url;
        }
      } catch (e) {
        console.warn('Failed to parse properties JSON for image:', image.id, e);
      }
    }
    
    // Fourth priority: try to generate YouTube thumbnail from video ID or URL
    let videoId = '';
    let url = image.path;
    
    // Try to get video ID from properties first
    if (typeof image.properties === 'object' && image.properties?.video_id) {
      videoId = image.properties.video_id;
    } 
    // Try to get video URL from properties
    else if (typeof image.properties === 'object' && image.properties?.video_url) {
      url = image.properties.video_url;
    }
    
    // Extract video ID from URL if we don't have it
    if (!videoId && url) {
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('youtube.com/watch?v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
    }
    
    // Generate YouTube thumbnail if we have video ID
    if (videoId) {
      const youtubeThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      return youtubeThumb;
    }
    
    // Fallback thumbnail for videos - try a more reliable placeholder
    console.warn('No thumbnail found for video, using fallback:', image.title);
    return `https://via.placeholder.com/800x600/333333/ffffff?text=Video+Thumbnail+Not+Available`;
  };

  const getYouTubeEmbedUrl = (image: AlbumImage): string => {
    try {
      let videoId = '';
      let url = image.path;
      
      if (typeof image.properties === 'object' && image.properties?.video_id) {
        return `https://www.youtube.com/embed/${image.properties.video_id}`;
      }
      
      if (typeof image.properties === 'object' && image.properties?.video_url) {
        url = image.properties.video_url;
      }
      
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('youtube.com/watch?v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch (error) {
      console.warn('Error parsing video URL:', error);
      return '';
    }
  };

  return {
    fetchAlbumByTitle,
    fetchAlbumById,
    fetchAllAlbums,
    isVideoItem,
    getVideoThumbnail,
    getYouTubeEmbedUrl
  };
}; 