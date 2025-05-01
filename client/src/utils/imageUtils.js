/**
 * Utility functions for handling images
 */

/**
 * Default image to use when no image is provided
 */
export const DEFAULT_IMAGE = 'https://via.placeholder.com/500x300?text=No+Image+Available';

/**
 * Fallback image to use when an image fails to load
 */
export const FALLBACK_IMAGE = 'https://via.placeholder.com/500x300?text=Image+Not+Found';

/**
 * Handle image error by replacing with a fallback image
 * @param {Event} event - The error event
 */
export const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src);
  event.target.onerror = null; // Prevent infinite loop
  event.target.src = FALLBACK_IMAGE;
};

/**
 * Get a safe image URL with fallback
 * @param {string} url - The original image URL
 * @returns {string} - A safe image URL with fallback
 */
export const getSafeImageUrl = (url) => {
  if (!url) return DEFAULT_IMAGE;
  
  // Handle relative paths
  if (url.startsWith('/')) {
    return url;
  }
  
  // Handle absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle local images
  try {
    return require(`../${url}`);
  } catch (error) {
    console.error('Error loading image:', error);
    return DEFAULT_IMAGE;
  }
};

/**
 * Preload an image to ensure it's cached
 * @param {string} url - The image URL to preload
 */
export const preloadImage = (url) => {
  const img = new Image();
  img.src = getSafeImageUrl(url);
  return img;
};