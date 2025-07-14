import type { MosaicItem, MosaicData } from '~/types/api';
import { useApi } from './useApi';
import { useMedia } from './useMedia';
import { logger } from '~/utils/logger';

export const useMosaic = () => {
  const { fetchApi } = useApi();
  const { isMosaicVideoItem, getMosaicImageUrl } = useMedia();
  const router = useRouter();

  const fetchMosaicByTitle = async (title: string): Promise<MosaicData> => {
    return await fetchApi<MosaicData>(`/public/mosaics/by-title/${title}`);
  };

  const getImageUrl = (item: MosaicItem): string => {
    return getMosaicImageUrl(item);
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
    return isMosaicVideoItem(item);
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