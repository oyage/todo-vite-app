import styled from 'styled-components';
import { useTodos } from './contexts/TodoContext'
import AddTodoForm from './components/AddTodoForm'
import TodoList from './components/TodoList'

// スタイル付きコンポーネント
// アプリケーションのメインコンテナのスタイル
const AppContainer = styled.div`
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  text-align: center;
`;

// アプリケーションのタイトルのスタイル
const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: #646cff;
`;

// App.tsx は、自身の state や props で Todo 型を使用しない場合、直接インポートする必要はありません。
// 子コンポーネントとコンテキストが Todo 型を処理します。

// エラーメッセージコンテナのスタイル
const ErrorMessageContainer = styled.div`
  background-color: #ffdddd;
  color: #d8000c;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #d8000c;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
`;

// Appコンポーネント： TODOアプリケーションのメインコンポーネント
function App() {
  // useTodosフックからTODOリスト、追加、切り替え、削除関数、エラー、エラークリア関数を取得
  const { todos, addTodo, toggleTodo, deleteTodo, error, clearError } = useTodos()

  return (
    // AppContainerでアプリケーション全体をラップ
    <AppContainer>
      {/* アプリケーションのタイトル */}
      <Title>TODOアプリ</Title>
      {/* エラーが存在する場合、エラーメッセージを表示 */}
      {error && (
        <ErrorMessageContainer onClick={clearError}>
          エラー: {error} (クリックして閉じる)
        </ErrorMessageContainer>
      )}
      {/* TODO追加フォームコンポーネント */}
      <AddTodoForm onAddTodo={addTodo} />
      {/* TODOリストコンポーネント */}
      <TodoList todos={todos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} />
    </AppContainer>
  )
}

export default App
