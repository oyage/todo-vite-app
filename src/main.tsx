import { StrictMode } from 'react'; // ReactのStrictModeをインポート
import { createRoot } from 'react-dom/client'; // React 18の新しいルートAPIをインポート
import './index.css'; // グローバルCSSをインポート
import App from './App.tsx'; // メインアプリケーションコンポーネントをインポート
import { TodoProvider } from './contexts/TodoContext.tsx'; // Todoコンテキストプロバイダーをインポート

// アプリケーションのルート要素を取得
const rootElement = document.getElementById('root');

// ルート要素が存在することを確認してからレンダリング処理を行う
if (rootElement) {
  // createRootを使用してReactアプリケーションのルートを作成
  const root = createRoot(rootElement);
  
  // アプリケーション全体をレンダリング
  root.render(
    // StrictModeは、アプリケーション内の潜在的な問題を強調表示するための開発用ツール
    <StrictMode>
      {/* TodoProviderでAppコンポーネントをラップし、Todo関連の状態とアクションをApp全体で利用可能にする */}
      <TodoProvider>
        <App /> {/* メインアプリケーションコンポーネント */}
      </TodoProvider>
    </StrictMode>
  );
} else {
  // ルート要素が見つからない場合のエラー処理
  console.error("Failed to find the root element. Please ensure an element with ID 'root' exists in your HTML.");
}
