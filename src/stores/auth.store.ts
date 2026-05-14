import { create } from "zustand";

export type UserRole = "client" | "employee" | "admin";

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  role: UserRole;
}

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
  updateProfile: (values: Partial<User>) => void;
  setAvatar: (avatar: string) => void;
  setRole: (role: UserRole) => void;
}

const USERS_KEY = "click-eat-users";
const CURRENT_USER_KEY = "click-eat-current-user";

const defaultUser: User = {
  name: "",
  email: "",
  password: "",
  phone: "",
  avatar: "",
  role: "client",
};

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser(): User {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return defaultUser;

    const parsed = JSON.parse(raw);

    return {
      ...defaultUser,
      ...parsed,
      role: parsed.role || "client",
      avatar: parsed.avatar || "",
      phone: parsed.phone || "",
    };
  } catch {
    return defaultUser;
  }
}

function saveCurrentUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function updateUserInList(updatedUser: User) {
  const users = getUsers();

  const exists = users.some((user) => user.email === updatedUser.email);

  const nextUsers = exists
    ? users.map((user) =>
        user.email === updatedUser.email ? { ...user, ...updatedUser } : user
      )
    : [...users, updatedUser];

  saveUsers(nextUsers);
}

const initialUser = getCurrentUser();

export const useAuth = create<AuthState>((set, get) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser.email),

  handleLogin(user) {
    const normalizedUser: User = {
      ...defaultUser,
      ...user,
      email: user.email.trim().toLowerCase(),
      role: user.role || "client",
      avatar: user.avatar || "",
      phone: user.phone || "",
    };

    saveCurrentUser(normalizedUser);
    updateUserInList(normalizedUser);

    set({
      user: normalizedUser,
      isAuthenticated: true,
    });
  },

  handleLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);

    set({
      user: defaultUser,
      isAuthenticated: false,
    });
  },

  updateProfile(values) {
    const currentUser = get().user;

    const updatedUser: User = {
      ...currentUser,
      ...values,
      email: (values.email || currentUser.email).trim().toLowerCase(),
      role: values.role || currentUser.role || "client",
    };

    saveCurrentUser(updatedUser);
    updateUserInList(updatedUser);

    set({
      user: updatedUser,
      isAuthenticated: Boolean(updatedUser.email),
    });
  },

  setAvatar(avatar) {
    const updatedUser: User = {
      ...get().user,
      avatar,
    };

    saveCurrentUser(updatedUser);
    updateUserInList(updatedUser);

    set({
      user: updatedUser,
    });
  },

  setRole(role) {
    const updatedUser: User = {
      ...get().user,
      role,
    };

    saveCurrentUser(updatedUser);
    updateUserInList(updatedUser);

    set({
      user: updatedUser,
    });
  },
}));