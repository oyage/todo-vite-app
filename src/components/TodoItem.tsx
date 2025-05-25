import React from 'react';
import styled from 'styled-components';
import type { Todo } from '../types/todo';

// スタイル付きコンポーネント
// ListItemコンポーネントのpropsの型定義
interface ListItemProps {
  $completed: boolean; // 名前の変更されたprop
}

// TODOアイテムのリスト要素のスタイル
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

// TodoTextコンポーネントのpropsの型定義
interface TodoTextProps {
  $completed: boolean; // 名前の変更されたprop
}

// TODOテキストのスタイル
const TodoText = styled.span<TodoTextProps>`
  flex: 1;
  text-align: left;
  cursor: pointer;
  color: ${props => (props.$completed ? '#aaa' : '#213547')}; // 完了状態に応じて文字色を変更
  background: ${props => (props.$completed ? '#e0e0e0' : '#f3f3fa')}; // 完了状態に応じて背景色を変更
  padding: 0.3em 0.6em;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  text-decoration: ${props => (props.$completed ? 'line-through' : 'none')}; // 完了状態に応じて取り消し線を追加
`;

// 削除ボタンのスタイル
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

// TodoItemコンポーネントのpropsの型定義
interface TodoItemProps {
  todo: Todo; // 表示するTODOオブジェクト
  onToggleTodo: (id: string) => void; // TODOの完了状態を切り替える関数
  onDeleteTodo: (id: string) => void; // TODOを削除する関数
}

// TodoItemコンポーネント：個々のTODOアイテムを表示し、操作を行う
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleTodo, onDeleteTodo }) => {
  return (
    // ListItemコンポーネント：TODOアイテム全体をラップ
    <ListItem $completed={todo.completed}>
      {/* TodoTextコンポーネント：TODOのテキスト部分。クリックで完了状態を切り替え */}
      <TodoText onClick={() => onToggleTodo(todo.id)} $completed={todo.completed}>
        {todo.text}
      </TodoText>
      {/* DeleteButtonコンポーネント：クリックでTODOを削除 */}
      <DeleteButton onClick={() => onDeleteTodo(todo.id)}>削除</DeleteButton>
    </ListItem>
  );
};

export default TodoItem;
