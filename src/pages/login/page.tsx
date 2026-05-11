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

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = useAuth((state) => state.handleLogin);

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Заполни email и пароль");
      return;
    }

    const users = getUsers();

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      setError("Неверный email или пароль");
      return;
    }

    handleLogin(foundUser);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      <Helmet>
        <title>Вход</title>
      </Helmet>

      <div
        className="relative min-h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${AuthBg})` }}
      >
        <div className="absolute inset-0 bg-[rgba(30,20,10,0.28)] backdrop-blur-[4px]" />
        <div className="absolute inset-y-0 right-0 w-[55%] bg-[radial-gradient(circle_at_center,rgba(255,125,0,0.92)_0%,rgba(255,110,0,0.86)_35%,rgba(255,110,0,0.68)_58%,rgba(255,110,0,0.20)_85%,transparent_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] items-center justify-between gap-8 px-8 py-10">
          <div className="w-full max-w-[500px] rounded-[34px] bg-[#f5e4da] p-10 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="inline-flex rounded-full bg-[#ffe8d7] px-4 py-2 text-[14px] font-semibold text-[#ff6b00]">
              Welcome Back
            </div>

            <h1 className="mt-8 text-[62px] font-extrabold leading-none text-[#2f3542]">
              Вход
            </h1>

            <p className="mt-5 text-[18px] leading-8 text-[#71809a]">
              Войди в аккаунт и продолжай заказывать еду 🍕
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
                autoComplete="email"
              />

              <Input
                type="password"
                placeholder="Пароль"
                value={form.password}
                onChange={handleChange("password")}
                autoComplete="current-password"
              />

              {error ? (
                <div className="rounded-[18px] border border-[#ffd7d2] bg-[#fff3f1] px-4 py-3 text-[14px] font-medium text-[#d14d4d]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-[20px] bg-[#ff6b00] px-5 py-4 text-[18px] font-bold text-white shadow-[0_16px_30px_rgba(255,107,0,0.24)] transition hover:translate-y-[-1px] hover:bg-[#ff5b00]"
              >
                Войти
              </button>
            </form>

            <p className="mt-8 text-center text-[17px] text-[#7b8698]">
              Нет аккаунта?{" "}
              <Link to="/register" className="font-bold text-[#ff6b00]">
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="max-w-[560px] text-center text-white">
              <div className="inline-flex rounded-full bg-white/18 px-5 py-3 text-[16px] font-semibold backdrop-blur-sm">
                ClickEat
              </div>

              <h2 className="mt-10 text-[76px] font-extrabold leading-none">
                Welcome Back
              </h2>

              <p className="mt-8 text-[24px] leading-10 text-white/92">
                Быстрый доступ к заказам, любимым блюдам и персональным предложениям
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
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="auth-input w-full rounded-[18px] border border-transparent bg-[#dfe8f6] px-5 py-4 text-[17px] text-[#2f3542] outline-none transition focus:border-[#ffb37a] focus:bg-white"
    />
  );
}