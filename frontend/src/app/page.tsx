'use client';

import { useState } from "react";
import { createTodo, useCreateTodo, useGetTodos, updateTodoDone, updateTodo, useDeleteTodo } from "@/gen/api";
import { CreateTodoRequest, Todo, UpdateTodoDoneRequest, UpdateTodoRequest } from "@/gen/models";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // <- React Queryのフックをインポート

export default function Home() {
  const { data, isLoading, error } = useGetTodos();

  //  QueryClientのインスタンスを取得
  //  invalidateQueries（キャッシュの無効化）に利用します
  const queryClient = useQueryClient();

  //  編集中のToDoの状態を管理するためのstateを追加
  //  編集中でない場合はnull、編集中はそのToDoオブジェクトが入ります
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  //  ToDoを「更新」するためのMutationを定義
  const updateTodoDoneMutation = useMutation({
    mutationFn: (todo: Todo) => {
      // isDoneの状態を反転させて更新APIを呼び出す
      const requestBody: UpdateTodoDoneRequest = { isDone: !todo.isDone };
      return updateTodoDone(todo.id, requestBody);
    },
    onSuccess: () => {
      // ToDoの更新が成功したら、ToDoリストのキャッシュを無効化して再取得を促す
      queryClient.invalidateQueries({ queryKey: ["getTodos"] });
    },
    onError: (error) => {
      console.error("更新に失敗しました", error);
    }
  });

  // ToDoのタイトル・詳細を「更新」するためのMutationを追加します
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateTodoRequest }) => {
      return updateTodo(id, data);
    },
    onSuccess: () => {
      // 更新が成功したら、キャッシュを無効化してリストを再取得
      queryClient.invalidateQueries({ queryKey: ["getTodos"] });
      // 編集モードを終了
      setEditingTodo(null); 
    },
    onError: (error) => {
      console.error("更新に失敗しました", error);
    },
  });

  // ToDoを「削除」するためのMutationを追加
  const deleteTodoMutation = useDeleteTodo({
    mutation: {
      onSuccess: () => {
        // 削除が成功したら、キャッシュを無効化してリストを再取得
        queryClient.invalidateQueries({ queryKey: ["getTodos"] });
      },
      onError: (error: Error) => {
        console.error("削除に失敗しました", error);
      },
    },
  });

  // isDoneの状態を切り替えるハンドラ
  const handleToggleIsDone = (todo: Todo) => {
    // 上で定義したMutationを実行する
    return () => {
      updateTodoDoneMutation.mutate(todo);
    };
  };

  // 新規ToDo作成のハンドラ
  function handleSumit (data: CreateTodoRequest){
    createTodo(data)
  }

  // 編集に関するハンドラを追加
  // 編集ボタンがクリックされた時の処理
  const handleEditClick = (todo: Todo) => {
    // どのToDoを編集するかstateに保存する
    setEditingTodo({...todo});
  };

  // 「キャンセル」ボタンがクリックされたときの処理
  const handleCancelClick = () => {
    // 編集モードを終了する
    setEditingTodo(null);
  };

  // 「保存」ボタンがクリックされたときの処理
  const handleSaveClick = () => {
    if(!editingTodo) return;

    // APIリクエスト用に不要なプロパティを除外する
    const { id, createdAt, updatedAt, isDone, ...updateData } = editingTodo;

    updateTodoMutation.mutate({ id: editingTodo.id, data: updateData });
  };

  // 「削除」ボタンがクリックされたときの処理
  const handleDeleteClick = (todoId: string) => {
    // ユーザーに削除の確認を求める
    if(window.confirm("本当にこのタスクを削除しますか？")) {
      deleteTodoMutation.mutate({ id: todoId });
    }
  };

  // 編集中の入力欄の値が変更されたときの処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!editingTodo) return;

    const { name, value } = e.target;
    // 入力内容をstateに反映する
    setEditingTodo({ ...editingTodo, [name]: value });
  };


  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 gap-8 sm:p-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
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
      // フォームをリセット
      event.currentTarget.reset(); 
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
      <table className="w-full max-w-4xl bg-white shadow-md rounded-lg">
        {/* テーブルヘッダーをつけて見やすくする */}
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Is Done</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data?.map((todo) => (
            <tr key={todo.id} className="border-b border-gray-200 hover:bg-gray-100">
              {/* editingTodoのIDと現在のtodoのIDを比較して、表示を切り替える */}
              {editingTodo && editingTodo.id === todo.id ? (
                // --- 編集モードの表示 ---
                <>
                <td className="py-3 px-6 text-left whitespace-nowrap">{todo.id}</td>
                <td className="py-3 px-6 text-left">
                  <input
                    type="text"
                    name="title"
                    value={editingTodo.title}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="py-3 px-6 text-left">
                  <input
                    type="text"
                    name="description"
                    value={editingTodo.description}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="py-3 px-6 textcenter">
                  {/* 完了状態はここでは編集しない */}
                  <span className="text-2xl">{todo.isDone ? "✅" : "❌"}</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={handleSaveClick}
                    // 更新中はクリックできないようにする
                    disabled={updateTodoMutation.isPending} 
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 mr-2"
                  >
                    {updateTodoMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </td>
                </>
              ) : (
                // --- 通常表示モード ---
                <>
              <td className="py-3 px-6 text-left whitespace-nowrap">{todo.id}</td>
              <td className="py-3 px-6 text-left">{todo.title}</td>
              <td className="py-3 px-6 text-left">{todo.description}</td>
              <td className="py-3 px-6 text-center">
                <input
                  type = "checkbox"
                  checked = {todo.isDone}
                  onChange={handleToggleIsDone(todo)}
                  disabled={updateTodoDoneMutation.isPending}
                  className="transform scale150 cursor-pointer"
                />
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => handleEditClick(todo)}
                  className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(todo.id)}
                  // 更新中はクリックできないようにする
                  disabled={deleteTodoMutation.isPending}
                  className="bg-red-500 text-white py-1 px-3 rounded text-xs hover:bg-red-600"
                >
                  {deleteTodoMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </td>
              </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
