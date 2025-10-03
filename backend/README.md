# Portfolio Todo App - Backend

Hono + PostgreSQL + Prisma + TypeScriptで構築されたクリーンアーキテクチャのTodo REST APIです。

## 🚀 クイックスタート

### 1. 依存関係のインストール
```bash
npm install
```

### 2. データベースの起動
```bash
docker compose up postgres -d
# または
make db-up
```

### 3. データベースのマイグレーション
```bash
npx prisma migrate dev --name init
# または
make db-migrate
```

### 4. サーバーの起動
```bash
npm run dev
# または
make dev
```

サーバーは http://localhost:3001 で起動します。

## 📚 ドキュメント

- [API定義書](./API_SPECIFICATION.md) - すべてのエンドポイントの詳細
- [セットアップガイド](./SETUP.md) - 詳細なセットアップ手順

## 🏗️ アーキテクチャ

クリーンアーキテクチャに基づいた4層構造：

```
src/
├── domain/              # ドメイン層（ビジネスロジック）
│   ├── entities/        # エンティティ定義
│   └── repositories/    # リポジトリインターフェース
├── application/         # アプリケーション層（ユースケース）
│   └── usecases/        # ビジネスロジックの実装
├── infrastructure/      # インフラストラクチャ層（外部サービス）
│   ├── database/        # データベース接続
│   └── repositories/    # リポジトリ実装
└── presentation/        # プレゼンテーション層（API）
    ├── controllers/     # コントローラー
    ├── routes/          # ルーティング
    └── schemas/         # バリデーション
```

## 📋 API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| POST | `/todos` | Todoを作成 |
| GET | `/todos` | Todo一覧を取得 |
| GET | `/todos/:id` | 特定のTodoを取得 |
| PUT | `/todos/:id` | Todoを更新 |
| PATCH | `/todos/:id/done` | Todoの完了状態を更新 |
| DELETE | `/todos/:id` | Todoを削除 |

詳細は [API_SPECIFICATION.md](./API_SPECIFICATION.md) を参照してください。

## 🛠️ 利用可能なコマンド

### npm scripts
```bash
npm run dev              # 開発サーバー起動（ホットリロード）
npm run build            # TypeScriptをビルド
npm start                # 本番サーバー起動
npm run prisma:generate  # Prisma Clientを生成
npm run prisma:migrate   # マイグレーション実行
npm run prisma:studio    # Prisma Studio起動
```

### Make コマンド
```bash
make help          # ヘルプを表示
make install       # 依存関係をインストール
make db-up         # PostgreSQLコンテナを起動
make db-down       # PostgreSQLコンテナを停止
make db-migrate    # マイグレーション実行
make db-reset      # データベースをリセット
make db-studio     # Prisma Studio起動
make db-generate   # Prisma Clientを生成
make dev           # 開発サーバー起動
make build         # ビルド
```

## 🧪 APIのテスト

### Todoを作成
```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"買い物に行く","description":"牛乳とパンを買う"}'
```

### Todo一覧を取得
```bash
curl http://localhost:3001/todos
```

### 特定のTodoを取得
```bash
curl http://localhost:3001/todos/{id}
```

## 🗄️ データベース

- **DBMS**: PostgreSQL 16
- **ORM**: Prisma
- **コンテナ**: Docker Compose

### スキーマ
```prisma
model Todo {
  id          String   @id @default(uuid())
  title       String
  description String
  isDone      Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔧 環境変数

`.env`ファイルを作成（`.env.example`を参考）：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_db?schema=public"
PORT=3001
```

## 📦 技術スタック

- **Runtime**: Node.js
- **Framework**: Hono
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Architecture**: Clean Architecture

## 🐛 トラブルシューティング

### データベース接続エラー
```bash
# PostgreSQLコンテナの状態を確認
docker ps

# コンテナが停止している場合
docker compose up postgres -d
```

### ポート競合
`.env`ファイルでポート番号を変更してください。

### マイグレーションエラー
```bash
# データベースをリセット
make db-reset
```

## 📝 ライセンス

ISC
