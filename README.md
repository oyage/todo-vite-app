# Enterprise TODO Application

This project is an enhanced TODO application built to demonstrate a more structured and robust approach to developing React applications. It started from a simple Vite + TypeScript template and has been progressively refactored to include advanced state management, component-based architecture, styling solutions, error handling, and unit testing.

## Technologies Used

*   **React**: For building the user interface.
*   **TypeScript**: For static typing and improved developer experience.
*   **Vite**: As the build tool and development server, providing a fast development experience.
*   **Styled-Components**: For component-level styling, allowing for co-located styles and dynamic styling based on props.
*   **Jest**: As the testing framework for running unit tests.
*   **React Testing Library**: For testing React components in a way that resembles how users interact with them.

## Project Structure

The project follows a standard React application structure, with key directories organized as follows:

*   `src/`: Contains all the source code for the application.
    *   `components/`: Houses reusable UI components (e.g., `AddTodoForm.tsx`, `TodoItem.tsx`, `TodoList.tsx`).
    *   `contexts/`: Contains React Context definitions and providers (e.g., `TodoContext.tsx` for global state management of todos).
    *   `services/`: Includes mock API service implementations (e.g., `todoService.ts` to simulate backend interactions).
    *   `types/`: Defines shared TypeScript interfaces and types (e.g., `todo.ts` for the `Todo` type).
    *   `App.tsx`: The main application component that orchestrates the UI.
    *   `main.tsx`: The entry point of the application, where the React app is initialized and mounted to the DOM.
*   `__mocks__/`: Contains mock files for Jest, like `styleMock.js` for CSS/style imports.
*   `jest.config.cjs`: Configuration file for Jest.
*   `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.json`: TypeScript configuration files.
*   `vite.config.ts`: Vite configuration file.

## Key Features & Concepts Implemented

*   **State Management with React Context & Service Layer**:
    *   The application state, particularly the list of todos, is managed globally using React Context (`TodoContext.tsx`).
    *   A mock service layer (`src/services/todoService.ts`) simulates asynchronous API calls for fetching, adding, toggling, and deleting todos. This promotes separation of concerns and makes it easier to integrate with a real backend in the future.
    *   The `TodoProvider` component encapsulates the state logic and interactions with the service layer.

*   **Component-Based Architecture**:
    *   The UI is broken down into smaller, manageable components found in `src/components/`, promoting reusability and maintainability.

*   **Styling with Styled-Components**:
    *   `styled-components` is used for all styling, allowing for CSS-in-JS with component-scoped styles.
    *   Transient props (props prefixed with `$`) are used to pass styling-specific data to styled components without them being passed to the underlying DOM elements, avoiding React warnings (e.g., `$completed` prop in `TodoItem.tsx`).

*   **Error Handling**:
    *   The application includes basic error handling. Errors originating from the mock service layer (e.g., trying to toggle or delete a non-existent todo) are caught by the `TodoProvider`.
    *   These errors are then exposed to the UI via the context and displayed to the user in `App.tsx`, with an option to dismiss the error message.

*   **Unit Testing**:
    *   Unit tests are implemented using Jest and React Testing Library.
    *   Configuration for Jest is set up in `jest.config.cjs`, including mocks for styles and integration with `ts-jest` for TypeScript support.
    *   An example test suite for the `TodoItem` component (`src/components/TodoItem.test.tsx`) demonstrates testing component rendering, interactions, and conditional styling.

## Setup and Running the Application

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically available at `http://localhost:5173`.

## Available Scripts

The following scripts are available in `package.json`:

*   `npm run dev`: Starts the development server using Vite.
*   `npm run build`: Builds the application for production using `tsc` and Vite.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run test`: Runs the unit tests using Jest.
*   `npm run preview`: Serves the production build locally to preview it.

## Running Tests

To run the unit tests:

```bash
npm test
```
This command executes Jest and runs all test files matching the configuration in `jest.config.cjs`.
