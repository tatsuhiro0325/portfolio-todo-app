"use client";

import {
  useGetTodos,
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
  useUpdateTodoDone,
} from "@/gen/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zodスキーマ定義
const todoSchema = z.object({
  title: z
    .string()
    .min(1, "タスク名は必須です")
    .max(100, "タスク名は100文字以内で入力してください"),
  description: z
    .string()
    .min(1, "詳細説明は必須です")
    .max(500, "詳細説明は500文字以内で入力してください"),
});

type TodoFormData = z.infer<typeof todoSchema>;

export default function Home() {
  // ===== データ取得 =====
  // サーバーからタスク一覧を取得
  const { data, isLoading, error } = useGetTodos();
  const queryClient = useQueryClient();

  // ===== 状態管理 =====
  // 編集中のタスクIDを管理（nullの場合は編集していない）
  const [editingId, setEditingId] = useState<string | null>(null);

  // ===== フォーム設定 =====
  // 新規作成用のフォーム
  const createForm = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: { title: "", description: "" },
  });

  // 編集用のフォーム
  const editForm = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  });

  // ===== API連携（mutation） =====
  // タスク作成
  const createTodo = useCreateTodo({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/todos"] });
        createForm.reset(); // フォームをクリア
      },
    },
  });

  // タスク削除
  const deleteTodo = useDeleteTodo({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/todos"] });
      },
    },
  });

  // タスク更新
  const updateTodo = useUpdateTodo({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/todos"] });
        setEditingId(null);
        editForm.reset();
      },
    },
  });

  // 完了/未完了の切り替え
  const toggleDone = useUpdateTodoDone({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/todos"] });
      },
    },
  });

  // ===== イベントハンドラー =====
  // 新規作成ボタンを押したとき
  const handleCreateSubmit = (formData: TodoFormData) => {
    createTodo.mutate({ data: formData });
  };

  // 編集モードで保存ボタンを押したとき
  const handleEditSubmit = (formData: TodoFormData) => {
    if (editingId) {
      updateTodo.mutate({ id: editingId, data: formData });
    }
  };

  // 削除ボタンを押したとき
  const handleDeleteClick = (id: string) => {
    if (confirm("このタスクを削除しますか?")) {
      deleteTodo.mutate({ id });
    }
  };

  // 編集ボタンを押したとき
  const handleEditClick = (id: string, title: string, description?: string) => {
    setEditingId(id); // 編集モードに切り替え
    editForm.reset({ title, description: description || "" }); // フォームに値をセット
  };

  // 編集モードでキャンセルボタンを押したとき
  const handleCancelClick = () => {
    setEditingId(null); // 編集モードを解除
    editForm.reset(); // フォームをクリア
  };

  // チェックボックスを押したとき
  const handleCheckboxChange = (id: string, currentStatus: boolean) => {
    toggleDone.mutate({ id, data: { isDone: !currentStatus } });
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <h1 className="text-2xl font-bold mb-6">タスク管理アプリ</h1>

        {/* タスク追加フォーム */}
        <div className="bg-white border p-4 mb-4">
          <h2 className="text-lg font-bold mb-3">新しいタスク</h2>
          <form onSubmit={createForm.handleSubmit(handleCreateSubmit)}>
            <div className="mb-3">
              <label className="block mb-1">
                タスク名 <span className="text-red-500">*</span>
              </label>
              <input
                {...createForm.register("title")}
                className="w-full p-2 border"
                placeholder="買い物に行く"
              />
              {createForm.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label className="block mb-1">
                詳細<span className="text-red-500">*</span>
              </label>
              <textarea
                {...createForm.register("description")}
                rows={3}
                className="w-full p-2 border"
                placeholder="牛乳、卵、パンを買う"
              />
              {createForm.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={createTodo.isPending}
              className="w-full bg-blue-500 text-white p-2"
            >
              {createTodo.isPending ? "追加中..." : "追加"}
            </button>
          </form>
        </div>

        {/* タスク一覧 */}
        <div className="bg-white border p-4">
          <h2 className="text-lg font-bold mb-3">
            タスク一覧 ({data?.length || 0}件)
          </h2>

          {isLoading ? (
            <div className="text-center p-4">
              <p>読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-center p-4">
              <p className="text-red-500">エラーが発生しました</p>
            </div>
          ) : data && data.length > 0 ? (
            <div>
              {data.map((todo) => (
                <div key={todo.id} className="border-t pt-3 mt-3">
                  {editingId === todo.id ? (
                    // 編集モード
                    <form onSubmit={editForm.handleSubmit(handleEditSubmit)}>
                      <div className="mb-2">
                        <input
                          {...editForm.register("title")}
                          className="w-full p-2 border"
                        />
                        {editForm.formState.errors.title && (
                          <p className="text-sm text-red-500 mt-1">
                            {editForm.formState.errors.title.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-2">
                        <textarea
                          {...editForm.register("description")}
                          className="w-full p-2 border"
                          rows={2}
                        />
                        {editForm.formState.errors.description && (
                          <p className="text-sm text-red-500 mt-1">
                            {editForm.formState.errors.description.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={updateTodo.isPending}
                          className="bg-green-500 text-white px-3 py-1 mr-2"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelClick}
                          className="bg-gray-500 text-white px-3 py-1"
                        >
                          キャンセル
                        </button>
                      </div>
                    </form>
                  ) : (
                    // 通常表示モード
                    <div>
                      <div className="flex mb-2">
                        <input
                          type="checkbox"
                          checked={todo.isDone}
                          onChange={() =>
                            handleCheckboxChange(todo.id, todo.isDone)
                          }
                          disabled={toggleDone.isPending}
                          className="mr-2"
                        />
                        <div>
                          <div
                            className={
                              todo.isDone ? "line-through text-gray-400" : ""
                            }
                          >
                            <div className="font-bold">{todo.title}</div>
                            {todo.description && (
                              <div className="text-sm text-gray-600">
                                {todo.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            handleEditClick(
                              todo.id,
                              todo.title,
                              todo.description || "",
                            )
                          }
                          className="bg-blue-500 text-white px-3 py-1 text-sm mr-2"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDeleteClick(todo.id)}
                          disabled={deleteTodo.isPending}
                          className="bg-red-500 text-white px-3 py-1 text-sm"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">
              <p>タスクがありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
