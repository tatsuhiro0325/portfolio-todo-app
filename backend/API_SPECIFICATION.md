# Todo API 定義書

## ベースURL
```
http://localhost:3001
```

## エンドポイント一覧

### 1. Todoを作成する

**POST** `/todos`

新しいTodoを作成します。

#### リクエスト

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "買い物に行く",
  "description": "牛乳とパンを買う"
}
```

| フィールド | 型 | 必須 | 説明 |
|----------|-----|------|------|
| title | string | ✓ | Todoのタイトル（1〜255文字） |
| description | string | ✓ | Todoの詳細説明 |

#### レスポンス

**Success (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "買い物に行く",
  "description": "牛乳とパンを買う",
  "isDone": false,
  "createdAt": "2025-10-03T10:30:00.000Z",
  "updatedAt": "2025-10-03T10:30:00.000Z"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "message": "Title is required",
      "path": ["title"]
    }
  ]
}
```

---

### 2. Todo一覧を取得する

**GET** `/todos`

すべてのTodoを取得します（作成日時の降順）。

#### リクエスト

パラメータなし

#### レスポンス

**Success (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "買い物に行く",
    "description": "牛乳とパンを買う",
    "isDone": false,
    "createdAt": "2025-10-03T10:30:00.000Z",
    "updatedAt": "2025-10-03T10:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "レポートを書く",
    "description": "期末レポートの作成",
    "isDone": true,
    "createdAt": "2025-10-02T15:20:00.000Z",
    "updatedAt": "2025-10-02T16:00:00.000Z"
  }
]
```

---

### 3. 特定のTodoを取得する

**GET** `/todos/:id`

指定されたIDのTodo詳細を取得します。

#### リクエスト

**Path Parameters:**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string (UUID) | ✓ | TodoのID |

**例:**
```
GET /todos/550e8400-e29b-41d4-a716-446655440000
```

#### レスポンス

**Success (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "買い物に行く",
  "description": "牛乳とパンを買う",
  "isDone": false,
  "createdAt": "2025-10-03T10:30:00.000Z",
  "updatedAt": "2025-10-03T10:30:00.000Z"
}
```

**Error (404 Not Found):**
```json
{
  "error": "Todo not found"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Invalid ID format",
  "details": [
    {
      "validation": "uuid",
      "code": "invalid_string",
      "message": "Invalid UUID format",
      "path": ["id"]
    }
  ]
}
```

---

### 4. Todoを更新する

**PUT** `/todos/:id`

指定されたTodoのタイトルや詳細を更新します。

#### リクエスト

**Path Parameters:**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string (UUID) | ✓ | TodoのID |

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "買い物に行く（更新）",
  "description": "牛乳、パン、卵を買う"
}
```

| フィールド | 型 | 必須 | 説明 |
|----------|-----|------|------|
| title | string | - | Todoのタイトル（1〜255文字） |
| description | string | - | Todoの詳細説明 |

※両方またはいずれか一方を指定可能

#### レスポンス

**Success (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "買い物に行く（更新）",
  "description": "牛乳、パン、卵を買う",
  "isDone": false,
  "createdAt": "2025-10-03T10:30:00.000Z",
  "updatedAt": "2025-10-03T11:00:00.000Z"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Validation error",
  "details": [...]
}
```

---

### 5. Todoの完了状態を更新する

**PATCH** `/todos/:id/done`

指定されたTodoの完了状態（isDone）を更新します。

#### リクエスト

**Path Parameters:**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string (UUID) | ✓ | TodoのID |

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "isDone": true
}
```

| フィールド | 型 | 必須 | 説明 |
|----------|-----|------|------|
| isDone | boolean | ✓ | Todoの完了状態（true: 完了, false: 未完了） |

#### レスポンス

**Success (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "買い物に行く",
  "description": "牛乳とパンを買う",
  "isDone": true,
  "createdAt": "2025-10-03T10:30:00.000Z",
  "updatedAt": "2025-10-03T11:15:00.000Z"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "boolean",
      "received": "string",
      "path": ["isDone"],
      "message": "Expected boolean, received string"
    }
  ]
}
```

---

### 6. Todoを削除する

**DELETE** `/todos/:id`

指定されたTodoを削除します。

#### リクエスト

**Path Parameters:**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string (UUID) | ✓ | TodoのID |

**例:**
```
DELETE /todos/550e8400-e29b-41d4-a716-446655440000
```

#### レスポンス

**Success (200 OK):**
```json
{
  "message": "Todo deleted successfully"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Invalid ID format",
  "details": [...]
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error message"
}
```

---

## データモデル

### Todo

| フィールド | 型 | 説明 |
|----------|-----|------|
| id | string (UUID) | 一意のID（自動生成） |
| title | string | Todoのタイトル |
| description | string | Todoの詳細説明 |
| isDone | boolean | 完了状態（デフォルト: false） |
| createdAt | string (ISO 8601) | 作成日時 |
| updatedAt | string (ISO 8601) | 更新日時 |

---

## エラーレスポンス

### 共通エラーコード

| HTTPステータス | 説明 |
|---------------|------|
| 400 Bad Request | リクエストのバリデーションエラー |
| 404 Not Found | 指定されたリソースが見つからない |
| 500 Internal Server Error | サーバー内部エラー |

### エラーレスポンス形式

```json
{
  "error": "エラーメッセージ",
  "details": [] // オプション: 詳細なエラー情報
}
```

---

## 使用例

### curlコマンドの例

#### 1. Todoを作成
```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"買い物に行く","description":"牛乳とパンを買う"}'
```

#### 2. Todo一覧を取得
```bash
curl http://localhost:3001/todos
```

#### 3. 特定のTodoを取得
```bash
curl http://localhost:3001/todos/550e8400-e29b-41d4-a716-446655440000
```

#### 4. Todoを更新
```bash
curl -X PUT http://localhost:3001/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"title":"買い物に行く（更新）","description":"牛乳、パン、卵を買う"}'
```

#### 5. Todoの完了状態を更新
```bash
curl -X PATCH http://localhost:3001/todos/550e8400-e29b-41d4-a716-446655440000/done \
  -H "Content-Type: application/json" \
  -d '{"isDone":true}'
```

#### 6. Todoを削除
```bash
curl -X DELETE http://localhost:3001/todos/550e8400-e29b-41d4-a716-446655440000
```
