import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
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
    event: KeyboardEvent<HTMLInputElement>,
    value: string,
    next?: React.RefObject<HTMLInputElement | null>
  ) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    if (!value.trim()) {
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
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      setError("");
    };

  const handleSubmit = async () => {
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
      setError("");

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
        return;
      }

      if (backendUser.role === "employee") {
        navigate("/employee");
        return;
      }

      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit();
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

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] items-center justify-center px-3 py-4 sm:px-6 sm:py-6 lg:justify-between lg:px-8 lg:py-10">
          <div className="w-full max-w-[500px] rounded-[26px] bg-[#f5e4da]/95 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:p-8 lg:p-10">
            <div className="inline-flex rounded-full bg-[#ffe8d7] px-4 py-2 text-[13px] font-semibold text-[#ff6b00] sm:text-[14px]">
              Welcome Back
            </div>

            <h1 className="mt-5 text-[40px] font-extrabold leading-none text-[#2f3542] sm:text-[54px] lg:text-[62px]">
              Вход
            </h1>

            <p className="mt-4 text-[15px] leading-7 text-[#71809a] sm:text-[17px] sm:leading-8">
              Войди в аккаунт и продолжай заказывать еду 🍕
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              <AuthInput
                ref={emailRef}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
                onKeyDown={(event) => focusNext(event, form.email, passwordRef)}
                autoComplete="email"
              />

              <AuthInput
                ref={passwordRef}
                type="password"
                placeholder="Пароль"
                value={form.password}
                onChange={handleChange("password")}
                onKeyDown={(event) => focusNext(event, form.password)}
                autoComplete="current-password"
              />

              {error && (
                <div className="rounded-[16px] border border-[#ffd7d2] bg-[#fff3f1] px-4 py-3 text-[13px] font-semibold text-[#d14d4d] sm:text-[14px]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[18px] bg-[#ff6b00] px-5 py-3 text-[17px] font-bold text-white shadow-[0_16px_30px_rgba(255,107,0,0.24)] transition hover:translate-y-[-1px] hover:bg-[#ff5b00] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-[18px]"
              >
                {loading ? "Входим..." : "Войти"}
              </button>
            </form>

            <p className="mt-6 text-center text-[15px] text-[#7b8698] sm:mt-8 sm:text-[17px]">
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

const AuthInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function AuthInput({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full rounded-[16px] border border-transparent bg-[#f3f1ef] px-4 py-3 text-[15px] text-[#4d5868] outline-none transition focus:border-[#ff8b39] focus:bg-white sm:px-5 sm:py-4 sm:text-[16px] ${className}`}
      />
    );
  }
);