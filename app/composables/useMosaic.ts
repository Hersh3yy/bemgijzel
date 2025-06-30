import { logger } from '~/utils/logger';

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

export const useMosaic = () => {
  const { fetchApi } = useApi();
  const router = useRouter();

  const fetchMosaicByTitle = async (title: string): Promise<MosaicData> => {
    return await fetchApi<MosaicData>(`/public/mosaics/by-title/${title}`);
  };

  const getImageUrl = (item: MosaicItem): string => {
    // First check if we have a selected_image
    if (item.properties.selected_image) {
      const selectedImage = item.properties.selected_image;
      
      // Parse properties JSON if it exists
      let imageProperties = null;
      if (selectedImage.properties) {
        try {
          imageProperties = JSON.parse(selectedImage.properties);
        } catch (e) {
          // Silently ignore parsing errors
        }
      }
      
      // For video items, use the thumbnail_url from properties
      if (imageProperties?.type === 'video' && imageProperties?.thumbnail_url) {
        return imageProperties.thumbnail_url;
      }
      
      // For video URLs (YouTube, etc.), use thumbnail_url if available
      const path = selectedImage.path.toLowerCase();
      if ((path.includes('youtube.com') || path.includes('youtu.be') || path.includes('vimeo.com')) && imageProperties?.thumbnail_url) {
        return imageProperties.thumbnail_url;
      }
      
      // For regular images, use the path
      return selectedImage.path;
    }
    
    // Fallback to album cover
    return item.properties.album?.cover_image_path || 
           `https://picsum.photos/800/800?random=${item.id.slice(-1)}`;
  };

  const getImageAlt = (item: MosaicItem): string => {
    return item.properties.selected_image?.caption || 
           item.properties.selected_image?.title ||
           item.properties.edit_text ||
           item.properties.album?.title || 
           'Mosaic item';
  };

  const getItemTitle = (item: MosaicItem): string => {
    // Use edit_text first (this is the main display text from the API)
    return item.properties.edit_text || 
           item.properties.album?.title || 
           '';
  };

  const isVideoItem = (item: MosaicItem): boolean => {
    if (!item.properties.selected_image) return false;
    
    const selectedImage = item.properties.selected_image;
    
    // Check properties JSON for video type
    if (selectedImage.properties) {
      try {
        const imageProperties = JSON.parse(selectedImage.properties);
        if (imageProperties.type === 'video') return true;
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    // Check URL patterns
    const path = selectedImage.path.toLowerCase();
    return path.includes('youtube.com') || 
           path.includes('youtu.be') || 
           path.includes('vimeo.com');
  };

  const isClickable = (item: MosaicItem): boolean => {
    return !!item.properties.link || (item.type === 'album' && !!item.properties.album);
  };

  const navigateToItem = (item: MosaicItem): void => {
    // Handle custom link property first
    if (item.properties.link) {
      const link = item.properties.link;
      
      // If it's just one word, treat as album title
      if (!/\s/.test(link) && !link.includes('/') && !link.includes('.')) {
        router.push(`/albums/${link}`);
        return;
      }
      
      // If starts with '/', treat as relative URL
      if (link.startsWith('/')) {
        router.push(link);
        return;
      }
      
      // Otherwise treat as external URL
      window.open(link, '_blank');
      return;
    }
    
    // Fallback to original album navigation
    if (item.type === 'album' && item.properties.album) {
      router.push(`/albums/${item.properties.album.title}`);
    }
  };

  const getItemsForColumn = (items: MosaicItem[], columnIndex: number): MosaicItem[] => {
    return items
      .filter(item => item.column_index === columnIndex && item.is_active)
      .sort((a, b) => a.order - b.order);
  };

  const calculateColumnHeights = (items: MosaicItem[], numberOfColumns: number): number[] => {
    const counts: number[] = [];
    for (let i = 0; i < numberOfColumns; i++) {
      const columnItems = getItemsForColumn(items, i);
      counts.push(columnItems.length);
    }
    return counts;
  };

  const calculateTileHeight = (columnItems: number, totalHeight: number = 85): string => {
    if (columnItems === 0) return '25vh';
    
    // Total available height divided by number of items in this column
    const calculatedHeight = totalHeight / columnItems;
    
    // Set reasonable bounds
    const minHeight = 15; // Minimum 15vh per tile
    const maxHeight = 40; // Maximum 40vh per tile
    
    const finalHeight = Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
    
    return `${finalHeight}vh`;
  };

  return {
    fetchMosaicByTitle,
    getImageUrl,
    getImageAlt,
    getItemTitle,
    isVideoItem,
    isClickable,
    navigateToItem,
    getItemsForColumn,
    calculateColumnHeights,
    calculateTileHeight
  };
}; 