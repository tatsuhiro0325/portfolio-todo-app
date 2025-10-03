.PHONY: help db-up db-down db-migrate db-reset db-studio install dev build

help: ## ヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## 依存関係をインストール
	npm install

db-up: ## PostgreSQLコンテナを起動
	docker compose up postgres -d

db-down: ## PostgreSQLコンテナを停止
	docker compose down

db-migrate: ## Prismaマイグレーションを実行
	npx prisma migrate dev

db-reset: ## データベースをリセット
	npx prisma migrate reset

db-studio: ## Prisma Studioを起動
	npx prisma studio

db-generate: ## Prisma Clientを生成
	npx prisma generate

dev: ## 開発サーバーを起動
	npm run dev

build: ## ビルド
	npm run build

start: ## 本番サーバーを起動
	npm start
