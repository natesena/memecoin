export interface TokenProcessState {
  name: string;
  contract: string;
  loading: boolean;
  completed: boolean;
  error: string | null;
}
