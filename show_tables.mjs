import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get all tables
const [tables] = await connection.execute('SHOW TABLES');
console.log('=== ALL TABLES IN YOUR NEON DATABASE ===');
console.log(JSON.stringify(tables, null, 2));

// Get structure of each table
for (const tableRow of tables) {
  const tableName = Object.values(tableRow)[0];
  console.log(`\n=== STRUCTURE OF ${tableName} ===`);
  const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
  console.log(JSON.stringify(columns, null, 2));
}

await connection.end();
