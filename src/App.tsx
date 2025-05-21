import styled from 'styled-components';
import { useTodos } from './contexts/TodoContext'
import AddTodoForm from './components/AddTodoForm'
import TodoList from './components/TodoList'

// Styled Components
const AppContainer = styled.div`
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: #646cff;
`;

// App.tsx no longer needs to import Todo type directly if it's not used for its own state/props.
// Child components and context handle the Todo type.

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

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, error, clearError } = useTodos()

  return (
    <AppContainer>
      <Title>TODOアプリ</Title>
      {error && (
        <ErrorMessageContainer onClick={clearError}>
          Error: {error} (click to dismiss)
        </ErrorMessageContainer>
      )}
      <AddTodoForm onAddTodo={addTodo} />
      <TodoList todos={todos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} />
    </AppContainer>
  )
}

export default App
