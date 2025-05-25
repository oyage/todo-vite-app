import React from 'react'; // ReactはJSX変換に新しいトランスフォームでは不要だが、型定義などで必要な場合があるため残すことも可
import styled from 'styled-components';
import { Todo } from '../types/todo'; // Todo型をインポート

// スタイル付きコンポーネント定義

/**
 * ListItemコンポーネントのPropsの型定義。
 * @property $completed - TODOアイテムが完了したかどうかを示すブール値（スタイル用トランジェントプロップ）。
 */
interface ListItemProps {
  $completed: boolean; // $接頭辞は、このプロップがstyled-component専用でありDOMに渡されないことを示す
}

/**
 * TODOアイテムのリスト要素（<li>）のスタイル付きコンポーネント。
 * Flexboxを使用して内部要素を配置し、アイテム間の境界線などを設定します。
 * $completedプロップに基づいてスタイルは変更されませんが、このプロップを受け取ります。
 */
const ListItem = styled.li<ListItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 0;
  border-bottom: 1px solid #eee; // アイテムの下境界線

  &:last-child {
    border-bottom: none; // 最後のアイテムの下境界線はなし
  }
`;

/**
 * TodoTextコンポーネントのPropsの型定義。
 * @property $completed - TODOアイテムが完了したかどうかを示すブール値（スタイル用トランジェントプロップ）。
 */
interface TodoTextProps {
  $completed: boolean; // ListItemPropsと同様、$接頭辞を使用
}

/**
 * TODOアイテムのテキスト部分（<span>）のスタイル付きコンポーネント。
 * $completedプロップに基づいて、テキストの色、背景色、取り消し線を動的に変更します。
 */
const TodoText = styled.span<TodoTextProps>`
  flex: 1; // 利用可能なスペースを占める
  text-align: left; // テキストを左揃え
  cursor: pointer; // クリック可能なことを示すカーソル
  color: ${props => (props.$completed ? '#aaa' : '#213547')}; // 完了状態に応じて文字色を変更
  background: ${props => (props.$completed ? '#e0e0e0' : '#f3f3fa')}; // 完了状態に応じて背景色を変更
  padding: 0.3em 0.6em;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s; // スムーズな視覚的変化のためのトランジション
  text-decoration: ${props => (props.$completed ? 'line-through' : 'none')}; // 完了状態に応じて取り消し線を追加
`;

/**
 * 削除ボタンのスタイル付きコンポーネント。
 * 特定の背景色、文字色、パディング、角丸などが設定されています。
 */
const DeleteButton = styled.button`
  background: #ff6b6b; // 背景色（赤系）
  color: #fff; // 文字色（白）
  border: none;
  border-radius: 6px;
  padding: 0.3em 0.8em;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #d9534f; // ホバー時の背景色
  }
`;

/**
 * TodoItemコンポーネントのPropsの型定義。
 * @property todo - 表示するTODOアイテムオブジェクト。
 * @property onToggleTodo - TODOアイテムの完了状態を切り替える際に呼び出されるコールバック関数。
 * @property onDeleteTodo - TODOアイテムを削除する際に呼び出されるコールバック関数。
 */
interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

/**
 * 単一のTODOアイテムを表示および操作するためのコンポーネント。
 * テキストをクリックすると完了状態が切り替わり、削除ボタンでアイテムを削除できます。
 * @param {TodoItemProps} props - コンポーネントのプロパティ。
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleTodo, onDeleteTodo }) => {
  return (
    // ListItemコンポーネント。$completedプロップを渡してスタイリングを制御
    <ListItem $completed={todo.completed}>
      {/* TodoTextコンポーネント。クリックでonToggleTodoを呼び出し、$completedプロップを渡す */}
      <TodoText onClick={() => onToggleTodo(todo.id)} $completed={todo.completed}>
        {todo.text} {/* TODOのテキスト内容を表示 */}
      </TodoText>
      {/* 削除ボタン。クリックでonDeleteTodoを呼び出す */}
      <DeleteButton onClick={() => onDeleteTodo(todo.id)}>削除</DeleteButton>
    </ListItem>
  );
};

export default TodoItem;
