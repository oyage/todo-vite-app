import type { Todo } from '../types/todo'; // Todo型をインポート

// モックデータ：初期のTODOリスト
let mockTodos: Todo[] = [
  { id: '1', text: 'React Contextを学ぶ', completed: true },
  { id: '2', text: 'Todoアプリを構築する', completed: false },
  { id: '3', text: 'モックAPIを統合する', completed: false },
];

const SIMULATED_DELAY = 500; // シミュレートされた遅延時間（ミリ秒）

// 全てのTODOを取得する非同期関数
export const getTodos = (): Promise<Todo[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...mockTodos]); // mockTodosのコピーを返す
    }, SIMULATED_DELAY);
  });
};

// 新しいTODOを追加する非同期関数
export const addTodo = (text: string): Promise<Todo> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 新しいTODOオブジェクトを作成
      const newTodo: Todo = {
        id: Date.now().toString(), // IDとして現在時刻の文字列を使用
        text, // 指定されたテキスト
        completed: false, // 初期状態は未完了
      };
      mockTodos = [...mockTodos, newTodo]; // mockTodosリストに新しいTODOを追加
      resolve(newTodo); // 追加された新しいTODOを返す
    }, SIMULATED_DELAY);
  });
};

// 指定されたIDのTODOの完了状態を切り替える非同期関数
export const toggleTodo = (id: string): Promise<Todo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const todoIndex = mockTodos.findIndex(todo => todo.id === id); // 指定されたIDのTODOのインデックスを検索
      if (todoIndex === -1) {
        // TODOが見つからない場合、エラーを返す
        reject(new Error('TODOが見つかりません'));
        return;
      }
      // 見つかったTODOの完了状態を反転させた新しいTODOオブジェクトを作成
      const updatedTodo = {
        ...mockTodos[todoIndex],
        completed: !mockTodos[todoIndex].completed,
      };
      // mockTodosリストを更新：該当するTODOをupdatedTodoで置き換え
      mockTodos = [
        ...mockTodos.slice(0, todoIndex),
        updatedTodo,
        ...mockTodos.slice(todoIndex + 1),
      ];
      resolve(updatedTodo); // 更新されたTODOを返す
    }, SIMULATED_DELAY);
  });
};

// 指定されたIDのTODOを削除する非同期関数
export const deleteTodo = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockTodos.length; // 削除前のmockTodosの長さを記録
      mockTodos = mockTodos.filter(todo => todo.id !== id); // 指定されたID以外のTODOで新しいリストを作成（該当TODOを削除）
      if (mockTodos.length === initialLength) {
        // mockTodosの長さが変わらない場合（該当IDのTODOが存在しなかった場合）、エラーを返す
        reject(new Error('削除対象のTODOが見つかりません'));
        return;
      }
      resolve(); // 処理完了
    }, SIMULATED_DELAY);
  });
};
