# Login
curl -X POST http://localhost:8787/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Verify token
curl http://localhost:8787/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get current user
curl http://localhost:8787/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Logout
curl -X POST http://localhost:8787/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"