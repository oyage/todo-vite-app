import React from 'react';
import styled from 'styled-components';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

// スタイル付きコンポーネント
// TODOリストのスタイル
const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// TodoListコンポーネントのpropsの型定義
interface TodoListProps {
  todos: Todo[]; // 表示するTODOの配列
  onToggleTodo: (id: string) => void; // TODOの完了状態を切り替える関数
  onDeleteTodo: (id: string) => void; // TODOを削除する関数
}

// TodoListコンポーネント： TODOアイテムのリストを表示する
const TodoList: React.FC<TodoListProps> = ({ todos, onToggleTodo, onDeleteTodo }) => {
  return (
    // StyledListコンポーネント：TODOリスト全体をラップ
    <StyledList>
      {/* todos配列をマップして、各TODOアイテムをTodoItemコンポーネントとして表示 */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id} // Reactがリストアイテムを効率的に更新するためのキー
          todo={todo} // 表示するTODOオブジェクト
          onToggleTodo={onToggleTodo} // TODOの完了状態を切り替える関数を渡す
          onDeleteTodo={onDeleteTodo} // TODOを削除する関数を渡す
        />
      ))}
    </StyledList>
  );
};

export default TodoList;
