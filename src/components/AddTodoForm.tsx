import React, { useState } from 'react';
import styled from 'styled-components';

// スタイル付きコンポーネント
// フォームコンテナのスタイル
const FormContainer = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

// 入力フィールドのスタイル
const StyledInput = styled.input`
  flex: 1;
  padding: 0.5em;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

// 送信ボタンのスタイル
const StyledButton = styled.button`
  padding: 0.5em 1em;
  font-size: 1em;
  background: #646cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #535bf2;
  }
`;

// AddTodoFormコンポーネントのpropsの型定義
interface AddTodoFormProps {
  onAddTodo: (text: string) => void; // TODOを追加する関数
}

// AddTodoFormコンポーネント： 新しいTODOを入力し追加するためのフォーム
const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  // 入力フィールドのstate
  const [input, setInput] = useState('');

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信動作をキャンセル
    if (!input.trim()) return; // 入力が空白の場合は何もしない
    onAddTodo(input.trim()); // onAddTodo関数を呼び出してTODOを追加
    setInput(''); // 入力フィールドをクリア
  };

  return (
    // フォームコンテナ
    <FormContainer onSubmit={handleSubmit}>
      {/* 入力フィールド */}
      <StyledInput
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)} // 入力値が変更されたらstateを更新
        placeholder="新しいタスクを入力..."
      />
      {/* 送信ボタン */}
      <StyledButton type="submit">追加</StyledButton>
    </FormContainer>
  );
};

export default AddTodoForm;
