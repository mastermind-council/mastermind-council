import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../../lib/db';
import { verifyPassword, generateToken } from '../../../../../lib/auth';

export async function POST(request: NextRequest) {
  console.log("LOGIN ROUTE CALLED - Version with detailed logging");
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.warn("WARNING: Login attempt for:", email);

    // Find user by email
    const users = await sql`
      SELECT id, name, email, password_hash, created_at 
      FROM users 
      WHERE email = ${email}
    `;

    console.log('Database query result:', {
      userCount: users.length,
      foundUser: users.length > 0 ? {
        id: users[0]?.id,
        name: users[0]?.name,
        email: users[0]?.email,
        created_at: users[0]?.created_at
      } : 'No user found'
    });

    if (users.length === 0) {
      console.log('No user found with email:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    console.log('User found in database:', {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    });

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    console.log('Password verification result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', user.email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login time
    await sql`
      UPDATE users 
      SET last_login_at = NOW() 
      WHERE id = ${user.id}
    `;
    console.log('Updated last_login_at for user ID:', user.id);

    // Generate token
    const token = generateToken(user.id);
    console.log('JWT token generated for user ID:', user.id);

    console.log('Login successful for:', {
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      token,
      debug: {
        emailReceived: email,
        userFound: users.length > 0,
        passwordValid: isValidPassword,
        userCount: users.length,
        userId: user.id,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
