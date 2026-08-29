export const SERVICES_PRICING = Object.freeze({
  landingPages: {
    startingPrice: 400,
    timelineEn: '3-5 Days',
    timelineAr: '3-5 أيام',
  },
  dashboards: {
    startingPrice: 800,
    timelineEn: '2-3 Weeks',
    timelineAr: '2-3 أسابيع',
  },
  ecommerce: {
    startingPrice: 1500,
    timelineEn: '1-2 Weeks',
    timelineAr: '1-2 أسبوع',
  },
});

export const CURRENCY = Object.freeze({
  en: 'MAD',
  ar: 'د.م.',
});

export const formatPrice = (amount, language = 'en') => {
  const suffix = language === 'ar' ? CURRENCY.ar : CURRENCY.en;
  return `${Number(amount)} ${suffix}`;
};

export const getServicePricing = () => ({
  landingPages: { ...SERVICES_PRICING.landingPages },
  dashboards: { ...SERVICES_PRICING.dashboards },
  ecommerce: { ...SERVICES_PRICING.ecommerce },
});
