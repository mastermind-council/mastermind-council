import { describe, it, expect } from 'vitest';
import pg from 'pg';
import bcrypt from 'bcrypt';

const { Client } = pg;

describe('Neon Database Authentication', () => {
  it('should connect to Neon database and validate user credentials', async () => {
    const connectionString = process.env.DATABASE_URL_NEON;
    
    expect(connectionString).toBeDefined();
    expect(connectionString).toContain('neon.tech');
    
    const client = new Client({ connectionString });
    
    try {
      // Test connection
      await client.connect();
      
      // Query users table
      const result = await client.query('SELECT id, first_name, last_name, email, password_hash FROM users LIMIT 1');
      
      expect(result.rows.length).toBeGreaterThan(0);
      
      const user = result.rows[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password_hash');
      
      // Verify password_hash is a valid bcrypt hash
      expect(user.password_hash).toMatch(/^\$2[aby]\$/);
      
      console.log('✅ Neon database connection successful');
      console.log(`✅ Found user: ${user.first_name} ${user.last_name} (${user.email})`);
      
    } finally {
      await client.end();
    }
  });
  
  it('should verify bcrypt password hashing works', async () => {
    const testPassword = 'test123';
    const hash = await bcrypt.hash(testPassword, 10);
    
    const isValid = await bcrypt.compare(testPassword, hash);
    expect(isValid).toBe(true);
    
    const isInvalid = await bcrypt.compare('wrongpassword', hash);
    expect(isInvalid).toBe(false);
    
    console.log('✅ Bcrypt password validation working');
  });
});
