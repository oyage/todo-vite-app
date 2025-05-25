import type { Todo } from '../types/todo'; // Import Todo type

let mockTodos: Todo[] = [
  { id: '1', text: 'Learn React Context', completed: true },
  { id: '2', text: 'Build a Todo App', completed: false },
  { id: '3', text: 'Integrate Mock API', completed: false },
];

const SIMULATED_DELAY = 500; // ms

export const getTodos = (): Promise<Todo[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...mockTodos]); // Return a copy
    }, SIMULATED_DELAY);
  });
};

export const addTodo = (text: string): Promise<Todo> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text,
        completed: false,
      };
      mockTodos = [...mockTodos, newTodo];
      resolve(newTodo);
    }, SIMULATED_DELAY);
  });
};

export const toggleTodo = (id: string): Promise<Todo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const todoIndex = mockTodos.findIndex(todo => todo.id === id);
      if (todoIndex === -1) {
        reject(new Error('Todo not found'));
        return;
      }
      const updatedTodo = {
        ...mockTodos[todoIndex],
        completed: !mockTodos[todoIndex].completed,
      };
      mockTodos = [
        ...mockTodos.slice(0, todoIndex),
        updatedTodo,
        ...mockTodos.slice(todoIndex + 1),
      ];
      resolve(updatedTodo);
    }, SIMULATED_DELAY);
  });
};

export const deleteTodo = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockTodos.length;
      mockTodos = mockTodos.filter(todo => todo.id !== id);
      if (mockTodos.length === initialLength) {
        reject(new Error('Todo not found for deletion'));
        return;
      }
      resolve();
    }, SIMULATED_DELAY);
  });
};
