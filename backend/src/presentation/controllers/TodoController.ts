import { Context } from 'hono';
import { CreateTodoUseCase } from '../../application/usecases/CreateTodoUseCase';
import { GetTodosUseCase } from '../../application/usecases/GetTodosUseCase';
import { GetTodoByIdUseCase } from '../../application/usecases/GetTodoByIdUseCase';
import { UpdateTodoUseCase } from '../../application/usecases/UpdateTodoUseCase';
import { UpdateTodoDoneUseCase } from '../../application/usecases/UpdateTodoDoneUseCase';
import { DeleteTodoUseCase } from '../../application/usecases/DeleteTodoUseCase';
import type { TodoRepository } from '../../domain/repositories/TodoRepository';
import {
    createTodoSchema,
    updateTodoSchema,
    updateTodoDoneSchema,
    todoIdParamSchema,
} from '../schemas/todoSchemas';

export class TodoController {
  private createTodoUseCase: CreateTodoUseCase;
  private getTodosUseCase: GetTodosUseCase;
  private getTodoByIdUseCase: GetTodoByIdUseCase;
  private updateTodoUseCase: UpdateTodoUseCase;
  private updateTodoDoneUseCase: UpdateTodoDoneUseCase;
  private deleteTodoUseCase: DeleteTodoUseCase;

  constructor(todoRepository: TodoRepository) {
    this.createTodoUseCase = new CreateTodoUseCase(todoRepository);
    this.getTodosUseCase = new GetTodosUseCase(todoRepository);
    this.getTodoByIdUseCase = new GetTodoByIdUseCase(todoRepository);
    this.updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
    this.updateTodoDoneUseCase = new UpdateTodoDoneUseCase(todoRepository);
    this.deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
  }

  async createTodo(c: Context) {
    try {
      const body = await c.req.json();
      const validatedData = createTodoSchema.parse(body);
      const todo = await this.createTodoUseCase.execute(validatedData);
      return c.json(todo, 201);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return c.json({ error: 'Validation error', details: error.errors }, 400);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async getTodos(c: Context) {
    try {
      const todos = await this.getTodosUseCase.execute();
      return c.json(todos);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async getTodoById(c: Context) {
    try {
      const { id } = todoIdParamSchema.parse(c.req.param());
      const todo = await this.getTodoByIdUseCase.execute(id);
      return c.json(todo);
    } catch (error: any) {
      if (error.message === 'Todo not found') {
        return c.json({ error: error.message }, 404);
      }
      if (error.name === 'ZodError') {
        return c.json({ error: 'Invalid ID format', details: error.errors }, 400);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async updateTodo(c: Context) {
    try {
      const { id } = todoIdParamSchema.parse(c.req.param());
      const body = await c.req.json();
      const validatedData = updateTodoSchema.parse(body);
      const todo = await this.updateTodoUseCase.execute(id, validatedData);
      return c.json(todo);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return c.json({ error: 'Validation error', details: error.errors }, 400);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async updateTodoDone(c: Context) {
    try {
      const { id } = todoIdParamSchema.parse(c.req.param());
      const body = await c.req.json();
      const validatedData = updateTodoDoneSchema.parse(body);
      const todo = await this.updateTodoDoneUseCase.execute(id, validatedData);
      return c.json(todo);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return c.json({ error: 'Validation error', details: error.errors }, 400);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async deleteTodo(c: Context) {
    try {
      const { id } = todoIdParamSchema.parse(c.req.param());
      await this.deleteTodoUseCase.execute(id);
      return c.json({ message: 'Todo deleted successfully' }, 200);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return c.json({ error: 'Invalid ID format', details: error.errors }, 400);
      }
      return c.json({ error: error.message }, 500);
    }
  }
}
