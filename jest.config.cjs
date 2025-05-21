module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.app.json',
        esModuleInterop: true,
        verbatimModuleSyntax: false,
        isolatedModules: true, // Add this
      },
    ],
  },
  moduleNameMapper: {
    // Mock CSS imports for Jest
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    // Mock styled-components for tests if they cause issues, or ensure they are transformed
    '^styled-components': '<rootDir>/node_modules/styled-components/dist/styled-components.browser.cjs.js', 
  },
};
