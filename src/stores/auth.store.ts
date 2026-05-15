import { create } from "zustand";

export type UserRole = "client" | "employee" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  isBlocked?: boolean;
  createdAt?: string;
}

interface AuthState {
  user: User;
  token: string;
  isAuthenticated: boolean;

  handleLogin: (user: Partial<User>, token?: string) => void;
  handleLogout: () => void;
  updateProfile: (values: Partial<User>) => void;
  setAvatar: (avatar: string) => void;
  setRole: (role: UserRole) => void;
}

const CURRENT_USER_KEY = "click-eat-current-user";
const TOKEN_KEY = "click-eat-token";

const defaultUser: User = {
  id: "",
  name: "",
  email: "",
  phone: "",
  avatar: "",
  role: "client",
};

function normalizeUser(user: Partial<User>): User {
  return {
    ...defaultUser,
    ...user,
    id: user.id || "",
    name: user.name || "",
    email: user.email ? user.email.trim().toLowerCase() : "",
    phone: user.phone || "",
    avatar: user.avatar || "",
    role: user.role || "client",
  };
}

function getCurrentUser(): User {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return defaultUser;

    const parsed = JSON.parse(raw);
    return normalizeUser(parsed);
  } catch {
    return defaultUser;
  }
}

function getCurrentToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function saveCurrentUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeAuthData() {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

const initialUser = getCurrentUser();
const initialToken = getCurrentToken();

export const useAuth = create<AuthState>((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialUser.email && initialToken),

  handleLogin(user, token) {
    const normalizedUser = normalizeUser(user);

    saveCurrentUser(normalizedUser);

    if (token) {
      saveToken(token);
    }

    set({
      user: normalizedUser,
      token: token || get().token,
      isAuthenticated: Boolean(normalizedUser.email && (token || get().token)),
    });
  },

  handleLogout() {
    removeAuthData();

    set({
      user: defaultUser,
      token: "",
      isAuthenticated: false,
    });
  },

  updateProfile(values) {
    const currentUser = get().user;

    const updatedUser = normalizeUser({
      ...currentUser,
      ...values,
      role: values.role || currentUser.role,
    });

    saveCurrentUser(updatedUser);

    set({
      user: updatedUser,
      isAuthenticated: Boolean(updatedUser.email && get().token),
    });
  },

  setAvatar(avatar) {
    const updatedUser = normalizeUser({
      ...get().user,
      avatar,
    });

    saveCurrentUser(updatedUser);

    set({
      user: updatedUser,
    });
  },

  setRole(role) {
    const updatedUser = normalizeUser({
      ...get().user,
      role,
    });

    saveCurrentUser(updatedUser);

    set({
      user: updatedUser,
    });
  },
}));

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function clearAuth() {
  removeAuthData();
}