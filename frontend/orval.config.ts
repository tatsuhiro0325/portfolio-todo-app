const input = process.env.OAS_REMOTE_URL ?? "../backend/openapi.yaml";

export default {
  frontend: {
    input,
    output: {
      target: "src/gen/api.ts",                 // 型 & クライアントの出力
      schemas: "src/gen/models",                // スキーマ型の出力ディレクトリ
      client: "react-query",                    // axios + react-query hooks を生成
      httpClient: "axios",                      // axiosを使う
      // React Queryのオプション（好みで）
      useUnionTypes: true,                      // oneOf/anyOfをユニオン型に
      exportSchemas: true,                      // スキーマ型もexport
      typedHooks: true,                         // useQuery/useMutationの型を厳密化
      // hooks命名のSuffixなど
      nameSuffix: "Hook",                       // 例: useGetUsersHook
      // キャッシュキーやsuspenseなどの微調整（必要なら）
      override: {
        mutator: {
          path: "src/lib/apiClient.ts",
          name: "apiClient", // axios.create(...) を使わせる
        },
      },
    },
    hooks: {
      // OpenAPIの穴を埋める微修正が必要な場合（operationId の正規化など）
      afterAllFilesWrite: "npm run format",
    },
    mock: true, // ← これで MSW のハンドラも生成される
  },
}
