import db from './database.js';

console.log('🧹 Cleaning up seed/demo data...\n');

const reviewsResult = await db.execute('DELETE FROM reviews');
console.log(`✅ Deleted ${reviewsResult.rowsAffected} reviews`);

const projectsResult = await db.execute('DELETE FROM projects');
console.log(`✅ Deleted ${projectsResult.rowsAffected} projects`);

const quotesResult = await db.execute('DELETE FROM quotes');
console.log(`✅ Deleted ${quotesResult.rowsAffected} quotes`);

const notifsResult = await db.execute('DELETE FROM notifications');
console.log(`✅ Deleted ${notifsResult.rowsAffected} notifications`);

const contentResult = await db.execute('SELECT COUNT(*) as count FROM site_content');
console.log(`\n📦 Preserved ${contentResult.rows[0].count} site_content record(s) (config data)`);

console.log('\n📊 Table counts after cleanup:');
const tables = ['reviews', 'projects', 'quotes', 'notifications', 'site_content', 'auth_otps'];
for (const table of tables) {
  const result = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
  console.log(`   ${table}: ${result.rows[0].count} rows`);
}

await db.execute("DELETE FROM sqlite_sequence WHERE name IN ('reviews', 'projects', 'quotes', 'notifications')");
console.log('\n🔄 Reset autoincrement counters');

console.log('\n✨ Cleanup complete. Database is now live-ready.');
