import React from 'react';
import styled from 'styled-components';
import { Todo } from '../types/todo';

// Styled Components
interface ListItemProps {
  $completed: boolean; // Renamed prop
}

const ListItem = styled.li<ListItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

interface TodoTextProps {
  $completed: boolean; // Renamed prop
}

const TodoText = styled.span<TodoTextProps>`
  flex: 1;
  text-align: left;
  cursor: pointer;
  color: ${props => (props.$completed ? '#aaa' : '#213547')};
  background: ${props => (props.$completed ? '#e0e0e0' : '#f3f3fa')};
  padding: 0.3em 0.6em;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  text-decoration: ${props => (props.$completed ? 'line-through' : 'none')};
`;

const DeleteButton = styled.button`
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3em 0.8em;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #d9534f;
  }
`;


interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleTodo, onDeleteTodo }) => {
  return (
    <ListItem $completed={todo.completed}>
      <TodoText onClick={() => onToggleTodo(todo.id)} $completed={todo.completed}>
        {todo.text}
      </TodoText>
      <DeleteButton onClick={() => onDeleteTodo(todo.id)}>削除</DeleteButton>
    </ListItem>
  );
};

export default TodoItem;
