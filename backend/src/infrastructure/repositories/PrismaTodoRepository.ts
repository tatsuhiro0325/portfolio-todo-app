import { PrismaClient } from '@prisma/client';
import type { TodoRepository } from '../../domain/repositories/TodoRepository';
import type { Todo, CreateTodoInput, UpdateTodoInput, UpdateTodoDoneInput } from '../../domain/entities/Todo';

export class PrismaTodoRepository implements TodoRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Todo[]> {
    return await this.prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Todo | null> {
    return await this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    return await this.prisma.todo.create({
      data: input,
    });
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo> {
    return await this.prisma.todo.update({
      where: { id },
      data: input,
    });
  }

  async updateDone(id: string, input: UpdateTodoDoneInput): Promise<Todo> {
    return await this.prisma.todo.update({
      where: { id },
      data: { isDone: input.isDone },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.todo.delete({
      where: { id },
    });
  }
}
