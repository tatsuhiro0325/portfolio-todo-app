import type { TodoRepository } from '../../domain/repositories/TodoRepository';

export class GetTodoByIdUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }
}
