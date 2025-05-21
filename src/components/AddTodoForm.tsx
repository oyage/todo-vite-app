import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const FormContainer = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.5em;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

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

interface AddTodoFormProps {
  onAddTodo: (text: string) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAddTodo(input.trim());
    setInput('');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="新しいタスクを入力..."
      />
      <StyledButton type="submit">追加</StyledButton>
    </FormContainer>
  );
};

export default AddTodoForm;
