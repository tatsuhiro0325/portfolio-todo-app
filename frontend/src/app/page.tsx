'use client';

import { createTodo, useCreateTodo, useGetTodos, updateTodoDone } from "@/gen/api";
import { CreateTodoRequest, Todo, UpdateTodoDoneRequest } from "@/gen/models";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // <- React Queryのフックをインポート
import { todo } from "node:test";

export default function Home() {
  const { data, isLoading, error } = useGetTodos();

  // 2. QueryClientのインスタンスを取得
  //    invalidateQueries（キャッシュの無効化）に利用します
  const queryClient = useQueryClient();

  // 3. ToDoを「更新」するためのMutationを定義
  const updateTodoDoneMutation = useMutation({
    mutationFn: (todo: Todo) => {
      // isDoneの状態を反転させて更新APIを呼び出す
      const requestBody: UpdateTodoDoneRequest = { isDone: !todo.isDone };
      return updateTodoDone(todo.id, { isDone: !todo.isDone });
    },
    onSuccess: () => {
      // ToDoの更新が成功したら、ToDoリストのキャッシュを無効化して再取得を促す
      queryClient.invalidateQueries({ queryKey: ["getTodos"] });
    },
    onError: (error) => {
      console.error("更新に失敗しました", error);
    }
  });

  const handleToggleIsDone = (todo: Todo) => {
    // 上で定義したMutationを実行する
    return () => {
      updateTodoDoneMutation.mutate(todo);
    };
  };

  function handleSumit (data: CreateTodoRequest){
    createTodo(data)
  }


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto my-20 mt-60">
  <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
    New Task
  </h2>
  <form
    className="space-y-6" // フォーム内の要素の間に縦方向のスペースを追加
    onSubmit={(event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data: CreateTodoRequest = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      };
      handleSumit(data);
    }}
  >
    {/* タイトル入力欄 */}
    <div>
      <input
        type="text"
        name="title"
        placeholder="Title"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* 詳細入力欄 */}
    <div>
      <input
        type="text"
        name="description"
        placeholder="Description"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* 追加ボタン */}
    <button
      type="submit"
      className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
    >
      Add Task
    </button>
  </form>
</div>
      <table>
        {/* テーブルヘッダーをつけて見やすくする */}
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Is Done</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((todo) => (
            <tr key={todo.id}>
              <td className="border px-4 py-2">{todo.id}</td>
              <td className="border px-4 py-2">{todo.title}</td>
              <td className="border px-4 py-2">{todo.description}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={handleToggleIsDone(todo)}
                  className="cursor-pointer"
                  // 更新中はクリックできないようにする
                  disabled={updateTodoDoneMutation.isPending} 
                >
                {todo.isDone ? "✅" : "❌"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
