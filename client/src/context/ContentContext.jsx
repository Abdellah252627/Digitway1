import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useLanguage } from './LanguageContext';
import { getServicePricing, formatPrice } from '../config/pricing';

const defaultContent = {
  currency: {
    symbolEn: 'DH',
    symbolAr: 'درهم',
  },
  hero: {
    en: {
      badge: 'Available for Q3/Q4 Projects',
      title: 'Engineering High-Converting Web Platforms & SaaS for Ambitious Businesses',
      subtitle: 'Freelance MERN developer specializing in pixel-perfect Landing Pages, fullstack SaaS Dashboards, and ultra-fast E-commerce stores. Clean code, fixed pricing, and rapid delivery.',
      ctaPrimary: 'Request a Quote',
      ctaSecondary: 'Explore Services'
    },
    ar: {
      badge: 'متاح لاستقبال مشاريع جديدة',
      title: 'تطوير تطبيقات ومواقع ويب متقدمة وعالية التحويل',
      subtitle: 'مطور MERN مستقل متخصص في بناء صفحات هبوط سريعة، لوحات تحكم SaaS، ومتاجر إلكترونية احترافية. كود نظيف، تسعير محدد، وتسليم سريع في الموعد.',
      ctaPrimary: 'اطلب عرض سعر',
      ctaSecondary: 'استكشف الخدمات'
    }
  },
  services_pricing: {
    ...getServicePricing(),
  },
  contact_links: {
    whatsapp: '+212600000000',
    whatsappUrl: 'https://wa.me/212600000000',
    linkedin: 'https://linkedin.com/in/abdellah-dev',
    instagram: 'https://www.instagram.com/northstack.dev?igsi=YnU3dDl6bWNneWN6',
    github: 'https://github.com/Abdellah252627',
    email: 'hello.northstack2@gmail.com'
  },
  availability: {
    isAvailable: true,
    statusTextEn: 'Taking new client projects',
    statusTextAr: 'متاح لقبول مشاريع جديدة'
  }
};

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const { language } = useLanguage();
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.content.getPublic();
      if (res.content) {
        setContent((prev) => ({
          ...prev,
          ...res.content,
          currency: {
            symbolEn: res.content.currency?.symbolEn || 'DH',
            symbolAr: res.content.currency?.symbolAr || 'درهم',
          },
          services_pricing: {
            ...getServicePricing(),
            ...res.content.services_pricing,
          }
        }));
      }
    } catch (err) {
      console.warn('Using default content fallback:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Helper to format price with current currency
  const getFormattedPrice = (serviceKey) => {
    const svc = content.services_pricing?.[serviceKey];
    const price = svc?.startingPrice ?? getServicePricing()[serviceKey]?.startingPrice ?? 0;
    return formatPrice(price, language);
  };

  const getServiceTimeline = (serviceKey) => {
    const svc = content.services_pricing?.[serviceKey];
    const fallback = getServicePricing()[serviceKey] || getServicePricing().landingPages;
    if (language === 'ar') {
      return svc?.timelineAr || fallback.timelineAr;
    }
    return svc?.timelineEn || fallback.timelineEn;
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        setContent,
        loading,
        refreshContent: fetchContent,
        getFormattedPrice,
        getServiceTimeline,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
