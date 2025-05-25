// React import is no longer needed here due to the new JSX transform
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from './TodoItem'; // Adjusted import to default
import { type Todo } from '../types/todo'; // Use type-only import

describe('TodoItem', () => {
  const mockTodo: Todo = { id: '1', text: 'Test Todo', completed: false };
  const mockToggleTodo = jest.fn();
  const mockDeleteTodo = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockToggleTodo.mockClear();
    mockDeleteTodo.mockClear();
  });

  test('renders todo text', () => {
    render(<TodoItem todo={mockTodo} onToggleTodo={mockToggleTodo} onDeleteTodo={mockDeleteTodo} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  test('calls onToggleTodo when todo text is clicked', () => {
    render(<TodoItem todo={mockTodo} onToggleTodo={mockToggleTodo} onDeleteTodo={mockDeleteTodo} />);
    fireEvent.click(screen.getByText('Test Todo'));
    expect(mockToggleTodo).toHaveBeenCalledWith('1');
  });

  test('calls onDeleteTodo when delete button is clicked', () => {
    render(<TodoItem todo={mockTodo} onToggleTodo={mockToggleTodo} onDeleteTodo={mockDeleteTodo} />);
    // Assuming the delete button has text "削除"
    fireEvent.click(screen.getByText('削除'));
    expect(mockDeleteTodo).toHaveBeenCalledWith('1');
  });

  test('applies completed styling when todo is completed', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} onToggleTodo={mockToggleTodo} onDeleteTodo={mockDeleteTodo} />);
    const todoTextElement = screen.getByText('Test Todo');
    // The TodoText styled component in TodoItem.tsx applies 'text-decoration: line-through;'
    // when the 'completed' prop is true.
    expect(todoTextElement).toHaveStyle('text-decoration: line-through;');
    // Also, for completeness, let's check the background and color if specified in the subtask or component
    // The subtask example focused on text-decoration, which is a primary visual cue.
    // My TodoText component also changes color and background:
    // color: ${props => (props.completed ? '#aaa' : '#213547')};
    // background: ${props => (props.completed ? '#e0e0e0' : '#f3f3fa')};
    expect(todoTextElement).toHaveStyle('color: #aaa;');
    expect(todoTextElement).toHaveStyle('background: #e0e0e0;');
  });
});
