// api/src/main.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// Types
interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

interface CreateItemRequest {
  name: string;
  description?: string;
}

interface UpdateItemRequest {
  name?: string;
  description?: string;
}

// In-memory storage
let items: Item[] = [];
let nextId = 1;

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Hello World',
    endpoints: {
      'GET /items': 'Get all items',
      'GET /items/:id': 'Get item by ID',
      'POST /items': 'Create new item',
      'PUT /items/:id': 'Update item',
      'DELETE /items/:id': 'Delete item'
    }
  });
});

// GET all items
app.get('/items', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: items,
    count: items.length
  });
});

// GET single item
app.get('/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: item
  });
});

// CREATE item
app.post('/items', (req: Request<{}, {}, CreateItemRequest>, res: Response) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }
  
  const newItem: Item = {
    id: nextId++,
    name,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  
  items.push(newItem);
  
  res.status(201).json({
    success: true,
    data: newItem,
    message: 'Item created successfully'
  });
});

// UPDATE item
app.put('/items/:id', (req: Request<{ id: string }, {}, UpdateItemRequest>, res: Response) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  const { name, description } = req.body;
  
  items[itemIndex] = {
    ...items[itemIndex],
    name: name || items[itemIndex].name,
    description: description !== undefined ? description : items[itemIndex].description,
    updatedAt: new Date().toISOString()
  };
  
  res.status(200).json({
    success: true,
    data: items[itemIndex],
    message: 'Item updated successfully'
  });
});

// DELETE item
app.delete('/items/:id', (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  const deletedItem = items.splice(itemIndex, 1)[0];
  
  res.status(200).json({
    success: true,
    data: deletedItem,
    message: 'Item deleted successfully'
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