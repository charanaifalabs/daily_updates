export type Role = "admin" | "librarian" | "user";

export interface UserDto {
  id: string;
  name: string;
  email?: string;
  role: Role;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}
