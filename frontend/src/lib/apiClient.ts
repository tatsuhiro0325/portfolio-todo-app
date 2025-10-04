// src/lib/apiClient.ts の修正後のコード

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// 1. Axiosインスタンス自体は内部で作成
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001",
  // withCredentials: true, // Cookie使う場合
});

// 2. orvalが要求する Mutator 関数を「名前付きエクスポート」する
//    これが orval.config.ts で指定した "apiClient" 関数です。
export const apiClient = async <T>(
  config: AxiosRequestConfig, // orvalから渡されるリクエスト設定
): Promise<T> => {
  // インスタンスを使ってリクエストを実行
  const promise = instance.request<T, AxiosResponse<T>>(config);

  // orvalの期待通り、レスポンス全体ではなく、.data 部分（T型）を返します
  return promise.then(({ data }) => data);
};
