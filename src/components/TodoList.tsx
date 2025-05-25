import React from 'react';
import styled from 'styled-components';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

// Styled Components
const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleTodo, onDeleteTodo }) => {
  return (
    <StyledList>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </StyledList>
  );
};

export default TodoList;
