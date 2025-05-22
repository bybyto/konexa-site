import React, { useState, useContext, useEffect } from 'react';
import { AssistantContext, DEFAULT_ASSISTANT_THEME } from '../../context/AssistantContext';
import { ThemeContext } from '../../context/ThemeContext';

const AssistantThemeSettings = () => {
  const { assistantTheme, updateAssistantTheme } = useContext(AssistantContext);
  const { theme } = useContext(ThemeContext);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Local state for form values
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: assistantTheme.primaryColor,
    accentColor: assistantTheme.accentColor,
    avatarStyle: assistantTheme.avatarStyle,
    bubbleStyle: assistantTheme.bubbleStyle,
    fontStyle: assistantTheme.fontStyle,
  });
  
  // Sync local state when assistantTheme changes
  useEffect(() => {
    setThemeSettings({
      primaryColor: assistantTheme.primaryColor,
      accentColor: assistantTheme.accentColor,
      avatarStyle: assistantTheme.avatarStyle,
      bubbleStyle: assistantTheme.bubbleStyle,
      fontStyle: assistantTheme.fontStyle,
    });
  }, [assistantTheme]);
  
  // Handle input changes
  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setThemeSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Preview message styling based on current theme settings
  const getGradientStyle = () => {
    return {
      background: `linear-gradient(to right, ${themeSettings.primaryColor}, ${themeSettings.accentColor})`,
    };
  };

  // Get bubble style classes based on selected style
  const getBubbleClasses = () => {
    switch(themeSettings.bubbleStyle) {
      case 'modern':
        return 'rounded-lg shadow-md';
      case 'classic':
        return 'rounded-md border';
      default: // 'rounded'
        return 'rounded-2xl';
    }
  };

  // Get font style classes based on selected style
  const getFontClasses = () => {
    switch(themeSettings.fontStyle) {
      case 'playful':
        return 'font-comic text-lg';
      case 'formal':
        return 'font-serif text-base';
      default: // 'default'
        return 'font-sans text-base';
    }
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    setThemeSettings({
      primaryColor: DEFAULT_ASSISTANT_THEME.primaryColor,
      accentColor: DEFAULT_ASSISTANT_THEME.accentColor,
      avatarStyle: DEFAULT_ASSISTANT_THEME.avatarStyle,
      bubbleStyle: DEFAULT_ASSISTANT_THEME.bubbleStyle,
      fontStyle: DEFAULT_ASSISTANT_THEME.fontStyle,
    });
  };
  
  // Save theme settings
  const handleSaveTheme = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    try {
      updateAssistantTheme(themeSettings);
      setSuccess('Thème de Bybyto mis à jour avec succès!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Échec de mise à jour du thème');
      console.error('Error updating assistant theme:', err);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${theme.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-6">Personnaliser Bybyto</h2>
      
      <div className={`rounded-lg shadow-sm p-6 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}
        
        {/* Preview */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Aperçu</h3>
          <div className="border rounded-lg p-4 mb-4">
            <div className="flex flex-col space-y-4">
              {/* Assistant Message */}
              <div className="flex">
                <div 
                  className={`w-8 h-8 rounded-full mr-2 flex-shrink-0 flex items-center justify-center ${
                    themeSettings.avatarStyle === 'outline' ? 'border-2' : ''
                  }`}
                  style={
                    themeSettings.avatarStyle === 'gradient' 
                      ? getGradientStyle() 
                      : themeSettings.avatarStyle === 'solid'
                        ? { backgroundColor: themeSettings.primaryColor }
                        : { backgroundColor: theme.darkMode ? '#1f2937' : 'white', borderColor: themeSettings.primaryColor }
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={themeSettings.avatarStyle === 'outline' ? themeSettings.primaryColor : 'white'}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-2.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                
                <div 
                  className={`px-4 py-3 ${getBubbleClasses()} max-w-[80%] ${
                    theme.darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <p className={`${getFontClasses()}`}>
                    Bonjour ! Je suis Bybyto, votre assistant. Comment puis-je vous aider aujourd'hui ?
                  </p>
                </div>
              </div>
              
              {/* User Message */}
              <div className="flex justify-end">
                <div 
                  className={`px-4 py-3 ${getBubbleClasses()} max-w-[80%] text-white`}
                  style={getGradientStyle()}
                >
                  <p className={getFontClasses()}>
                    Merci Bybyto, j'aime ton nouveau style !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveTheme}>
          <div className="space-y-6">
            {/* Color Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Couleurs</h3>
              
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Couleur Principale
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    name="primaryColor"
                    value={themeSettings.primaryColor}
                    onChange={handleColorChange}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <input
                    type="text"
                    name="primaryColor"
                    value={themeSettings.primaryColor}
                    onChange={handleColorChange}
                    className={`w-32 px-3 py-2 rounded ${
                      theme.darkMode 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-white text-gray-900 border-gray-300'
                    } border`}
                  />
                </div>
              </div>
              
              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Couleur d'Accent
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    name="accentColor"
                    value={themeSettings.accentColor}
                    onChange={handleColorChange}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <input
                    type="text"
                    name="accentColor"
                    value={themeSettings.accentColor}
                    onChange={handleColorChange}
                    className={`w-32 px-3 py-2 rounded ${
                      theme.darkMode 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-white text-gray-900 border-gray-300'
                    } border`}
                  />
                </div>
              </div>
            </div>
            
            {/* Avatar Style */}
            <div>
              <h3 className="text-lg font-medium mb-2">Style d'Avatar</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectChange('avatarStyle', 'gradient')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.avatarStyle === 'gradient'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center" style={getGradientStyle()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-2.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <span>Dégradé</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChange('avatarStyle', 'solid')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.avatarStyle === 'solid'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center" style={{ backgroundColor: themeSettings.primaryColor }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-2.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <span>Uni</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChange('avatarStyle', 'outline')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.avatarStyle === 'outline'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full mb-2 flex items-center justify-center border-2"
                    style={{ borderColor: themeSettings.primaryColor, backgroundColor: theme.darkMode ? '#1f2937' : 'white' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={themeSettings.primaryColor}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-2.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <span>Contour</span>
                </button>
              </div>
            </div>
            
            {/* Bubble Style */}
            <div>
              <h3 className="text-lg font-medium mb-2">Style des Bulles</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectChange('bubbleStyle', 'rounded')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.bubbleStyle === 'rounded'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  style={themeSettings.bubbleStyle === 'rounded' ? {borderColor: themeSettings.primaryColor} : {}}
                >
                  <div 
                    className="w-16 h-8 rounded-2xl mb-2 flex items-center justify-center px-2"
                    style={{backgroundColor: theme.darkMode ? '#374151' : '#F3F4F6'}}
                  >
                    <div className="w-full h-2 rounded-full" style={{backgroundColor: themeSettings.bubbleStyle === 'rounded' ? themeSettings.primaryColor : '#9CA3AF'}}></div>
                  </div>
                  <span>Arrondi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChange('bubbleStyle', 'modern')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.bubbleStyle === 'modern'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  style={themeSettings.bubbleStyle === 'modern' ? {borderColor: themeSettings.primaryColor} : {}}
                >
                  <div 
                    className="w-16 h-8 rounded-lg shadow-md mb-2 flex items-center justify-center px-2"
                    style={{backgroundColor: theme.darkMode ? '#374151' : '#F3F4F6'}}
                  >
                    <div className="w-full h-2 rounded-full" style={{backgroundColor: themeSettings.bubbleStyle === 'modern' ? themeSettings.primaryColor : '#9CA3AF'}}></div>
                  </div>
                  <span>Moderne</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChange('bubbleStyle', 'classic')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.bubbleStyle === 'classic'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  style={themeSettings.bubbleStyle === 'classic' ? {borderColor: themeSettings.primaryColor} : {}}
                >
                  <div 
                    className="w-16 h-8 rounded-md border mb-2 flex items-center justify-center px-2"
                    style={{
                      backgroundColor: theme.darkMode ? '#374151' : '#F3F4F6',
                      borderColor: themeSettings.bubbleStyle === 'classic' ? themeSettings.primaryColor : '#9CA3AF'
                    }}
                  >
                    <div className="w-full h-2 rounded-full" style={{backgroundColor: themeSettings.bubbleStyle === 'classic' ? themeSettings.primaryColor : '#9CA3AF'}}></div>
                  </div>
                  <span>Classique</span>
                </button>
              </div>
            </div>
            
            {/* Font Style */}
            <div>
              <h3 className="text-lg font-medium mb-2">Style de Texte</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectChange('fontStyle', 'default')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.fontStyle === 'default'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  style={themeSettings.fontStyle === 'default' ? {borderColor: themeSettings.primaryColor} : {}}
                >
                  <span className="font-sans text-lg mb-1" style={themeSettings.fontStyle === 'default' ? {color: themeSettings.primaryColor} : {}}>Aa</span>
                  <span>Par défaut</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChange('fontStyle', 'playful')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.fontStyle === 'playful'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  style={themeSettings.fontStyle === 'playful' ? {borderColor: themeSettings.primaryColor} : {}}
                >
                  <span className="font-comic text-lg mb-1" style={themeSettings.fontStyle === 'playful' ? {color: themeSettings.primaryColor} : {}}>Aa</span>
                  <span>Ludique</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChange('fontStyle', 'formal')}
                  className={`p-3 flex flex-col items-center border rounded-lg ${
                    themeSettings.fontStyle === 'formal'
                      ? `border-[${themeSettings.primaryColor}] bg-opacity-10 bg-blue-500 dark:bg-opacity-20`
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  style={themeSettings.fontStyle === 'formal' ? {borderColor: themeSettings.primaryColor} : {}}
                >
                  <span className="font-serif text-lg mb-1" style={themeSettings.fontStyle === 'formal' ? {color: themeSettings.primaryColor} : {}}>Aa</span>
                  <span>Formel</span>
                </button>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#6B7280' }}
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                style={getGradientStyle()}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantThemeSettings;