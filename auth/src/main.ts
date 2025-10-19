// auth/src/main.ts - Using Hono for authentication
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
app.use('/*', cors());

// Public routes
app.get('/', (c) => {
  return c.json({
    message: 'Auth service is running',
    environment: c.env.ENVIRONMENT,
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    // TODO: Validate credentials against database
    // This is a placeholder
    if (!username || !password) {
      return c.json({ error: 'Username and password required' }, 400);
    }

    // Mock successful login
    if (username === 'admin' && password === 'password') {
      return c.json({
        success: true,
        token: 'mock-jwt-token',
        user: { id: 1, username },
      });
    }

    return c.json({ error: 'Invalid credentials' }, 401);
  } catch (error) {
    return c.json({ error: 'Invalid request body' }, 400);
  }
});

// Register endpoint
app.post('/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();
    
    if (!username || !email || !password) {
      return c.json({ 
        error: 'Username, email, and password required' 
      }, 400);
    }

    // TODO: Create user in database
    return c.json({
      success: true,
      message: 'User registered successfully',
      user: { id: Date.now(), username, email },
    }, 201);
  } catch (error) {
    return c.json({ error: 'Invalid request body' }, 400);
  }
});

// Token verification endpoint
app.post('/verify', async (c) => {
  try {
    const { token } = await c.req.json();
    
    if (!token) {
      return c.json({ error: 'Token required' }, 400);
    }

    // TODO: Verify JWT token
    return c.json({
      valid: true,
      user: { id: 1, username: 'admin' },
    });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Refresh token endpoint
app.post('/refresh', async (c) => {
  try {
    const { refreshToken } = await c.req.json();
    
    if (!refreshToken) {
      return c.json({ error: 'Refresh token required' }, 400);
    }

    // TODO: Validate refresh token and issue new access token
    return c.json({
      success: true,
      token: 'new-mock-jwt-token',
    });
  } catch (error) {
    return c.json({ error: 'Invalid refresh token' }, 401);
  }
});

// Logout endpoint
app.post('/logout', async (c) => {
  // TODO: Invalidate token (add to blacklist, etc.)
  return c.json({ success: true, message: 'Logged out successfully' });
});

// Protected route example
app.get('/me', async (c) => {
  // TODO: Extract and verify token from Authorization header
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Mock user data
  return c.json({
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;