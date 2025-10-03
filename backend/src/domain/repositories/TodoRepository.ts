import type { Todo, CreateTodoInput, UpdateTodoInput, UpdateTodoDoneInput } from '../entities/Todo';

// Repository Interface (Port)
export interface TodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(input: CreateTodoInput): Promise<Todo>;
  update(id: string, input: UpdateTodoInput): Promise<Todo>;
  updateDone(id: string, input: UpdateTodoDoneInput): Promise<Todo>;
  delete(id: string): Promise<void>;
}
