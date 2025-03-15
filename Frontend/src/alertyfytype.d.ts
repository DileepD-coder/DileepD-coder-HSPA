declare module 'alertifyjs' {
    export function success(message: string): void;
    export function error(message: string): void;
    export function warning(message: string): void;
    export function message(message: string): void;
    export function delay(value: number): void;  // If you're using delay
    export function log(message: string): void; // If you're using log
  }
  