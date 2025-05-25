import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import * as todoService from '../services/todoService'; // todoServiceをインポート
import { Todo } from '../types/todo'; // Todo型をインポート

/**
 * Todoコンテキストの状態とアクションの型定義。
 * @property todos - TODOアイテムの配列。
 * @property addTodo - 新しいTODOを追加する非同期関数。
 * @property toggleTodo - 指定されたIDのTODOの完了状態を切り替える非同期関数。
 * @property deleteTodo - 指定されたIDのTODOを削除する非同期関数。
 * @property error - 現在のエラーメッセージ（文字列）、またはエラーがない場合はnull。
 * @property clearError - 現在のエラーをクリアする関数。
 */
export interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// TodoContextを作成。初期値はundefined。
// カスタムフック`useTodos`内で、プロバイダーが使用されていることを確認するためにundefinedチェックを行います。
export const TodoContext = createContext<TodoContextType | undefined>(undefined);

/**
 * TodoProviderコンポーネントのPropsの型定義。
 * @property children - TodoProviderによってラップされる子コンポーネント。
 */
interface TodoProviderProps {
  children: ReactNode; // Reactノードを受け入れるためのchildrenプロパティ
}

/**
 * TodoProviderコンポーネント。
 * TODOアイテムの状態管理（todos配列とエラー状態）および関連するアクションを提供します。
 * @param {TodoProviderProps} props - コンポーネントのプロパティ。
 */
export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]); // TODOリストの状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージの状態

  /**
   * エラーメッセージをクリア（nullに設定）します。
   */
  const clearError = () => {
    setError(null);
  };

  // コンポーネントのマウント時に初期TODOリストを取得する副作用フック
  useEffect(() => {
    /**
     * 非同期でTODOリストを取得し、状態を更新します。
     * エラーが発生した場合はエラー状態を設定します。
     */
    const fetchTodos = async () => {
      try {
        setError(null); // 操作開始前にエラーをクリア
        const initialTodos = await todoService.getTodos(); // サービスからTODOを取得
        setTodos(initialTodos); // 取得したTODOで状態を更新
      } catch (err) {
        // エラー処理
        if (err instanceof Error) {
          setError(err.message); // エラーオブジェクトのメッセージを設定
        } else {
          setError("TODOリストの取得中に不明なエラーが発生しました。"); // 不明なエラーの場合の汎用メッセージ
        }
        console.error("Failed to fetch todos:", err); // コンソールにもエラーを出力
      }
    };
    fetchTodos();
  }, []); // 空の依存配列により、マウント時にのみ実行

  /**
   * 新しいTODOアイテムを非同期で追加します。
   * @param {string} text - 追加するTODOアイテムのテキスト。
   */
  const addTodo = async (text: string) => {
    try {
      setError(null); // 操作開始前にエラーをクリア
      const newTodo = await todoService.addTodo(text); // サービス経由でTODOを追加
      setTodos(prevTodos => [...prevTodos, newTodo]); // TODOリストの状態を更新
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("TODOの追加中に不明なエラーが発生しました。");
      }
      console.error("Failed to add todo:", err);
    }
  };

  /**
   * 指定されたIDのTODOアイテムの完了状態を非同期で切り替えます。
   * @param {string} id - 切り替えるTODOアイテムのID。
   */
  const toggleTodo = async (id: string) => {
    try {
      setError(null); // 操作開始前にエラーをクリア
      const updatedTodo = await todoService.toggleTodo(id); // サービス経由でTODOの状態を切り替え
      // TODOリストの状態を更新（該当TODOを更新されたものに置き換え）
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("TODOの状態切り替え中に不明なエラーが発生しました。");
      }
      console.error("Failed to toggle todo:", err);
    }
  };

  /**
   * 指定されたIDのTODOアイテムを非同期で削除します。
   * @param {string} id - 削除するTODOアイテムのID。
   */
  const deleteTodo = async (id: string) => {
    try {
      setError(null); // 操作開始前にエラーをクリア
      await todoService.deleteTodo(id); // サービス経由でTODOを削除
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // TODOリストの状態を更新（該当TODOを削除）
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("TODOの削除中に不明なエラーが発生しました。");
      }
      console.error("Failed to delete todo:", err);
    }
  };

  // TodoContext.Providerを使用して、状態とアクションを子コンポーネントに提供
  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, error, clearError }}>
      {children}
    </TodoContext.Provider>
  );
};

/**
 * TodoContextを使用するためのカスタムフック。
 * このフックはTodoProvider内で使用される必要があり、そうでない場合はエラーをスローします。
 * @returns {TodoContextType} Todoコンテキストの値（状態とアクション）。
 * @throws {Error} TodoProviderの外部で使用された場合にエラーを投げる。
 */
export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext); // ReactのuseContextフックを使用してコンテキストを取得
  if (context === undefined) {
    // コンテキストがundefinedの場合（Providerの外部で使用された場合）エラーをスロー
    throw new Error('useTodos must be used within a TodoProvider'); // 日本語エラーメッセージも検討可: 'useTodosはTodoProvider内で使用する必要があります'
  }
  return context; // コンテキストの値を返す
};
