import type { AlbumImage, ImageProperties, MosaicItem } from '~/types/api';
import { logger } from '~/utils/logger';

export const useMedia = () => {
  
  /**
   * Parse properties from string or return as object
   */
  const parseProperties = (properties: ImageProperties | string): ImageProperties => {
    if (typeof properties === 'string') {
      try {
        return JSON.parse(properties);
      } catch (e) {
        logger.warn('Failed to parse properties JSON:', e);
        return {};
      }
    }
    return properties || {};
  };

  /**
   * Determine if an album image is a video
   */
  const isVideoItem = (image: AlbumImage): boolean => {
    const props = parseProperties(image.properties);
    
    if (props.type === 'video') {
      return true;
    }
    
    const path = image.path.toLowerCase();
    return path.includes('youtube.com') || 
           path.includes('youtu.be') || 
           path.includes('vimeo.com');
  };

  /**
   * Determine if a mosaic item is a video
   */
  const isMosaicVideoItem = (item: MosaicItem): boolean => {
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

  /**
   * Extract video ID from various URL formats
   */
  const extractVideoId = (url: string): string => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('youtube.com/watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    return '';
  };

  /**
   * Get video thumbnail URL with multiple fallback strategies
   */
  const getVideoThumbnail = (image: AlbumImage): string => {
    const props = parseProperties(image.properties);
    
    // First priority: properties.thumbnail_url
    if (props.thumbnail_url) {
      return props.thumbnail_url;
    }
    
    // Second priority: direct thumbnail_url field
    if (image.thumbnail_url) {
      return image.thumbnail_url;
    }
    
    // Third priority: try to generate YouTube thumbnail from video ID or URL
    let videoId = '';
    let url = image.path;
    
    // Try to get video ID from properties first
    if (props.video_id) {
      videoId = props.video_id;
    } 
    // Try to get video URL from properties
    else if (props.video_url) {
      url = props.video_url;
    }
    
    // Extract video ID from URL if we don't have it
    if (!videoId && url) {
      videoId = extractVideoId(url);
    }
    
    // Generate YouTube thumbnail if we have video ID
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    // Fallback thumbnail for videos
    logger.warn('No thumbnail found for video, using fallback:', image.title);
    return `https://via.placeholder.com/800x600/333333/ffffff?text=Video+Thumbnail+Not+Available`;
  };

  /**
   * Get YouTube embed URL
   */
  const getYouTubeEmbedUrl = (image: AlbumImage): string => {
    try {
      const props = parseProperties(image.properties);
      
      if (props.video_id) {
        return `https://www.youtube.com/embed/${props.video_id}`;
      }
      
      let url = image.path;
      if (props.video_url) {
        url = props.video_url;
      }
      
      const videoId = extractVideoId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch (error) {
      logger.warn('Error parsing video URL:', error);
      return '';
    }
  };

  /**
   * Handle image loading errors with multiple fallback strategies
   */
  const handleImageError = (event: Event, image: AlbumImage) => {
    const target = event.target as HTMLImageElement;
    logger.error('Error loading image:', {
      title: image.title,
      path: image.path,
      thumbnail_url: image.thumbnail_url,
      properties: image.properties,
      src: target.src,
      isVideo: isVideoItem(image)
    });
    
    // For video items, try multiple fallback strategies
    if (isVideoItem(image)) {
      const props = parseProperties(image.properties);
      
      // First fallback: try thumbnail_url if we weren't using it already
      if (target.src !== image.thumbnail_url && image.thumbnail_url) {
        logger.info('Trying thumbnail_url fallback for video:', image.thumbnail_url);
        target.src = image.thumbnail_url;
        return;
      }
      
      // Second fallback: try properties.thumbnail_url if different
      if (props.thumbnail_url && target.src !== props.thumbnail_url) {
        logger.info('Trying properties.thumbnail_url fallback for video:', props.thumbnail_url);
        target.src = props.thumbnail_url;
        return;
      }
      
      // Third fallback: try YouTube thumbnails with different qualities
      const videoId = props.video_id || extractVideoId(props.video_url || image.path);
      
      if (videoId) {
        const youtubeFallback = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        if (target.src !== youtubeFallback) {
          logger.info('Trying YouTube API fallback for video:', youtubeFallback);
          target.src = youtubeFallback;
          return;
        }
        
        // Try medium quality if maxres fails
        const youtubeMedium = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        if (target.src !== youtubeMedium) {
          logger.info('Trying YouTube medium quality fallback for video:', youtubeMedium);
          target.src = youtubeMedium;
          return;
        }
      }
      
      // Final fallback: placeholder image
      const placeholder = `https://via.placeholder.com/800x600/333333/ffffff?text=Video+Thumbnail+Unavailable`;
      if (target.src !== placeholder) {
        logger.info('Using placeholder fallback for video:', placeholder);
        target.src = placeholder;
      }
    } else {
      // For regular images, try webp_url or thumbnail_url fallbacks
      if (image.webp_url && target.src !== image.webp_url) {
        logger.info('Trying webp_url fallback for image:', image.webp_url);
        target.src = image.webp_url;
      } else if (image.thumbnail_url && target.src !== image.thumbnail_url) {
        logger.info('Trying thumbnail_url fallback for image:', image.thumbnail_url);
        target.src = image.thumbnail_url;
      }
    }
  };

  /**
   * Handle successful image load
   */
  const handleImageLoad = (event: Event, image: AlbumImage) => {
    const target = event.target as HTMLImageElement;
    logger.debug('Image loaded successfully:', {
      title: image.title,
      src: target.src,
      isVideo: isVideoItem(image)
    });
  };

  /**
   * Get best image URL for display (prioritizes webp, then thumbnail, then original)
   */
  const getBestImageUrl = (image: AlbumImage): string => {
    if (isVideoItem(image)) {
      return getVideoThumbnail(image);
    }
    
    return image.thumbnail_url || image.webp_url || image.path;
  };

  /**
   * Get mosaic item image URL
   */
  const getMosaicImageUrl = (item: MosaicItem): string => {
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

  return {
    parseProperties,
    isVideoItem,
    isMosaicVideoItem,
    extractVideoId,
    getVideoThumbnail,
    getYouTubeEmbedUrl,
    handleImageError,
    handleImageLoad,
    getBestImageUrl,
    getMosaicImageUrl
  };
}; 