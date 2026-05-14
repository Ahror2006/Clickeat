export type AuthUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "client" | "employee" | "admin" | "user";
};

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem("clickeat-token", token);
  localStorage.setItem("clickeat-user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("clickeat-token");
}

export function getAuthUser(): AuthUser | null {
  const user = localStorage.getItem("clickeat-user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("clickeat-token");
  localStorage.removeItem("clickeat-user");
}