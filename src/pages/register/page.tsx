import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { useAuth, type User } from "../../stores/auth.store";
import AuthBg from "../../assets/auth-bg.png";

const USERS_KEY = "click-eat-users";

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const handleLogin = useAuth((state) => state.handleLogin);

  const [countryCode, setCountryCode] = useState("UZ +998");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = `${countryCode} ${form.phone.trim()}`.trim();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!name || !email || !password || !confirmPassword) {
      setError("Заполни все обязательные поля");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    const users = getUsers();

    const alreadyExists = users.some(
      (user) => user.email === email
    );

    if (alreadyExists) {
      setError("Пользователь с таким email уже существует");
      return;
    }

    const newUser: User = {
      name,
      email,
      phone,
      password,
      avatar: "",
      role: "client",
    };

    saveUsers([...users, newUser]);

    handleLogin(newUser);

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      <Helmet>
        <title>Регистрация</title>
      </Helmet>

      <div
        className="relative min-h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${AuthBg})` }}
      >
        <div className="absolute inset-0 bg-[rgba(30,20,10,0.28)] backdrop-blur-[4px]" />

        <div className="absolute inset-y-0 right-0 w-[55%] bg-[radial-gradient(circle_at_center,rgba(255,125,0,0.92)_0%,rgba(255,110,0,0.86)_35%,rgba(255,110,0,0.68)_58%,rgba(255,110,0,0.20)_85%,transparent_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] items-center justify-between gap-8 px-8 py-10">
          <div className="w-full max-w-[540px] rounded-[34px] bg-[#f5e4da] p-10 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="inline-flex rounded-full bg-[#ffe8d7] px-4 py-2 text-[14px] font-semibold text-[#ff6b00]">
              ClickEat Account
            </div>

            <h1 className="mt-8 text-[56px] font-extrabold leading-none text-[#2f3542]">
              Регистрация
            </h1>

            <p className="mt-5 text-[18px] leading-8 text-[#71809a]">
              Создай аккаунт и начни заказывать любимую еду быстро и удобно
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                placeholder="Ваше имя"
                value={form.name}
                onChange={handleChange("name")}
                autoComplete="name"
              />

              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
                autoComplete="email"
              />

              <div className="grid grid-cols-[130px_1fr] gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-[18px] border border-transparent bg-[#f3f1ef] px-4 py-4 text-[16px] text-[#4d5868] outline-none"
                >
                  <option>UZ +998</option>
                  <option>KZ +7</option>
                  <option>RU +7</option>
                </select>

                <Input
                  placeholder="90 123 45 67"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  autoComplete="tel"
                />
              </div>

              <Input
                type="password"
                placeholder="Пароль"
                value={form.password}
                onChange={handleChange("password")}
                autoComplete="new-password"
              />

              <p className="text-[14px] font-semibold text-[#3ab45b]">
                Минимум 8 символов
              </p>

              <Input
                type="password"
                placeholder="Подтвердите пароль"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                autoComplete="new-password"
              />

              {error ? (
                <div className="rounded-[18px] border border-[#ffd7d2] bg-[#fff3f1] px-4 py-3 text-[14px] font-medium text-[#d14d4d]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-[20px] bg-[#ff8b39] px-5 py-4 text-[18px] font-bold text-white shadow-[0_16px_30px_rgba(255,107,0,0.18)] transition hover:translate-y-[-1px] hover:bg-[#ff7a1f]"
              >
                Создать аккаунт
              </button>
            </form>

            <p className="mt-8 text-center text-[17px] text-[#7b8698]">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="font-bold text-[#ff6b00]">
                Войти
              </Link>
            </p>
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="max-w-[560px] text-center text-white">
              <div className="inline-flex rounded-full bg-white/18 px-5 py-3 text-[16px] font-semibold backdrop-blur-sm">
                Welcome to ClickEat
              </div>

              <h2 className="mt-10 text-[76px] font-extrabold leading-none">
                ClickEat
              </h2>

              <p className="mt-8 text-[24px] leading-10 text-white/92">
                Быстрый заказ еды, удобный сервис и современный стиль в одном месте
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="w-full rounded-[18px] border border-transparent bg-[#f3f1ef] px-5 py-4 text-[16px] text-[#4d5868] outline-none transition focus:border-[#ff8b39] focus:bg-white"
    />
  );
}