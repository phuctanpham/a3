# Get all items
curl http://localhost:8787/items

# Create item
curl -X POST http://localhost:8787/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"A test item"}'

# Get item by ID
curl http://localhost:8787/items/1

# Update item
curl -X PUT http://localhost:8787/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Item"}'

# Delete item
curl -X DELETE http://localhost:8787/items/1