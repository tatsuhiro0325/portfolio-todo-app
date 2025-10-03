// Domain Entity
export interface Todo {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
}

export interface UpdateTodoDoneInput {
  isDone: boolean;
}
