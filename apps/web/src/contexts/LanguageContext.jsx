import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from './AuthContext.jsx';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'pt-BR');

  useEffect(() => {
    if (currentUser && currentUser.language_preference) {
      if (currentUser.language_preference !== i18n.language) {
        i18n.changeLanguage(currentUser.language_preference);
        setCurrentLanguage(currentUser.language_preference);
      }
    }
  }, [currentUser, i18n]);

  const changeLanguage = async (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    
    if (currentUser) {
      try {
        await pb.collection('users').update(currentUser.id, {
          language_preference: lang
        }, { $autoCancel: false });
      } catch (error) {
        console.error("Failed to update language preference in database", error);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
