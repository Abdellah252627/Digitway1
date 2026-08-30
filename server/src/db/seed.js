import db from './database.js';

export async function seedDatabase() {
  console.log('🌱 Checking and seeding initial data...');

  // 1. Initial Site Content
  const defaultContent = {
    hero: {
      en: {
        badge: 'Available for Q3/Q4 Projects',
        title: 'Engineering High-Converting Web Apps & Modern Platforms',
        subtitle: 'I help ambitious founders and businesses build bespoke Landing Pages, SaaS Dashboards, and E-commerce Stores with clean MERN architecture and rapid turnaround.',
        ctaPrimary: 'Request a Quote',
        ctaSecondary: 'Explore Services'
      },
      ar: {
        badge: 'متاح لاستقبال مشاريع جديدة',
        title: 'تطوير تطبيقات ومواقع ويب متقدمة وعالية التحويل',
        subtitle: 'أساعد الشركات الناشئة ورواد الأعمال على بناء صفحات هبوط سريعة، لوحات تحكم SaaS، ومتاجر إلكترونية احترافية باستخدام أحدث تقنيات MERN وبأعلى معايير الجودة.',
        ctaPrimary: 'اطلب عرض سعر',
        ctaSecondary: 'استكشف الخدمات'
      }
    },
    services_pricing: {
      landingPages: { startingPrice: 400, timelineEn: '3-5 Days', timelineAr: '3-5 أيام' },
      dashboards: { startingPrice: 800, timelineEn: '2-3 Weeks', timelineAr: '2-3 أسابيع' },
      ecommerce: { startingPrice: 1500, timelineEn: '1-2 Weeks', timelineAr: '1-2 أسبوع' }
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

  const contentResult = await db.execute({
    sql: 'SELECT key FROM site_content WHERE key = ?',
    args: ['global_settings'],
  });
  if (contentResult.rows.length === 0) {
    await db.execute({
      sql: 'INSERT INTO site_content (key, value) VALUES (?, ?)',
      args: ['global_settings', JSON.stringify(defaultContent)],
    });
    console.log('✅ Seeded default site content');
  }

  console.log('✨ Database seeding complete.');
}

// Demo data seeding removed — database is live-ready.
// Only site_content config is seeded above.

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seedDatabase().catch(err => console.error('Seed error:', err));
}
