This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 概要

Next.js (React), TypeScript, React Query を使用して開発したモダンなToDoリスト管理アプリケーションです。タスクの作成、表示、更新、削除（CRUD）といった基本的な機能を備えており、サーバーの状態を効率的に管理することで、リロード不要でリアルタイムにUIが更新される快適なユーザー体験を実現しています。

## 機能一覧

- **タスクの追加**: タイトルと詳細を入力して新しいタスクを作成できます。
- **タスク一覧表示**: 登録されているタスクを一覧で確認できます。
- **タスクの完了状態変更**: チェックボックスをクリックすることで、タスクの完了・未完了を即座に切り替えられます。
- **タスクの編集**: 各タスクのタイトルと詳細を後から編集できます。
- **タスクの削除**: 不要になったタスクを削除できます。
- **リアルタイムなUI更新**: タスクの追加、更新、削除を行うと、ページをリロードすることなく画面が即座に反映されます。

## 使用技術

このプロジェクトで使用している主な技術スタックです。

- **フロントエンド**: Next.js 14 (React 18)
- **言語**: TypeScript
- **状態管理 (サーバー)**: React Query (TanStack Query) v5
- **スタイリング**: Tailwind CSS
- **APIクライアント**: Orval (OpenAPIスキーマから型定義とAPIクライアントを自動生成)
- **パッケージ管理**: npm / yarn / pnpm

## こだわった点・工夫した点

### 1. React Queryによる効率的なサーバー状態管理

本アプリケーションの最大の特徴は、React Query を活用してサーバーとのデータ同期を宣言的に行っている点です。

- **キャッシュによる高速な表示**: `useQuery` で取得したToDoリストはキャッシュされ、ユーザーがアプリケーション内を移動しても瞬時に表示されます。
- **リロード不要なUI更新**: `useMutation` を用いてタスクの作成・更新・削除処理を実装しました。処理成功後 (`onSuccess`) に `queryClient.invalidateQueries` を呼び出すことで、関連するデータ（ToDoリスト）のキャッシュを無効化し、自動的に最新の状態を再取得させます。これにより、手動でリロードすることなく、UIがリアルタイムに更新されます。
- **ローディング・エラー状態の管理**: API通信中のローディング状態やエラー発生時のハンドリングを、React Queryの提供する状態 (`isPending`, `isError`) を利用してシンプルに実装しました。

### 2. TypeScriptとAPIクライアント自動生成による型安全な開発

- **TypeScriptの全面採用**: すべてのコンポーネントとロジックに型付けを行い、開発時の予期せぬバグを防ぎ、コードの可読性と保守性を高めました。
- **型安全なAPI通信**: バックエンドのOpenAPIスキーマからOrvalを用いてAPIクライアントと型定義を自動生成しています。これにより、APIリクエストのパラメータやレスポンスの型が保証され、サーバーとフロントエンド間の意図しない型の不一致によるエラーを未然に防いでいます。

### 3. Tailwind CSSによる効率的なスタイリング

ユーティリティファーストのアプローチを採用することで、CSSファイルを直接編集することなく、迅速にUIを構築しました。レスポンシブデザインにも対応し、様々な画面サイズで見やすいレイアウトを実現しています。

## 環境構築・実行方法

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
