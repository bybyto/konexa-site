import React, { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { ThemeContext } from './ThemeContext';

// Create the Assistant Context
export const AssistantContext = createContext();

// Default assistant theme settings
export const DEFAULT_ASSISTANT_THEME = {
  primaryColor: '#4f46e5', // Default primary color (indigo-600)
  accentColor: '#7c3aed', // Default accent color (purple-600)
  avatarStyle: 'gradient', // Options: 'gradient', 'solid', 'outline'
  bubbleStyle: 'rounded', // Options: 'rounded', 'modern', 'classic'
  fontStyle: 'default', // Options: 'default', 'playful', 'formal'
};

export const AssistantProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [hasBeenWelcomed, setHasBeenWelcomed] = useState(false);
  const [assistantTheme, setAssistantTheme] = useState(DEFAULT_ASSISTANT_THEME);

  // Initial greeting message
  useEffect(() => {
    if (user && !hasBeenWelcomed) {
      sendWelcomeMessage();
      setHasBeenWelcomed(true);
    }
  }, [user]);

  // Load conversation history and theme from localStorage
  useEffect(() => {
    if (user) {
      // Load conversation history
      const savedMessages = JSON.parse(localStorage.getItem(`konexa_assistant_${user.username}`)) || [];
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
        setConversationHistory(savedMessages.map(msg => ({
          role: msg.sender === 'assistant' ? 'assistant' : 'user',
          content: msg.text
        })));
      } else {
        sendWelcomeMessage();
      }
      
      // Load assistant theme preferences
      const savedAssistantTheme = JSON.parse(localStorage.getItem(`konexa_assistant_theme_${user.username}`));
      if (savedAssistantTheme) {
        setAssistantTheme(savedAssistantTheme);
      } else {
        localStorage.setItem(`konexa_assistant_theme_${user.username}`, JSON.stringify(DEFAULT_ASSISTANT_THEME));
      }
    }
  }, [user]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`konexa_assistant_${user.username}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Toggle assistant visibility
  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      sendWelcomeMessage();
    }
  };

  // Send welcome message based on time of day
  const sendWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = 'Bonjour';
    } else if (hour < 18) {
      greeting = 'Bon après-midi';
    } else {
      greeting = 'Bonsoir';
    }
    
    const welcomeMessage = `${greeting} ${user ? user.username : ''}! 👋\n\nJe suis Bybyto, votre assistant intelligent pour la plateforme Konexa.\n\nKonexa est un espace communautaire anonyme où tout le monde peut parler, partager, se divertir, ouvrir des sujets librement et dans le respect. Chacun peut rester anonyme tout en créant des liens sincères.\n\nLe site Konexa a été créé avec passion par Rooby.\n\nComment puis-je vous aider aujourd'hui ?`;
    
    addMessage(welcomeMessage, 'assistant');
  };

  // Add a message to the messages array
  const addMessage = (text, sender) => {
    const newMessage = {
      text,
      sender,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    if (sender === 'user') {
      setConversationHistory(prev => [...prev, { role: 'user', content: text }]);
    } else {
      setConversationHistory(prev => [...prev, { role: 'assistant', content: text }]);
    }
  };

  // Process user message and generate response
  const processUserMessage = async (userMessage) => {
    setIsTyping(true);
    
    // In a real implementation, this would call OpenAI or another LLM API
    // For now we'll simulate an intelligent response with a delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1500));
    
    let response;
    const userMessageLower = userMessage.toLowerCase();
    
    // Enhanced pattern matching for common questions with more dynamic responses
    if (userMessageLower.match(/\b(bonjour|salut|hello|coucou|hey)\b/)) {
      const greetings = [
        `Bonjour ${user?.username || ''}! Comment puis-je vous aider aujourd'hui?`,
        `Salut ${user?.username || ''}! Ravi de vous revoir. Que puis-je faire pour vous?`,
        `Bonjour! Je suis Bybyto, prêt à répondre à toutes vos questions sur Konexa.`
      ];
      response = greetings[Math.floor(Math.random() * greetings.length)];
    }
    else if (userMessageLower.match(/\b(fonctionn|utiliser|marche|comment|aide|guide)\b/)) {
      response = "Konexa est simple à utiliser :\n\n1. Parcourez la communauté pour voir les messages publics\n2. Participez aux sondages hebdomadaires\n3. Envoyez des messages privés en cliquant sur le nom d'un utilisateur\n4. Personnalisez vos paramètres dans la section réglages\n\nJe peux vous guider pour chaque fonctionnalité spécifique si vous le souhaitez!";
    }
    else if (userMessageLower.match(/\b(créateur|créé|créateur|fondateur|rooby)\b/)) {
      response = "Le site Konexa a été créé avec passion par Rooby. Son objectif était de rapprocher les gens dans un cadre sain et bienveillant, tout en respectant leur anonymat. C'est une plateforme qui permet de créer des liens sincères tout en préservant votre vie privée.";
    }
    else if (userMessageLower.match(/\b(anonym|privé|confidential|secret|données|personnelles)\b/)) {
      response = "L'anonymat est au cœur de Konexa. Votre vrai nom n'est jamais affiché - seul votre pseudo est visible par les autres utilisateurs. Même dans les conversations privées, vous restez anonyme. Nous prenons très au sérieux la protection de votre vie privée et de vos données personnelles.";
    }
    else if (userMessageLower.match(/\b(sondage|poll|vote|question|opinion)\b/)) {
      response = "Les sondages sont publiés régulièrement sur des sujets variés et d'actualité. Vous pouvez voter et voir les résultats en temps réel. Chaque vote est anonyme, et les résultats sont partagés avec toute la communauté. Si vous avez une idée de sondage intéressante, n'hésitez pas à la suggérer!";
    }
    else if (userMessageLower.match(/\b(message|messagerie|mp|dm|communiqu|conversation|privé)\b/)) {
      response = "Pour accéder à la messagerie, cliquez sur 'Messagerie' dans la barre latérale. Pour envoyer un message privé à un utilisateur, cliquez sur son nom dans la section communauté, puis sur 'Discuter en privé'. Vos conversations privées sont chiffrées et sécurisées.\n\nN'oubliez pas que vous pouvez toujours revenir à l'accueil avec le bouton 'Retour à l'accueil' en haut de la page messagerie.";
    }
    else if (userMessageLower.match(/\b(merci|thanks|thx|remercie)\b/)) {
      const thankResponses = [
        "Avec plaisir! N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider.",
        "Je vous en prie. C'est toujours un plaisir de vous aider dans votre expérience sur Konexa!",
        "De rien! N'hésitez pas à revenir vers moi si vous avez besoin de quoi que ce soit."
      ];
      response = thankResponses[Math.floor(Math.random() * thankResponses.length)];
    }
    else if (userMessageLower.match(/\b(qui es[\-\s]tu|t'appelles|ton nom|bybyto)\b/)) {
      response = "Je suis Bybyto, l'assistant intelligent de Konexa. J'ai été conçu pour vous aider à naviguer sur la plateforme, répondre à vos questions et améliorer votre expérience utilisateur. Je parle uniquement français et j'apprends constamment pour mieux vous servir. Le site Konexa a été créé avec passion par Rooby, et je suis là pour représenter cet esprit d'entraide et de communauté.";
    }
    else if (userMessageLower.match(/\b(paramètre|réglage|setting|profil|compte|préférence)\b/)) {
      response = "Vous pouvez personnaliser votre expérience Konexa dans la section 'Réglages'. Vous y trouverez des options pour modifier votre profil, gérer vos notifications, changer vos préférences visuelles et configurer vos paramètres de confidentialité. Votre expérience sur Konexa est entièrement personnalisable!";
    }
    else if (userMessageLower.match(/\b(comment te contacter|assistance|problème|aide|bug|erreur)\b/)) {
      response = "Si vous rencontrez un problème technique ou avez besoin d'une assistance particulière, vous pouvez contacter l'équipe Konexa via la section 'Aide' dans les réglages. Je suis également là pour essayer de résoudre vos problèmes les plus courants. Décrivez-moi ce que vous rencontrez comme difficulté, et je ferai de mon mieux pour vous aider.";
    }
    else {
      // More sophisticated default responses for general queries
      const defaultResponses = [
        `Merci pour votre message. Je suis Bybyto, votre assistant intelligent sur Konexa. Comment puis-je vous aider davantage aujourd'hui?`,
        `Je comprends votre question. Pour y répondre au mieux, pourriez-vous me donner plus de détails? Je suis là pour vous guider sur tous les aspects de Konexa.`,
        `C'est une excellente question! En tant qu'assistant évolutif, j'apprends constamment pour améliorer mes réponses. Le site Konexa a été créé avec passion par Rooby, et je suis là pour vous aider à en tirer le meilleur parti.`,
        `Votre question est intéressante! Je vous invite à explorer les différentes sections de Konexa pour découvrir toutes les possibilités offertes par la plateforme. Y a-t-il un aspect particulier qui vous intéresse?`,
        `Je suis Bybyto, l'assistant intelligent de Konexa, et je suis là pour vous guider. Que souhaitez-vous savoir sur notre communauté?`
      ];
      
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    setIsTyping(false);
    addMessage(response, 'assistant');
  };

  // Send message (from user or assistant)
  const sendMessage = (text, sender = 'user') => {
    addMessage(text, sender);
    
    // If message is from user, generate assistant response
    if (sender === 'user') {
      processUserMessage(text);
    }
  };

  // Clear conversation history
  const clearConversation = () => {
    setMessages([]);
    setConversationHistory([]);
    if (user) {
      localStorage.removeItem(`konexa_assistant_${user.username}`);
    }
    sendWelcomeMessage();
  };

  // Update assistant theme
  const updateAssistantTheme = (newThemeSettings) => {
    const updatedTheme = { ...assistantTheme, ...newThemeSettings };
    setAssistantTheme(updatedTheme);
    if (user) {
      localStorage.setItem(`konexa_assistant_theme_${user.username}`, JSON.stringify(updatedTheme));
    }
  };

  return (
    <AssistantContext.Provider value={{
        messages,
        sendMessage,
        isOpen,
        toggleAssistant,
        isTyping,
        clearConversation,
        assistantTheme,
        updateAssistantTheme
      }}>
      {children}
    </AssistantContext.Provider>
  );
};