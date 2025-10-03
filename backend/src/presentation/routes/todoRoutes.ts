import { Hono } from 'hono';
import { TodoController } from '../controllers/TodoController';
import type { TodoRepository } from '../../domain/repositories/TodoRepository';

export const createTodoRoutes = (todoRepository: TodoRepository) => {
  const app = new Hono();
  const todoController = new TodoController(todoRepository);

  // POST /todos - Create a new todo
  app.post('/', (c) => todoController.createTodo(c));

  // GET /todos - Get all todos
  app.get('/', (c) => todoController.getTodos(c));

  // GET /todos/:id - Get a specific todo
  app.get('/:id', (c) => todoController.getTodoById(c));

  // PUT /todos/:id - Update a todo
  app.put('/:id', (c) => todoController.updateTodo(c));

  // PATCH /todos/:id/done - Update todo done status
  app.patch('/:id/done', (c) => todoController.updateTodoDone(c));

  // DELETE /todos/:id - Delete a todo
  app.delete('/:id', (c) => todoController.deleteTodo(c));

  return app;
};
