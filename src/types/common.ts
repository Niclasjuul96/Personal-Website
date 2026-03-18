// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export type HTMLElementEvent<T extends HTMLElement> = 
  Event & { currentTarget: T };
