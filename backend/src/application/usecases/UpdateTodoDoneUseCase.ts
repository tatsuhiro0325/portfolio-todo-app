import type { TodoRepository } from '../../domain/repositories/TodoRepository';
import type { UpdateTodoDoneInput } from '../../domain/entities/Todo';

export class UpdateTodoDoneUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string, input: UpdateTodoDoneInput) {
    return await this.todoRepository.updateDone(id, input);
  }
}
