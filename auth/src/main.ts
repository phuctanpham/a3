// auth/src/main.ts
import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// Types
interface User {
  username: string;
  password: string;
}

interface Session {
  username: string;
  createdAt: string;
  expiresAt: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthRequest extends Request {
  user?: Session;
}

// Hardcoded credentials
const USERS: Record<string, string> = {
  'admin': 'password123',
  'user1': 'mypassword',
  'demo': 'demo123'
};

// In-memory session storage
const sessions = new Map<string, Session>();

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Generate session token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Authentication Service',
    endpoints: {
      'POST /login': 'Login with username and password',
      'POST /logout': 'Logout (requires Authorization header)',
      'GET /verify': 'Verify token (requires Authorization header)',
      'GET /me': 'Get current user info (requires Authorization header)'
    },
    testCredentials: {
      username: 'admin',
      password: 'password123'
    }
  });
});

// LOGIN
app.post('/login', (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }
  
  // Verify credentials
  if (!USERS[username] || USERS[username] !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
  
  // Generate session token
  const token = generateToken();
  const session: Session = {
    username,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
  
  sessions.set(token, session);
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      username,
      expiresAt: session.expiresAt
    }
  });
});

// LOGOUT
app.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required'
    });
  }
  
  const token = authHeader.substring(7);
  
  if (!sessions.has(token)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
  
  sessions.delete(token);
  
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// VERIFY TOKEN
app.get('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required',
      valid: false
    });
  }
  
  const token = authHeader.substring(7);
  const session = sessions.get(token);
  
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      valid: false
    });
  }
  
  // Check expiration
  if (new Date(session.expiresAt) < new Date()) {
    sessions.delete(token);
    return res.status(401).json({
      success: false,
      message: 'Token has expired',
      valid: false
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    valid: true,
    data: {
      username: session.username,
      expiresAt: session.expiresAt
    }
  });
});

// GET CURRENT USER
app.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required'
    });
  }
  
  const token = authHeader.substring(7);
  const session = sessions.get(token);
  
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
  
  // Check expiration
  if (new Date(session.expiresAt) < new Date()) {
    sessions.delete(token);
    return res.status(401).json({
      success: false,
      message: 'Token has expired'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      username: session.username,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    return app.fetch(request, env, ctx) as Promise<Response>;
  }
};