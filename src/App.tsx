import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTodos } from './contexts/TodoContext';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AuthDetails from './components/AuthDetails';
import ProtectedRoute from './components/ProtectedRoute';

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

// TodoAppContent will now hold the original content of App
const TodoAppContent = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, error, clearError } = useTodos();

  return (
    <AppContainer>
      <Title>TODOアプリ</Title>
      {error && (
        <ErrorMessageContainer onClick={clearError}>
          エラー: {error} (クリックして閉じる)
        </ErrorMessageContainer>
      )}
      <AddTodoForm onAddTodo={addTodo} />
      <TodoList todos={todos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} />
    </AppContainer>
  );
};

// Appコンポーネント： TODOアプリケーションのメインコンポーネント
function App() {
  return (
    <BrowserRouter>
      <AuthDetails />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TodoAppContent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
