/**
 * File utility functions for Konexa community website
 * Handles file processing operations
 */

// Convert a file object to a data URL
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

// Validate file type for uploads
export const isValidFileType = (file, allowedTypes = ['image/', 'video/']) => {
  if (!file) return false;
  
  return allowedTypes.some(type => file.type.startsWith(type));
};

// Validate file size
export const isValidFileSize = (file, maxSizeMB = 10) => {
  if (!file) return false;
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Get file extension from file object
export const getFileExtension = (file) => {
  if (!file || !file.name) return '';
  
  return file.name.split('.').pop().toLowerCase();
};

// Get file type category (image, video, etc.)
export const getFileTypeCategory = (file) => {
  if (!file || !file.type) return 'unknown';
  
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  
  return 'document';
};

// Generate a placeholder image URL based on text
export const generatePlaceholderImage = (text, size = 200) => {
  const backgroundColor = stringToColor(text);
  const textColor = getContrastColor(backgroundColor);
  
  // First letter or first two letters if available
  const initials = text.substring(0, 2).toUpperCase();
  
  return `https://via.placeholder.com/${size}x${size}/${backgroundColor.substring(1)}/${textColor.substring(1)}?text=${initials}`;
};

// Helper: Convert a string to a color hex code
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }
  
  return color;
}

// Helper: Get contrast color (black or white) for given background color
function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}