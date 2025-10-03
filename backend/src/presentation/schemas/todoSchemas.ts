import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
});

export const updateTodoDoneSchema = z.object({
  isDone: z.boolean(),
});

export const todoIdParamSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
export type UpdateTodoDoneSchema = z.infer<typeof updateTodoDoneSchema>;
export type TodoIdParamSchema = z.infer<typeof todoIdParamSchema>;
