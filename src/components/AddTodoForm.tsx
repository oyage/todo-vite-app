import React, { useState } from 'react';
import styled from 'styled-components';

// スタイル付きコンポーネント定義
/**
 * フォーム要素のスタイル付きコンテナ。
 * Flexboxを使用して内部要素を配置し、下部にマージンを設定します。
 */
const FormContainer = styled.form`
  display: flex;       // Flexboxレイアウトを使用
  gap: 0.5rem;         // 子要素間の間隔
  margin-bottom: 1.5rem; // フォームの下の余白
`;

/**
 * テキスト入力フィールドのスタイル付きコンポーネント。
 * Flexアイテムとして伸縮し、パディング、フォントサイズ、ボーダー、角丸が設定されています。
 */
const StyledInput = styled.input`
  flex: 1;             // 親コンテナ内で利用可能なスペースを占める
  padding: 0.5em;      // 内側の余白
  font-size: 1em;      // フォントサイズ
  border: 1px solid #ccc; // 境界線
  border-radius: 6px;  // 角丸
`;

/**
 * 送信ボタンのスタイル付きコンポーネント。
 * パディング、フォントサイズ、背景色、文字色、ボーダー、角丸、カーソルスタイルが設定されています。
 * ホバー時の背景色変更トランジションも含まれます。
 */
const StyledButton = styled.button`
  padding: 0.5em 1em;  // 内側の余白
  font-size: 1em;      // フォントサイズ
  background: #646cff; // 背景色
  color: #fff;          // 文字色
  border: none;          // ボーダーなし
  border-radius: 6px;  // 角丸
  cursor: pointer;       // カーソル形状
  transition: background 0.2s; // 背景色のトランジション効果

  &:hover {
    background: #535bf2; // ホバー時の背景色
  }
`;

/**
 * AddTodoFormコンポーネントのPropsの型定義。
 * @property onAddTodo - 新しいTODOが追加されたときに呼び出されるコールバック関数。テキストを引数に取ります。
 */
interface AddTodoFormProps {
  onAddTodo: (text: string) => void; // TODO追加時に呼び出される関数
}

/**
 * 新しいTODOアイテムを追加するためのフォームコンポーネント。
 * 入力フィールドと追加ボタンを持ちます。
 * @param {AddTodoFormProps} props - コンポーネントのプロパティ。
 */
const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  // 入力フィールドの現在の値を保持する状態
  const [input, setInput] = useState('');

  /**
   * フォーム送信時の処理ハンドラ。
   * 入力が空でない場合、onAddTodoコールバックを呼び出し、入力フィールドをクリアします。
   * @param {React.FormEvent} e - フォーム送信イベントオブジェクト。
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信動作をキャンセル
    if (!input.trim()) return; // 入力が空白のみの場合は何もしない
    onAddTodo(input.trim()); // onAddTodoコールバックを実行
    setInput(''); // 入力フィールドをクリア
  };

  // フォームのJSX構造
  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* テキスト入力フィールド */}
      <StyledInput
        type="text"
        value={input} // 入力値と状態をバインド
        onChange={e => setInput(e.target.value)} // 入力変更時に状態を更新
        placeholder="新しいタスクを入力..." // プレースホルダーテキスト
      />
      {/* 追加ボタン */}
      <StyledButton type="submit">追加</StyledButton>
    </FormContainer>
  );
};

export default AddTodoForm;
