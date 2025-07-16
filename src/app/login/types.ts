export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginResult = {
  success: boolean;
  message: string;
  role?: "admin" | "user";
};

export type LoginService = {
  login: (email: string, password: string) => Promise<LoginResult>;
};
