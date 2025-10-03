# portfolio-todo-app

todoテーブル

id, todoしたかどうか bool, タイトル,　詳細

必要なapi

todo post

タイトル,詳細をbodyで投げる

todos/get

todo一覧を手に入れる id,todoしたかどうか、タイトルを見れる様にする

todos/{id}/get
指定されたtodoの詳細までをゲットする

todos/{id}/done

todoしたかどうかを更新できる boolかfalseを投げれる様にする。

todos{id}/delete
todoを削除できる

todos/{id}/put

todoの内容を編集できる。