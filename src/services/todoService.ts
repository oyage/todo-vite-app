import { Todo } from '../types/todo'; // Todo型をインポート

// モックデータとしてのTODOリストの初期状態
let mockTodos: Todo[] = [
  { id: '1', text: 'React Contextを学ぶ', completed: true }, // 日本語テキストに変更
  { id: '2', text: 'Todoアプリを構築する', completed: false }, // 日本語テキストに変更
  { id: '3', text: 'モックAPIを統合する', completed: false }, // 日本語テキストに変更
];

const SIMULATED_DELAY = 500; // API呼び出しをシミュレートするための遅延時間（ミリ秒）

/**
 * すべてのTODOアイテムを取得します。
 * @returns {Promise<Todo[]>} TODOアイテムの配列を解決するPromise。
 */
export const getTodos = (): Promise<Todo[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...mockTodos]); // 配列のコピーを返すことで、元の配列の変更を防ぐ
    }, SIMULATED_DELAY);
  });
};

/**
 * 新しいTODOアイテムを追加します。
 * @param {string} text - 新しいTODOアイテムのテキスト。
 * @returns {Promise<Todo>} 追加された新しいTODOアイテムを解決するPromise。
 */
export const addTodo = (text: string): Promise<Todo> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newTodo: Todo = {
        id: Date.now().toString(), // 現在時刻を文字列化して簡易的なIDを生成
        text,
        completed: false,
      };
      mockTodos = [...mockTodos, newTodo]; // モックTODOリストに新しいTODOを追加
      resolve(newTodo);
    }, SIMULATED_DELAY);
  });
};

/**
 * 指定されたIDのTODOアイテムの完了状態を切り替えます。
 * @param {string} id - 切り替えるTODOアイテムのID。
 * @returns {Promise<Todo>} 更新されたTODOアイテムを解決するPromise。
 * @throws {Error} 指定されたIDのTODOが見つからない場合にエラーを投げる。
 */
export const toggleTodo = (id: string): Promise<Todo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const todoIndex = mockTodos.findIndex(todo => todo.id === id); // IDでTODOを検索
      if (todoIndex === -1) {
        // TODOが見つからない場合、エラーをreject
        reject(new Error('Todo not found')); // 日本語エラーメッセージも検討可: '該当のTODOが見つかりません'
        return;
      }
      // 見つかったTODOの完了状態を更新
      const updatedTodo = {
        ...mockTodos[todoIndex],
        completed: !mockTodos[todoIndex].completed,
      };
      // モックTODOリストを更新
      mockTodos = [
        ...mockTodos.slice(0, todoIndex),
        updatedTodo,
        ...mockTodos.slice(todoIndex + 1),
      ];
      resolve(updatedTodo);
    }, SIMULATED_DELAY);
  });
};

/**
 * 指定されたIDのTODOアイテムを削除します。
 * @param {string} id - 削除するTODOアイテムのID。
 * @returns {Promise<void>} 削除が成功したことを示すPromise。
 * @throws {Error} 指定されたIDのTODOが見つからない場合にエラーを投げる。
 */
export const deleteTodo = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockTodos.length;
      mockTodos = mockTodos.filter(todo => todo.id !== id); // IDでTODOをフィルタリング（削除）
      if (mockTodos.length === initialLength) {
        // 配列長が変わらない場合、該当IDのTODOは存在しなかったと判断
        reject(new Error('Todo not found for deletion')); // 日本語エラーメッセージも検討可: '削除対象のTODOが見つかりません'
        return;
      }
      resolve(); // 成功
    }, SIMULATED_DELAY);
  });
};
