# Backend Setup Guide

## 必要なもの

- Node.js (v18以上)
- Docker & Docker Compose
- Make（オプション）

## セットアップ手順

### 1. 依存関係のインストール

```bash
cd backend
npm install
```

または Makeを使用する場合:
```bash
make install
```

### 2. 環境変数の設定

`.env`ファイルは既に作成されていますが、必要に応じて編集してください:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_db?schema=public"
PORT=3001
```

### 3. データベースの起動

Docker Composeを使用してPostgreSQLコンテナを起動:

```bash
docker compose up postgres -d
```

または Makeを使用する場合:
```bash
make db-up
```

データベースが起動するまで数秒待ちます。

### 4. Prisma Clientの生成とマイグレーション

```bash
npm run prisma:generate
npm run prisma:migrate
```

または Makeを使用する場合:
```bash
make db-generate
make db-migrate
```

マイグレーション名を聞かれたら、例えば `init` と入力してください。

### 5. サーバーの起動

開発サーバーを起動:

```bash
npm run dev
```

または Makeを使用する場合:
```bash
make dev
```

サーバーは `http://localhost:3001` で起動します。

## Makeコマンド一覧

```bash
make help           # ヘルプを表示
make install        # 依存関係をインストール
make db-up          # PostgreSQLコンテナを起動
make db-down        # PostgreSQLコンテナを停止
make db-migrate     # Prismaマイグレーションを実行
make db-reset       # データベースをリセット
make db-studio      # Prisma Studioを起動
make db-generate    # Prisma Clientを生成
make dev            # 開発サーバーを起動
make build          # ビルド
make start          # 本番サーバーを起動
```

## プロジェクト構造

```
backend/
├── src/
│   ├── domain/              # ドメイン層
│   │   ├── entities/        # エンティティ
│   │   └── repositories/    # リポジトリインターフェース
│   ├── application/         # アプリケーション層
│   │   └── usecases/        # ユースケース
│   ├── infrastructure/      # インフラストラクチャ層
│   │   ├── database/        # データベース接続
│   │   └── repositories/    # リポジトリ実装
│   ├── presentation/        # プレゼンテーション層
│   │   ├── controllers/     # コントローラー
│   │   ├── routes/          # ルーティング
│   │   └── schemas/         # バリデーションスキーマ
│   └── index.ts             # エントリーポイント
├── prisma/
│   └── schema.prisma        # Prismaスキーマ
├── docker-compose.yml       # Docker Compose設定
├── Makefile                 # Makeコマンド
├── package.json
├── tsconfig.json
└── API_SPECIFICATION.md     # API定義書
```

## APIのテスト

サーバーが起動したら、以下のコマンドでAPIをテストできます:

### ヘルスチェック
```bash
curl http://localhost:3001
```

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

詳細なAPI仕様は `API_SPECIFICATION.md` を参照してください。

## トラブルシューティング

### データベース接続エラー

PostgreSQLコンテナが起動しているか確認:
```bash
docker ps
```

起動していない場合:
```bash
docker compose up postgres -d
```

### ポートが既に使用されている

別のアプリケーションがポート3001または5432を使用している場合は、`.env`ファイルでポートを変更してください。

### マイグレーションエラー

データベースをリセットして再度マイグレーション:
```bash
make db-reset
```

## クリーンアーキテクチャについて

このプロジェクトはクリーンアーキテクチャに基づいています:

- **Domain層**: ビジネスロジックとエンティティ（依存なし）
- **Application層**: ユースケース（Domainに依存）
- **Infrastructure層**: 外部サービスとの接続（DomainとApplicationに依存）
- **Presentation層**: API層（すべての層に依存）

依存関係は内側から外側へ一方向のみです。
