export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  token: string;
  avatar: Uint8Array;
}
