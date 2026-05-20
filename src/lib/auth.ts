export type AuthUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "client" | "employee" | "admin" | "user";
};

const TOKEN_KEYS = ["clickeat-token", "click-eat-token"];
const USER_KEYS = ["clickeat-user", "click-eat-current-user"];

export function saveAuth(token: string, user: AuthUser) {
  TOKEN_KEYS.forEach((key) => localStorage.setItem(key, token));
  USER_KEYS.forEach((key) => localStorage.setItem(key, JSON.stringify(user)));
}

export function getToken() {
  return (
    localStorage.getItem("clickeat-token") ||
    localStorage.getItem("click-eat-token") ||
    ""
  );
}

export function getAuthUser(): AuthUser | null {
  const user =
    localStorage.getItem("clickeat-user") ||
    localStorage.getItem("click-eat-current-user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout() {
  TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  USER_KEYS.forEach((key) => localStorage.removeItem(key));
}