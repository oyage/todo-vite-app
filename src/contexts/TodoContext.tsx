import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as todoService from '../services/todoService'; // Import the service
import type { Todo } from '../types/todo'; // Import Todo type

// Type for the context state and actions
export interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// Create the context with a default undefined value
export const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Props for the TodoProvider
interface TodoProviderProps {
  children: ReactNode;
}

// TodoProvider component
export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  // Fetch initial todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setError(null);
        const initialTodos = await todoService.getTodos();
        setTodos(initialTodos);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching todos.");
        }
        console.error("Failed to fetch todos:", err);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (text: string) => {
    try {
      setError(null);
      const newTodo = await todoService.addTodo(text);
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while adding todo.");
      }
      console.error("Failed to add todo:", err);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      setError(null);
      const updatedTodo = await todoService.toggleTodo(id);
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while toggling todo.");
      }
      console.error("Failed to toggle todo:", err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while deleting todo.");
      }
      console.error("Failed to delete todo:", err);
    }
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, error, clearError }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the TodoContext
export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};
