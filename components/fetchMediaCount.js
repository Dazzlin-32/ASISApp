
import * as MediaLibrary from 'expo-media-library';

export const fetchMediaCount = async () => {

    try {
      // Request media library permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      // Fetch photos
      const photos = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        first: 100000, // Large number to fetch all items
      });
      const photoCount = photos.totalCount

      // Fetch videos
      const videos = await MediaLibrary.getAssetsAsync({
        mediaType: 'video',
        first: 100000, // Large number to fetch all items
      });
      const videoCount = videos.totalCount
      return { photoCount, videoCount };

    } catch (error) {
      console.log('Error fetching media:', error);
      return null;
    }
    
  };