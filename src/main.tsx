import { StrictMode } from 'react' // ReactのStrictModeをインポート
import { createRoot } from 'react-dom/client' // ReactDOMのcreateRootをインポート
import './index.css' // グローバルCSSをインポート
import App from './App.tsx' // メインアプリケーションコンポーネントをインポート
import { TodoProvider } from './contexts/TodoContext.tsx' // Todoコンテキストプロバイダーをインポート

// ルートDOM要素を取得し、Reactアプリケーションをレンダリング
createRoot(document.getElementById('root')!).render(
  // StrictModeでアプリケーションをラップし、潜在的な問題を検出
  <StrictMode>
    {/* TodoProviderでAppコンポーネントをラップし、Todoコンテキストを提供 */}
    <TodoProvider>
      <App />
    </TodoProvider>
  </StrictMode>,
)
