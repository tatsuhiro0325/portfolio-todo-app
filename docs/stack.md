# 📚 技術スタック & 学習リソース

このドキュメントは、`frontend/src/app/page.tsx`で使用されている技術とその学習リソースをまとめたものです。

## 目次

- [使用技術一覧](#使用技術一覧)
- [各技術の詳細](#各技術の詳細)
- [コード内での使用例](#コード内での使用例)
- [推奨学習順序](#推奨学習順序)
- [参考リソース](#参考リソース)

---

## 使用技術一覧

| 技術 | 用途 | バージョン |
|------|------|-----------|
| Next.js | フルスタックフレームワーク | 14+ (App Router) |
| React | UIライブラリ | 18+ |
| TypeScript | 型安全な開発 | 5+ |
| React Hook Form | フォーム管理 | 7+ |
| Zod | スキーマバリデーション | 3+ |
| TanStack Query | サーバーステート管理 | 5+ |
| Tailwind CSS | スタイリング | 3+ |

---

## 各技術の詳細

### 1. Next.js (App Router)

**概要**: Reactベースのフルスタックフレームワーク。サーバーサイドレンダリング、ルーティング、最適化などを提供。

**公式リソース**:
- 公式ドキュメント: https://nextjs.org/docs
- App Routerガイド: https://nextjs.org/docs/app
- 日本語ドキュメント: https://nextjs-ja-translation-docs.vercel.app/

**このプロジェクトでの使用**:
- `"use client"`ディレクティブでクライアントコンポーネントを定義
- App Routerによるファイルベースルーティング

---

### 2. React Hook Form

**概要**: 高パフォーマンスで使いやすいフォーム管理ライブラリ。再レンダリングを最小限に抑え、シンプルなAPIを提供。

**公式リソース**:
- 公式ドキュメント: https://react-hook-form.com/
- Get Started: https://react-hook-form.com/get-started
- useForm API: https://react-hook-form.com/docs/useform
- register API: https://react-hook-form.com/docs/useform/register
- 日本語版: https://react-hook-form.com/jp

**主要機能**:
- `useForm()`: フォームの状態管理
- `register()`: input要素の登録
- `handleSubmit()`: フォーム送信処理
- `formState.errors`: バリデーションエラーの取得
- `reset()`: フォームのリセット

---

### 3. Zod

**概要**: TypeScript優先のスキーマ検証ライブラリ。型安全なバリデーションを提供。

**公式リソース**:
- 公式ドキュメント: https://zod.dev/
- GitHub: https://github.com/colinhacks/zod
- 基本的な使い方: https://zod.dev/?id=basic-usage

**主要機能**:
- `z.object()`: オブジェクトスキーマの定義
- `z.string()`: 文字列の検証
- `.min()`, `.max()`: 長さの制約
- `z.infer<>`: TypeScript型の自動生成

**日本語記事**:
- Zod入門: https://zenn.dev/uttk/articles/bd264fa884e026

---

### 4. @hookform/resolvers

**概要**: React Hook FormとZodを連携させるライブラリ。

**公式リソース**:
- GitHub: https://github.com/react-hook-form/resolvers
- 統合ガイド: https://react-hook-form.com/get-started#SchemaValidation

**このプロジェクトでの使用**:
```typescript
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(todoSchema),
});
```

---

### 5. TanStack Query (React Query)

**概要**: サーバーステート管理ライブラリ。データ取得、キャッシュ、同期を簡単に実現。

**公式リソース**:
- 公式ドキュメント: https://tanstack.com/query/latest
- Quick Start: https://tanstack.com/query/latest/docs/framework/react/quick-start
- Queries: https://tanstack.com/query/latest/docs/framework/react/guides/queries
- Mutations: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
- Query Invalidation: https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation

**主要機能**:
- `useQuery`: データの取得
- `useMutation`: データの作成・更新・削除
- `invalidateQueries`: キャッシュの無効化
- `queryClient`: クエリの管理

**日本語記事**:
- TanStack Query入門: https://zenn.dev/yuitosato/articles/292f13816993ef

---

### 6. TypeScript

**概要**: JavaScriptに静的型付けを追加した言語。型安全な開発を実現。

**公式リソース**:
- 公式ドキュメント: https://www.typescriptlang.org/docs/
- 日本語ハンドブック: https://typescript-jp.gitbook.io/deep-dive/
- サバイバルTypeScript: https://typescriptbook.jp/

**このプロジェクトでの使用**:
- 型推論: `z.infer<typeof todoSchema>`
- インターフェース定義
- ジェネリクス: `useForm<TodoFormData>`

---

### 7. Tailwind CSS

**概要**: ユーティリティファーストのCSSフレームワーク。HTMLにクラスを追加してスタイリング。

**公式リソース**:
- 公式ドキュメント: https://tailwindcss.com/docs
- ユーティリティクラス: https://tailwindcss.com/docs/utility-first

**このプロジェクトでの使用例**:
```tsx
className="w-full p-2 border"  // 幅100%、パディング、ボーダー
className="bg-blue-500 text-white"  // 背景青、文字白
className="max-w-2xl mx-auto"  // 最大幅、中央揃え
```

---

## コード内での使用例

### パターン1: React Hook Form + Zod

```typescript
// ステップ1: Zodでスキーマ定義
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

// ステップ2: TypeScript型を自動生成
type TodoFormData = z.infer<typeof todoSchema>;

// ステップ3: useFormでフォームを初期化
const createForm = useForm<TodoFormData>({
  resolver: zodResolver(todoSchema),  // Zodと統合
  defaultValues: { title: "", description: "" },
});

// ステップ4: JSXでフォームを構築
<form onSubmit={createForm.handleSubmit(handleCreateSubmit)}>
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
  <button type="submit">追加</button>
</form>

// ステップ5: 送信ハンドラー
const handleCreateSubmit = (formData: TodoFormData) => {
  createTodo.mutate({ data: formData });
};
```

**ポイント**:
- `zodResolver`でバリデーションを自動化
- `register`でinput要素を登録
- `formState.errors`でエラーメッセージを表示
- `handleSubmit`で送信時の処理を実行

---

### パターン2: TanStack Query (データ取得)

```typescript
// データ取得
const { data, isLoading, error } = useGetTodos();

// ローディング状態の処理
{isLoading ? (
  <p>読み込み中...</p>
) : error ? (
  <p>エラーが発生しました</p>
) : (
  <div>
    {data?.map((todo) => (
      <div key={todo.id}>{todo.title}</div>
    ))}
  </div>
)}
```

**ポイント**:
- `data`: 取得したデータ
- `isLoading`: 読み込み中かどうか
- `error`: エラー情報

---

### パターン3: TanStack Query (データ更新)

```typescript
const queryClient = useQueryClient();

// Mutation（作成・更新・削除）の定義
const createTodo = useCreateTodo({
  mutation: {
    onSuccess: () => {
      // 成功時にキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ["/todos"] });
      createForm.reset();  // フォームをリセット
    },
  },
});

// 実行
const handleCreateSubmit = (formData: TodoFormData) => {
  createTodo.mutate({ data: formData });
};

// ボタンでの使用
<button
  type="submit"
  disabled={createTodo.isPending}  // 処理中は無効化
>
  {createTodo.isPending ? "追加中..." : "追加"}
</button>
```

**ポイント**:
- `onSuccess`: 成功時のコールバック
- `invalidateQueries`: キャッシュを無効化して再取得
- `isPending`: 処理中かどうか
- `mutate()`: 処理を実行

---

### パターン4: 状態管理 (useState)

```typescript
// 編集中のタスクIDを管理
const [editingId, setEditingId] = useState<string | null>(null);

// 編集モードに切り替え
const handleEditClick = (id: string, title: string, description?: string) => {
  setEditingId(id);
  editForm.reset({ title, description: description || "" });
};

// 編集モードを解除
const handleCancelClick = () => {
  setEditingId(null);
  editForm.reset();
};

// 条件分岐で表示を切り替え
{editingId === todo.id ? (
  <form>編集フォーム</form>
) : (
  <div>通常表示</div>
)}
```

**ポイント**:
- `useState`で状態を管理
- 条件分岐で表示を切り替え
- フォームの`reset()`で値を設定

---

## 推奨学習順序

### 🔰 初級 (基礎を固める)

1. **HTML/CSS基礎**
   - MDN Web Docs: https://developer.mozilla.org/ja/docs/Learn

2. **JavaScript基礎**
   - JavaScript Primer: https://jsprimer.net/

3. **React基礎**
   - React公式チュートリアル: https://ja.react.dev/learn
   - 学習項目: コンポーネント、Props、State、イベント処理

4. **TypeScript基礎**
   - TypeScript公式ハンドブック: https://www.typescriptlang.org/docs/handbook/intro.html
   - サバイバルTypeScript: https://typescriptbook.jp/

### 🎓 中級 (実践的なツールを学ぶ)

5. **フォーム管理 (React Hook Form)**
   - 公式Get Started: https://react-hook-form.com/get-started
   - 日本語記事: https://zenn.dev/knmy/articles/20221029_react-hook-form

6. **バリデーション (Zod)**
   - 公式ドキュメント: https://zod.dev/
   - 日本語記事: https://zenn.dev/uttk/articles/bd264fa884e026

7. **サーバーステート管理 (TanStack Query)**
   - 公式Quick Start: https://tanstack.com/query/latest/docs/framework/react/quick-start
   - 日本語記事: https://zenn.dev/yuitosato/articles/292f13816993ef

### 🚀 上級 (フレームワークを学ぶ)

8. **Next.js**
   - 公式チュートリアル: https://nextjs.org/learn
   - App Routerガイド: https://nextjs.org/docs/app

9. **Tailwind CSS**
   - 公式ドキュメント: https://tailwindcss.com/docs

---

## 参考リソース

### 📖 公式ドキュメント

| 技術 | URL |
|------|-----|
| Next.js | https://nextjs.org/docs |
| React | https://ja.react.dev/ |
| TypeScript | https://www.typescriptlang.org/docs/ |
| React Hook Form | https://react-hook-form.com/ |
| Zod | https://zod.dev/ |
| TanStack Query | https://tanstack.com/query/latest |
| Tailwind CSS | https://tailwindcss.com/docs |

### 🎥 動画チュートリアル (英語)

- **React Hook Form Complete Tutorial**: https://www.youtube.com/watch?v=RkXv4AXXC_4
- **Zod Tutorial**: https://www.youtube.com/watch?v=AeQ3f4zmSMs
- **React Query Tutorial**: https://www.youtube.com/watch?v=8K1N3fE-cDs
- **Next.js 14 Full Course**: https://www.youtube.com/watch?v=wm5gMKuwSYk

### 📝 日本語記事

- **Zod入門**: https://zenn.dev/uttk/articles/bd264fa884e026
- **React Hook Form使い方**: https://zenn.dev/knmy/articles/20221029_react-hook-form
- **TanStack Query入門**: https://zenn.dev/yuitosato/articles/292f13816993ef
- **Next.js App Router入門**: https://zenn.dev/akfm/books/nextjs-basic-principle

### 🛠️ 実践的な学習リソース

- **TypeScript Deep Dive (日本語版)**: https://typescript-jp.gitbook.io/deep-dive/
- **サバイバルTypeScript**: https://typescriptbook.jp/
- **React公式ドキュメント (日本語)**: https://ja.react.dev/

---

## 💡 学習のポイント

### 1. React Hook Formの利点

- ✅ 再レンダリングが少ない（パフォーマンスが良い）
- ✅ シンプルなAPI
- ✅ TypeScriptとの相性が良い
- ✅ Zodと簡単に統合できる

### 2. Zodの利点

- ✅ TypeScript型を自動生成できる
- ✅ ランタイムでの型チェック
- ✅ わかりやすいエラーメッセージ
- ✅ React Hook Formと相性が良い

### 3. TanStack Queryの利点

- ✅ データのキャッシュ管理が簡単
- ✅ ローディング・エラー状態の管理
- ✅ 自動的な再取得
- ✅ 楽観的更新のサポート

---

## 🔍 よくある質問

### Q1: `useForm`と`useState`の違いは？

**A**: `useForm`はフォーム専用で、バリデーション、エラー管理、パフォーマンス最適化が組み込まれています。`useState`は汎用的な状態管理です。

### Q2: なぜZodを使うのか？

**A**: TypeScript型とランタイムバリデーションを同時に定義でき、型安全性が向上します。

### Q3: `invalidateQueries`は何をしているのか？

**A**: キャッシュを無効化して、サーバーから最新データを再取得します。データ更新後に一覧を更新するために使います。

### Q4: `{...form.register("title")}`は何をしているのか？

**A**: input要素をReact Hook Formに登録し、onChange、onBlur、refなどを自動的に設定します。

---

## 📌 まとめ

このプロジェクトでは、モダンなReact開発のベストプラクティスを採用しています:

1. **型安全性**: TypeScript + Zod
2. **フォーム管理**: React Hook Form
3. **データ管理**: TanStack Query
4. **スタイリング**: Tailwind CSS
5. **フレームワーク**: Next.js App Router

これらの技術を組み合わせることで、保守性が高く、パフォーマンスの良いアプリケーションを構築できます。

---

**最終更新日**: 2025年10月4日
