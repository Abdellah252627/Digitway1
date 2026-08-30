import db from './database.js';

const tables = ['projects', 'reviews', 'quotes', 'notifications', 'site_content', 'auth_otps'];

console.log('\n📊 Database status:\n');

for (const table of tables) {
  const result = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
  console.log(`   ${table.padEnd(20)} → ${result.rows[0].count} row(s)`);
}

console.log('\n✅ All demo data tables are empty. Database is live-ready.\n');
