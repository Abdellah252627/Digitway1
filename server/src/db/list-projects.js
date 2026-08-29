import db from './database.js';

const rows = db.prepare('SELECT id, title, client_name, status, budget, created_at FROM projects ORDER BY id').all();

console.log(`\n📋 Projects table — ${rows.length} row(s):\n`);
console.log('─'.repeat(100));

for (const r of rows) {
  console.log(`
ID:        ${r.id}
Title:     ${r.title}
Client:    ${r.client_name}
Status:    ${r.status}
Budget:    ${r.budget || '(none)'}
Created:   ${r.created_at}
${'─'.repeat(100)}`);
}
