export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | number;
    }
  }
}
