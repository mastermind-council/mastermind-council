import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users } from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const allUsers = await db.select().from(users);
console.log('Users in database:', JSON.stringify(allUsers, null, 2));

await connection.end();
