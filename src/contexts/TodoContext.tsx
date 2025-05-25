import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as todoService from '../services/todoService'; // todoServiceをインポート
import type { Todo } from '../types/todo'; // Todo型をインポート

// Contextのstateとactionの型定義
export interface TodoContextType {
  todos: Todo[]; // TODOリスト
  addTodo: (text: string) => Promise<void>; // TODOを追加する関数
  toggleTodo: (id: string) => Promise<void>; // TODOの完了状態を切り替える関数
  deleteTodo: (id: string) => Promise<void>; // TODOを削除する関数
  error: string | null; // エラーメッセージ
  clearError: () => void; // エラーをクリアする関数
}

// Contextを作成（デフォルト値はundefined）
export const TodoContext = createContext<TodoContextType | undefined>(undefined);

// TodoProviderのpropsの型定義
interface TodoProviderProps {
  children: ReactNode; // 子コンポーネント
}

// TodoProviderコンポーネント：TODO関連のstateとロジックを提供
export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]); // TODOリストのstate
  const [error, setError] = useState<string | null>(null); // エラーメッセージのstate

  // エラーをクリアする関数
  const clearError = () => {
    setError(null);
  };

  // 初期TODOリストを取得
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setError(null); // エラーをリセット
        const initialTodos = await todoService.getTodos(); // todoServiceからTODOリストを取得
        setTodos(initialTodos); // stateを更新
      } catch (err) {
        // エラーハンドリング
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("TODOリストの取得中に不明なエラーが発生しました。");
        }
        console.error("TODOリストの取得に失敗しました:", err);
      }
    };
    fetchTodos();
  }, []); // 空の依存配列でマウント時に一度だけ実行

  // TODOを追加する非同期関数
  const addTodo = async (text: string) => {
    try {
      setError(null); // エラーをリセット
      const newTodo = await todoService.addTodo(text); // todoService経由でTODOを追加
      setTodos(prevTodos => [...prevTodos, newTodo]); // stateを更新
    } catch (err) {
      // エラーハンドリング
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("TODOの追加中に不明なエラーが発生しました。");
      }
      console.error("TODOの追加に失敗しました:", err);
    }
  };

  // TODOの完了状態を切り替える非同期関数
  const toggleTodo = async (id: string) => {
    try {
      setError(null); // エラーをリセット
      const updatedTodo = await todoService.toggleTodo(id); // todoService経由でTODOの状態を更新
      // stateを更新：該当するTODOをupdatedTodoで置き換え
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      // エラーハンドリング
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("TODOの切り替え中に不明なエラーが発生しました。");
      }
      console.error("TODOの切り替えに失敗しました:", err);
    }
  };

  // TODOを削除する非同期関数
  const deleteTodo = async (id: string) => {
    try {
      setError(null); // エラーをリセット
      await todoService.deleteTodo(id); // todoService経由でTODOを削除
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // stateを更新：該当するTODOを削除
    } catch (err) {
      // エラーハンドリング
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("TODOの削除中に不明なエラーが発生しました。");
      }
      console.error("TODOの削除に失敗しました:", err);
    }
  };

  // TodoContext.Providerでラップし、valueとしてstateとactionを渡す
  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, error, clearError }}>
      {children}
    </TodoContext.Provider>
  );
};

// TodoContextを使用するためのカスタムフック
export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext); // useContextでContextの値を取得
  // Contextがundefinedの場合（TodoProviderの外部で使用された場合）エラーをスロー
  if (context === undefined) {
    throw new Error('useTodosはTodoProviderの内部で使用する必要があります');
  }
  return context;
};
