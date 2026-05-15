import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { useAuth } from "../../stores/auth.store";
import { api } from "../../lib/api";
import { saveAuth } from "../../lib/auth";
import AuthBg from "../../assets/auth-bg.png";

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = useAuth((state) => state.handleLogin);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const focusNext = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentValue: string,
    next?: React.RefObject<HTMLInputElement | null>
  ) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    if (!currentValue.trim()) {
      setError("Сначала заполни это поле");
      return;
    }

    setError("");

    if (next?.current) {
      next.current.focus();
      return;
    }

    void handleSubmit();
  };

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email) {
      setError("Введите email");
      emailRef.current?.focus();
      return;
    }

    if (!password) {
      setError("Введите пароль");
      passwordRef.current?.focus();
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const backendUser = response.data.user;
      const token = response.data.token;

      saveAuth(token, backendUser);
      handleLogin(backendUser, token);

      if (backendUser.role === "admin") {
        navigate("/admin");
      } else if (backendUser.role === "employee") {
        navigate("/employee");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setError(message || "Неверный email или пароль");
    } finally {
      setLoading(false);
    }
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
        <div className="absolute inset-y-0 right-0 hidden w-[55%] bg-[radial-gradient(circle_at_center,rgba(255,125,0,0.92)_0%,rgba(255,110,0,0.86)_35%,rgba(255,110,0,0.68)_58%,rgba(255,110,0,0.20)_85%,transparent_100%)] lg:block" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] items-center justify-center gap-8 px-4 py-6 sm:px-8 lg:justify-between lg:py-10">
          <div className="w-full max-w-[500px] rounded-[28px] bg-[#f5e4da]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:rounded-[34px] sm:p-10">
            <div className="inline-flex rounded-full bg-[#ffe8d7] px-4 py-2 text-[14px] font-semibold text-[#ff6b00]">
              Welcome Back
            </div>

            <h1 className="mt-7 text-[46px] font-extrabold leading-none text-[#2f3542] sm:text-[62px]">
              Вход
            </h1>

            <p className="mt-5 text-[17px] leading-8 text-[#71809a] sm:text-[18px]">
              Войди в аккаунт и продолжай заказывать еду 🍕
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit();
              }}
              className="mt-8 space-y-4"
            >
              <Input
                ref={emailRef}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
                onKeyDown={(event) =>
                  focusNext(event, form.email, passwordRef)
                }
                autoComplete="email"
              />

              <Input
                ref={passwordRef}
                type="password"
                placeholder="Пароль"
                value={form.password}
                onChange={handleChange("password")}
                onKeyDown={(event) => focusNext(event, form.password)}
                autoComplete="current-password"
              />

              {error ? (
                <div className="rounded-[18px] border border-[#ffd7d2] bg-[#fff3f1] px-4 py-3 text-[14px] font-medium text-[#d14d4d]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[20px] bg-[#ff6b00] px-5 py-4 text-[18px] font-bold text-white shadow-[0_16px_30px_rgba(255,107,0,0.24)] transition hover:translate-y-[-1px] hover:bg-[#ff5b00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Входим..." : "Войти"}
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
                Быстрый доступ к заказам, любимым блюдам и персональным
                предложениям
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
  type = "text",
  autoComplete,
  ref,
}: React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="auth-input w-full rounded-[18px] border border-transparent bg-[#dfe8f6] px-5 py-4 text-[17px] text-[#2f3542] outline-none transition focus:border-[#ffb37a] focus:bg-white"
    />
  );
};