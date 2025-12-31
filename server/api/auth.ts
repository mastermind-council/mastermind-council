import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pg from "pg";

const { Client } = pg;
const router = Router();

// Neon PostgreSQL connection
const connectionString = process.env.DATABASE_URL_NEON || process.env.DATABASE_URL;

// Password authentication against Neon database
router.post("/login", async (req, res) => {
  const client = new Client({ connectionString });
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Connect to Neon database
    await client.connect();

    // Find user by email
    const result = await client.query(
      'SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Verify password against hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last_login_at
    await client.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        name: `${user.first_name} ${user.last_name}` // For backward compatibility
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  } finally {
    await client.end();
  }
});

export default router;
