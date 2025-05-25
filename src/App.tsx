import styled from 'styled-components';
import { useTodos } from './contexts/TodoContext'; // useTodosフックをコンテキストからインポート
import AddTodoForm from './components/AddTodoForm'; // AddTodoFormコンポーネントをインポート
import TodoList from './components/TodoList'; // TodoListコンポーネントをインポート

// スタイル付きコンポーネント定義
/**
 * アプリケーション全体のメインコンテナのスタイル。
 * 最大幅、中央揃え、パディング、背景色、角丸、影などが設定されています。
 */
const AppContainer = styled.div`
  max-width: 400px;         // 最大幅
  margin: 3rem auto;        // 上下マージン3rem、左右マージン自動（中央揃え）
  padding: 2rem;            // 内側の余白
  background: #fff;         // 背景色（白）
  border-radius: 12px;      // 角丸の半径
  box-shadow: 0 2px 16px rgba(0,0,0,0.08); // ボックスシャドウ
  text-align: center;       // テキスト中央揃え
`;

/**
 * アプリケーションタイトルのスタイル（h1要素）。
 * 下部マージンと文字色が設定されています。
 */
const Title = styled.h1`
  margin-bottom: 1.5rem; // タイトルの下の余白
  color: #646cff;        // 文字色
`;

// App.tsxは、子コンポーネントやコンテキストがTodo型を処理するため、
// 直接Todo型をインポートしたり、自身のstate/propsの型付けに使用する必要は基本的にはありません。
// （以前のコメントの翻訳・調整）

/**
 * エラーメッセージ表示用のコンテナのスタイル。
 * 背景色、文字色、パディング、マージン、境界線、角丸などが設定されています。
 * クリックで閉じることができるようにカーソルも設定されています。
 */
const ErrorMessageContainer = styled.div`
  background-color: #ffdddd; // 背景色（薄い赤）
  color: #d8000c;             // 文字色（濃い赤）
  padding: 10px;              // 内側の余白
  margin-bottom: 15px;        // 下部の余白
  border: 1px solid #d8000c;  // 境界線
  border-radius: 4px;         // 角丸
  cursor: pointer;              // クリック可能なカーソル
  text-align: center;           // テキスト中央揃え
`;

/**
 * メインアプリケーションコンポーネント。
 * `useTodos`フックからTODOの状態とアクションを取得し、
 * UIの主要部分（エラー表示、TODO追加フォーム、TODOリスト）をレンダリングします。
 */
function App() {
  // useTodosフックからtodos配列、各種アクション関数、エラー状態、エラークリア関数を取得
  const { todos, addTodo, toggleTodo, deleteTodo, error, clearError } = useTodos();

  return (
    // アプリケーション全体のコンテナ
    <AppContainer>
      {/* アプリケーションタイトル */}
      <Title>TODOアプリ</Title>
      
      {/* エラーが存在する場合にエラーメッセージコンテナを表示 */}
      {error && (
        <ErrorMessageContainer onClick={clearError}>
          Error: {error} (click to dismiss) {/* エラーメッセージと閉じるための案内 */}
        </ErrorMessageContainer>
      )}
      
      {/* TODO追加フォームコンポーネント。addTodo関数をプロップとして渡す */}
      <AddTodoForm onAddTodo={addTodo} />
      
      {/* TODOリストコンポーネント。todos配列とトグル・削除関数をプロップとして渡す */}
      <TodoList todos={todos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} />
    </AppContainer>
  );
}

export default App;
