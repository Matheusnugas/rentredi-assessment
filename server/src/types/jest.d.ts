/// <reference types="jest" />

declare global {
  const describe: jest.Describe;
  const it: jest.It;
  const expect: jest.Expect;
  const beforeEach: jest.Lifecycle;
  const beforeAll: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const test: jest.It;
  
  namespace jest {
    function mock(moduleName: string): void;
    function clearAllMocks(): void;
    function fn<T extends (...args: any[]) => any>(implementation?: T): jest.MockedFunction<T>;
    type Mocked<T> = {
      [P in keyof T]: T[P] extends (...args: any[]) => any
        ? jest.MockedFunction<T[P]>
        : T[P];
    };
  }
}

export {}; 