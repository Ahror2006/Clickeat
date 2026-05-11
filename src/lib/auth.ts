export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "user" | "admin";
};

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem("clickeat-token", token);
  localStorage.setItem("clickeat-user", JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  const user = localStorage.getItem("clickeat-user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("clickeat-token");
  localStorage.removeItem("clickeat-user");
}