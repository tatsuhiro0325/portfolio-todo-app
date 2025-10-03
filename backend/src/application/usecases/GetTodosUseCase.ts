import type { TodoRepository } from '../../domain/repositories/TodoRepository';

export class GetTodosUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute() {
    return await this.todoRepository.findAll();
  }
}
