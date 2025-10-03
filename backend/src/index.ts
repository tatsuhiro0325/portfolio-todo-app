import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createTodoRoutes } from './presentation/routes/todoRoutes';
import { PrismaTodoRepository } from './infrastructure/repositories/PrismaTodoRepository';
import { prisma, connectDatabase, disconnectDatabase } from './infrastructure/database/prisma';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Todo API is running!' });
});

// Initialize repository
const todoRepository = new PrismaTodoRepository(prisma);

// Routes
app.route('/todos', createTodoRoutes(todoRepository));

// Error handling
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({ error: err.message }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

const PORT = Number(process.env.PORT) || 3001;

// Start server
const startServer = async () => {
  await connectDatabase();

  const server = serve({
    fetch: app.fetch,
    port: PORT,
  });

  console.log(`🚀 Server is running on http://localhost:${PORT}`);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await disconnectDatabase();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...');
    await disconnectDatabase();
    process.exit(0);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
