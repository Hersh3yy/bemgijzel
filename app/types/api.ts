// Shared API types
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
  [key: string]: any; // Allow additional properties
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

export interface MosaicItem {
  id: string;
  column_index: number;
  type: string;
  content: string | null;
  album_id: string | null;
  properties: {
    album: {
      id: string;
      title: string;
      cover_image_path: string;
    };
    selected_image?: {
      id: string;
      path: string;
      title: string | null;
      caption: string | null;
      properties?: string;
    };
    link?: string;
    edit_text?: string;
  };
  order: number;
  is_active: boolean;
}

export interface MosaicData {
  mosaic: {
    id: string;
    title: string;
    description: string;
    columns: number;
    display_settings: any;
  };
  items: MosaicItem[];
}

// API Response wrapper types
export interface ApiResponse<T = any> {
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

// API Configuration types
export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

// Error handling types
export interface ApiError {
  status: number;
  message: string;
  originalError?: Error;
} 