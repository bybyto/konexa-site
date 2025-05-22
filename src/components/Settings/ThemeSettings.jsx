import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeSettings = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const [color, setColor] = useState(theme.backgroundColor || '#f0f4f8');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(theme.backgroundImage || '');
  const [success, setSuccess] = useState('');

  const colorOptions = [
    { name: 'Light Blue', value: '#f0f4f8' },
    { name: 'Soft Pink', value: '#fce7f3' },
    { name: 'Mint', value: '#ecfdf5' },
    { name: 'Lavender', value: '#f3e8ff' },
    { name: 'Peach', value: '#fff7ed' },
    { name: 'Gray', value: '#f3f4f6' }
  ];

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setPreviewUrl('');
    updateTheme({ backgroundColor: newColor, backgroundImage: null });
    showSuccess();
  };

  const handleDarkModeToggle = () => {
    updateTheme({ darkMode: !theme.darkMode });
    showSuccess();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setUploadedImage(file);
    
    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleSubmitImage = (e) => {
    e.preventDefault();

    if (uploadedImage) {
      // Convert uploaded image to data URL
      const reader = new FileReader();
      reader.onload = () => {
        updateTheme({ backgroundImage: reader.result, backgroundColor: null });
        showSuccess();
      };
      reader.readAsDataURL(uploadedImage);
    } else if (backgroundImageUrl) {
      updateTheme({ backgroundImage: backgroundImageUrl, backgroundColor: null });
      showSuccess();
    }
  };

  const clearBackground = () => {
    setPreviewUrl('');
    setBackgroundImageUrl('');
    setUploadedImage(null);
    updateTheme({ backgroundImage: null, backgroundColor: '#f0f4f8' });
    setColor('#f0f4f8');
    showSuccess();
  };

  const showSuccess = () => {
    setSuccess('Theme updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className={`max-w-2xl mx-auto ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-6">Appearance Settings</h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          {success}
        </div>
      )}
      
      <div className={`rounded-lg shadow-sm p-6 mb-8 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-medium mb-4">Theme Mode</h3>
        
        <div className="flex items-center justify-between">
          <span>Dark mode</span>
          <button
            onClick={handleDarkModeToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
              theme.darkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                theme.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      <div className={`rounded-lg shadow-sm p-6 mb-8 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-medium mb-4">Background Color</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleColorChange(option.value)}
              className={`h-12 rounded-lg border-2 transition-all ${
                color === option.value 
                  ? 'border-blue-500 ring-2 ring-blue-300'
                  : theme.darkMode ? 'border-gray-600' : 'border-gray-200'
              }`}
              style={{ backgroundColor: option.value }}
              aria-label={option.name}
            />
          ))}
        </div>
      </div>
      
      <div className={`rounded-lg shadow-sm p-6 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-medium mb-4">Custom Background</h3>
        
        {previewUrl && (
          <div className="mb-4 relative">
            <img 
              src={previewUrl} 
              alt="Background Preview" 
              className="w-full h-40 object-cover rounded-lg" 
            />
            <button
              onClick={clearBackground}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              aria-label="Clear background image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmitImage}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Upload an image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={`w-full p-2 rounded-lg border ${ 
                theme.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-gray-500'
                  : 'bg-white border-gray-300 text-gray-800 file:bg-gray-200 file:text-gray-700 file:border-gray-300'
              } file:py-1 file:px-2 file:rounded file:border file:mr-2 file:font-medium focus:outline-none`}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="image-url" className="block text-sm font-medium mb-2">
              Or enter an image URL
            </label>
            <input
              type="text"
              id="image-url"
              value={backgroundImageUrl}
              onChange={(e) => setBackgroundImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`w-full p-3 rounded-lg border ${
                theme.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={!backgroundImageUrl && !uploadedImage}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
                !backgroundImageUrl && !uploadedImage 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-600'
              }`}
            >
              Set Background Image
            </button>
            
            {(theme.backgroundImage || previewUrl) && (
              <button
                type="button"
                onClick={clearBackground}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThemeSettings;