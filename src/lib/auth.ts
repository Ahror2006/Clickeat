export type AuthUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "client" | "employee" | "admin";
};

const TOKEN_KEY = "click-eat-token";
const USER_KEY = "click-eat-current-user";

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const user = localStorage.getItem(USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}