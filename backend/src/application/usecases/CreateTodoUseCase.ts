import type { TodoRepository } from '../../domain/repositories/TodoRepository';
import type { CreateTodoInput } from '../../domain/entities/Todo';

export class CreateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(input: CreateTodoInput) {
    return await this.todoRepository.create(input);
  }
}
