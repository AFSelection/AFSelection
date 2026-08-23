import { fetchDefaultMediaSettings } from '../services/storage';

export const DEFAULT_INSTAGRAM_REEL = 'https://www.instagram.com/reel/C3x9-V4xgL1/';

let cachedDefaultMedia = {
  instagramUrl: DEFAULT_INSTAGRAM_REEL,
  videoFile: null
};

// Fetch dynamic default video settings from Supabase site_settings
fetchDefaultMediaSettings().then((media) => {
  if (media) cachedDefaultMedia = media;
});

export function isInstagramUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('instagram.com') || url.includes('instagr.am');
}

export function parseInstagramUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // Match Instagram Reel/Post shortcode: /reel/SHORTCODE/ or /p/SHORTCODE/ or /tv/SHORTCODE/
  const match = url.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i);
  if (match && match[1]) {
    const shortcode = match[1];
    return {
      shortcode,
      embedUrl: `https://www.instagram.com/p/${shortcode}/embed/`,
      directUrl: `https://www.instagram.com/reel/${shortcode}/`
    };
  }
  return {
    shortcode: null,
    embedUrl: url,
    directUrl: url.startsWith('http') ? url : `https://${url}`
  };
}

export function getListingVideos(item) {
  if (item && Array.isArray(item.videos) && item.videos.length > 0) {
    return item.videos;
  }
  const defaults = [];
  if (cachedDefaultMedia.videoFile) {
    defaults.push(cachedDefaultMedia.videoFile);
  }
  if (cachedDefaultMedia.instagramUrl) {
    defaults.push(cachedDefaultMedia.instagramUrl);
  }
  return defaults.length > 0 ? defaults : [DEFAULT_INSTAGRAM_REEL];
}
