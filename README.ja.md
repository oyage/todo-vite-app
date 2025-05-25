# エンタープライズ TODO アプリケーション

このプロジェクトは、Reactアプリケーションをより構造化され堅牢なアプローチで開発する方法を示すために構築された、強化版 TODO アプリケーションです。シンプルな Vite + TypeScript テンプレートから始まり、高度な状態管理、コンポーネントベースのアーキテクチャ、スタイリングソリューション、エラーハンドリング、ユニットテストを含むように段階的にリファクタリングされてきました。

## 使用技術

*   **React**: ユーザーインターフェースの構築のため。
*   **TypeScript**: 静的型付けと開発者エクスペリエンスの向上のため。
*   **Vite**: 高速な開発体験を提供するビルドツールおよび開発サーバーとして。
*   **Styled-Components**: コンポーネントレベルのスタイリングのため。propsに基づいた動的なスタイリングやスタイル定義の集約が可能です。
*   **Jest**: ユニットテストを実行するためのテストフレームワークとして。
*   **React Testing Library**: ユーザーがコンポーネントと対話する方法に似た形でReactコンポーネントをテストするため。

## プロジェクト構成

このプロジェクトは標準的なReactアプリケーションの構成に従っており、主要なディレクトリは以下のように整理されています：

*   `src/`: アプリケーションのすべてのソースコードが含まれます。
    *   `components/`: 再利用可能なUIコンポーネントが格納されます (例: `AddTodoForm.tsx`, `TodoItem.tsx`, `TodoList.tsx`)。
    *   `contexts/`: React Contextの定義とプロバイダーが含まれます (例: todosのグローバルな状態管理のための`TodoContext.tsx`)。
    *   `services/`: モックAPIサービスの実装が含まれます (例: バックエンドとのやり取りをシミュレートする`todoService.ts`)。
    *   `types/`: 共有されるTypeScriptのインターフェースと型が定義されます (例: `Todo`型のための`todo.ts`)。
    *   `App.tsx`: UIを統括するメインのアプリケーションコンポーネント。
    *   `main.tsx`: Reactアプリが初期化され、DOMにマウントされるアプリケーションのエントリーポイント。
*   `__mocks__/`: Jestのためのモックファイルが含まれます。CSS/スタイルインポートのための`styleMock.js`など。
*   `jest.config.cjs`: Jestの設定ファイル。
*   `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.json`: TypeScriptの設定ファイル。
*   `vite.config.ts`: Viteの設定ファイル。

## 主な機能とコンセプト

*   **React Contextとサービスレイヤーによる状態管理**:
    *   アプリケーションの状態、特にtodosのリストは、React Context (`TodoContext.tsx`) を使用してグローバルに管理されます。
    *   モックサービスレイヤー (`src/services/todoService.ts`) は、todosの取得、追加、切り替え、削除のための非同期API呼び出しをシミュレートします。これにより、関心の分離が促進され、将来的に実際のバックエンドとの統合が容易になります。
    *   `TodoProvider` コンポーネントは、状態ロジックとサービスレイヤーとのインタラクションをカプセル化します。

*   **コンポーネントベースのアーキテクチャ**:
    *   UIは `src/components/` にある、より小さく管理しやすいコンポーネントに分割されており、再利用性と保守性を高めています。

*   **Styled-Componentsによるスタイリング**:
    *   すべてのスタイリングに `styled-components` が使用されており、コンポーネントスコープのスタイルを持つCSS-in-JSが可能です。
    *   トランジェントプロップ（`$`で始まるプロップ）は、Reactの警告を避けつつ、スタイリング固有のデータをDOM要素に渡さずにstyled componentsに渡すために使用されます（例: `TodoItem.tsx`の`$completed`プロップ）。

*   **エラーハンドリング**:
    *   アプリケーションには基本的なエラーハンドリングが含まれています。モックサービスレイヤーから発生するエラー（例：存在しないtodoの切り替えや削除を試みる）は `TodoProvider` によってキャッチされます。
    *   これらのエラーはコンテキストを介してUIに公開され、`App.tsx` でユーザーに表示され、エラーメッセージを閉じるオプションも提供されます。

*   **ユニットテスト**:
    *   ユニットテストはJestとReact Testing Libraryを使用して実装されています。
    *   Jestの設定は `jest.config.cjs` で行われ、スタイルのモックやTypeScriptサポートのための `ts-jest` との統合が含まれています。
    *   `TodoItem` コンポーネントのテストスイート例 (`src/components/TodoItem.test.tsx`) は、コンポーネントのレンダリング、インタラクション、条件付きスタイリングのテスト方法を示しています。

## セットアップと実行方法

1.  **リポジトリをクローンします**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **依存関係をインストールします**:
    ```bash
    npm install
    ```
3.  **開発サーバーを実行します**:
    ```bash
    npm run dev
    ```
    これによりVite開発サーバーが起動し、通常 `http://localhost:5173` で利用可能になります。

## 利用可能なスクリプト

`package.json` で以下のスクリプトが利用可能です:

*   `npm run dev`: Viteを使用して開発サーバーを起動します。
*   `npm run build`: `tsc`とViteを使用して本番用にアプリケーションをビルドします。
*   `npm run lint`: ESLintを使用してコードベースをリントします。
*   `npm run test`: Jestを使用してユニットテストを実行します。
*   `npm run preview`: 本番ビルドをローカルで提供し、プレビューします。

## テストの実行方法

ユニットテストを実行するには:

```bash
npm test
```
このコマンドはJestを実行し、`jest.config.cjs` の設定に一致するすべてのテストファイルを実行します。
