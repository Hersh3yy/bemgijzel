import type { Album, AlbumData, AlbumImage } from '~/types/api';
import { useApi } from './useApi';
import { useMedia } from './useMedia';

export const useAlbum = () => {
  const { fetchApi, fetchWithFallback, transformAlbumData } = useApi();
  const { isVideoItem, getVideoThumbnail, getYouTubeEmbedUrl } = useMedia();

  const fetchAlbumByTitle = async (title: string): Promise<AlbumData> => {
    const response = await fetchApi<AlbumData>(`/public/albums/by-title/${title}`);
    return transformAlbumData(response);
  };

  const fetchAlbumById = async (id: string): Promise<AlbumData> => {
    const response = await fetchApi<AlbumData>(`/public/albums/${id}`);
    return transformAlbumData(response);
  };

  const fetchAllAlbums = async (): Promise<Album[]> => {
    return await fetchWithFallback<Album[]>('/public/albums', '/albums');
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