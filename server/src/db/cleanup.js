import db from './database.js';

console.log('🧹 Cleaning up seed/demo data...\n');

// Use explicit transaction for cleanup
const cleanup = db.transaction(() => {
  // 1. Clear demo reviews
  const reviewsDeleted = db.prepare('DELETE FROM reviews').run();
  console.log(`✅ Deleted ${reviewsDeleted.changes} reviews`);

  // 2. Clear demo projects
  const projectsDeleted = db.prepare('DELETE FROM projects').run();
  console.log(`✅ Deleted ${projectsDeleted.changes} projects`);

  // 3. Clear demo quotes
  const quotesDeleted = db.prepare('DELETE FROM quotes').run();
  console.log(`✅ Deleted ${quotesDeleted.changes} quotes`);

  // 4. Clear demo notifications
  const notifsDeleted = db.prepare('DELETE FROM notifications').run();
  console.log(`✅ Deleted ${notifsDeleted.changes} notifications`);
});

cleanup();

// 5. Verify site_content is preserved (config data, not demo)
const contentCount = db.prepare('SELECT COUNT(*) as count FROM site_content').get();
console.log(`\n📦 Preserved ${contentCount.count} site_content record(s) (config data)`);

// 6. Verify empty tables
console.log('\n📊 Table counts after cleanup:');
const tables = ['reviews', 'projects', 'quotes', 'notifications', 'site_content', 'auth_otps'];
for (const table of tables) {
  const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
  console.log(`   ${table}: ${count.count} rows`);
}

// 7. Reset autoincrement counters
const seqReset = db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('reviews', 'projects', 'quotes', 'notifications')").run();
console.log(`\n🔄 Reset ${seqReset.changes} autoincrement counters`);

console.log('\n✨ Cleanup complete. Database is now live-ready.');
