import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute('SELECT id, openId, name, email, role, loginMethod, DATE_FORMAT(createdAt, "%Y-%m-%d %H:%i:%s") as createdAt, DATE_FORMAT(lastSignedIn, "%Y-%m-%d %H:%i:%s") as lastSignedIn FROM users');

console.log('=== USER IN DATABASE ===');
console.log(JSON.stringify(rows, null, 2));

await connection.end();
