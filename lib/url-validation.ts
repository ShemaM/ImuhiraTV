/**
 * URL Validation utilities to prevent SSRF (Server-Side Request Forgery) attacks
 * 
 * These utilities ensure that user-provided URLs are validated against an allowlist
 * of trusted hostnames and don't contain path traversal patterns.
 */

/**
 * Allowlist of trusted hostnames for image URLs
 */
const ALLOWED_IMAGE_HOSTNAMES = [
  'img.youtube.com',
  'i.ytimg.com',
  'images.unsplash.com',
  'cdn.pixabay.com',
  'images.pexels.com',
  // Add more trusted image hosting domains as needed
];

/**
 * Allowlist of trusted hostnames for video embeds
 */
const ALLOWED_VIDEO_HOSTNAMES = [
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
];

/**
 * Pattern to detect path traversal attempts
 */
const PATH_TRAVERSAL_PATTERN = /(?:^|[/\\])\.\.(?:[/\\]|$)/;

/**
 * Pattern to validate YouTube video IDs (11 characters, alphanumeric with - and _)
 */
const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Validates a YouTube video ID
 * @param videoId - The video ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidYouTubeVideoId(videoId: string | null | undefined): boolean {
  if (!videoId) return false;
  return YOUTUBE_VIDEO_ID_PATTERN.test(videoId);
}

/**
 * Extracts and validates a YouTube video ID from various URL formats
 * @param url - The URL or video ID to process
 * @returns The validated video ID or null if invalid
 */
export function extractAndValidateYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  // If it's already just a video ID
  if (YOUTUBE_VIDEO_ID_PATTERN.test(url)) {
    return url;
  }

  try {
    // Parse the URL to ensure it's a valid URL
    const parsedUrl = new URL(url);
    
    // Check hostname against allowlist
    if (!ALLOWED_VIDEO_HOSTNAMES.includes(parsedUrl.hostname)) {
      return null;
    }

    // Extract video ID based on URL format
    let videoId: string | null = null;

    if (parsedUrl.hostname === 'youtu.be') {
      // Format: https://youtu.be/VIDEO_ID
      videoId = parsedUrl.pathname.slice(1);
    } else if (parsedUrl.hostname.includes('youtube.com')) {
      // Format: https://www.youtube.com/watch?v=VIDEO_ID
      // or: https://www.youtube.com/embed/VIDEO_ID
      // or: https://www.youtube.com/v/VIDEO_ID
      const vParam = parsedUrl.searchParams.get('v');
      if (vParam) {
        videoId = vParam;
      } else {
        const pathMatch = parsedUrl.pathname.match(/(?:embed|v)\/([a-zA-Z0-9_-]{11})/);
        if (pathMatch) {
          videoId = pathMatch[1];
        }
      }
    }

    // Validate the extracted video ID
    if (videoId && YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) {
      return videoId;
    }
  } catch {
    // Invalid URL format
    return null;
  }

  return null;
}

/**
 * Validates an image URL against the allowlist of trusted hostnames.
 * Returns true for empty/null URLs (treats them as optional fields).
 * @param url - The URL to validate
 * @returns true if the URL is empty or from a trusted hostname, false if invalid
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return true; // Empty URLs are considered valid (optional field)
  
  try {
    const parsedUrl = new URL(url);
    
    // Check for path traversal
    if (PATH_TRAVERSAL_PATTERN.test(parsedUrl.pathname)) {
      return false;
    }

    // Check protocol (only allow https)
    if (parsedUrl.protocol !== 'https:') {
      return false;
    }

    // Check hostname against allowlist
    return ALLOWED_IMAGE_HOSTNAMES.includes(parsedUrl.hostname);
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Validates a video URL against the allowlist of trusted hostnames.
 * Returns true for empty/null URLs (treats them as optional fields).
 * @param url - The URL to validate
 * @returns true if the URL is empty or from a trusted hostname, false if invalid
 */
export function isValidVideoUrl(url: string | null | undefined): boolean {
  if (!url) return true; // Empty URLs are considered valid (optional field)
  
  try {
    const parsedUrl = new URL(url);
    
    // Check for path traversal
    if (PATH_TRAVERSAL_PATTERN.test(parsedUrl.pathname)) {
      return false;
    }

    // Check protocol (only allow https)
    if (parsedUrl.protocol !== 'https:') {
      return false;
    }

    // Check hostname against allowlist
    return ALLOWED_VIDEO_HOSTNAMES.includes(parsedUrl.hostname);
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Returns the list of allowed image hostnames (for display/documentation purposes)
 */
export function getAllowedImageHostnames(): string[] {
  return [...ALLOWED_IMAGE_HOSTNAMES];
}

/**
 * Returns the list of allowed video hostnames (for display/documentation purposes)
 */
export function getAllowedVideoHostnames(): string[] {
  return [...ALLOWED_VIDEO_HOSTNAMES];
}
