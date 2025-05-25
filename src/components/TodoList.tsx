import React from 'react'; // ReactはJSX変換に新しいトランスフォームでは不要だが、型定義などで必要な場合があるため残すことも可
import styled from 'styled-components';
import { Todo } from '../types/todo'; // Todo型をインポート
import TodoItem from './TodoItem'; // TodoItemコンポーネントをインポート

// スタイル付きコンポーネント定義
/**
 * TODOアイテムのリスト（<ul>）のスタイル付きコンポーネント。
 * リストのデフォルトスタイル（マーカー、パディング、マージン）をリセットします。
 */
const StyledList = styled.ul`
  list-style: none; // リストマーカー（点など）を非表示
  padding: 0;       // 内側の余白をリセット
  margin: 0;        // 外側の余白をリセット
`;

/**
 * TodoListコンポーネントのPropsの型定義。
 * @property todos - 表示するTODOアイテムの配列。
 * @property onToggleTodo - TODOアイテムの完了状態を切り替える際に呼び出されるコールバック関数。
 * @property onDeleteTodo - TODOアイテムを削除する際に呼び出されるコールバック関数。
 */
interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

/**
 * TODOアイテムのリストを表示するためのコンポーネント。
 * `todos`プロップで受け取った各TODOアイテムに対して`TodoItem`コンポーネントを描画します。
 * @param {TodoListProps} props - コンポーネントのプロパティ。
 */
const TodoList: React.FC<TodoListProps> = ({ todos, onToggleTodo, onDeleteTodo }) => {
  return (
    // スタイル付けされたul要素としてTODOリストを描画
    <StyledList>
      {/* todos配列をマップして、各todoオブジェクトごとにTodoItemコンポーネントを生成 */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id} // Reactがリストアイテムを効率的に更新するためのキー
          todo={todo} // 表示するTODOアイテムデータ
          onToggleTodo={onToggleTodo} // TodoItem内でトグル操作があった場合に呼び出す関数
          onDeleteTodo={onDeleteTodo} // TodoItem内で削除操作があった場合に呼び出す関数
        />
      ))}
    </StyledList>
  );
};

export default TodoList;
