import type { TodoRepository } from '../../domain/repositories/TodoRepository';

export class DeleteTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string) {
    await this.todoRepository.delete(id);
  }
}
