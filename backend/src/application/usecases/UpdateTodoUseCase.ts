import type { TodoRepository } from '../../domain/repositories/TodoRepository';
import type { UpdateTodoInput } from '../../domain/entities/Todo';

export class UpdateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string, input: UpdateTodoInput) {
    return await this.todoRepository.update(id, input);
  }
}
