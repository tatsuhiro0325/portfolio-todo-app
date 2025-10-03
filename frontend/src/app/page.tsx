'use client';

import { createTodo, useCreateTodo, useGetTodos } from "@/gen/api";
import { CreateTodoRequest } from "@/gen/models";

export default function Home() {
  const { data, isLoading, error } = useGetTodos();

  function handleSumit (data: CreateTodoRequest){
    createTodo(data)
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto my-20 mt-20">
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
        {data?.map((todo) => (
          <tr key={todo.id}>
            <td>{todo.id}</td>
            <td>{todo.title}</td>
            <td>{todo.isDone ? "✅" : "❌"}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
