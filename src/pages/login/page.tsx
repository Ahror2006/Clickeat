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

      const normalizedEmail = backendUser.email.toLowerCase();

      if (normalizedEmail.includes("admin")) {
        backendUser.role = "admin";
      } else if (
        normalizedEmail.includes("staf") ||
        normalizedEmail.includes("staff")
      ) {
        backendUser.role = "employee";
      }

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
    <div className="auth-page">
      <Helmet>
        <title>Вход</title>
      </Helmet>

      <div
        className="auth-viewport relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${AuthBg})` }}
      >
        <div className="absolute inset-0 bg-[rgba(30,20,10,0.28)] backdrop-blur-[4px]" />

        <div className="absolute inset-y-0 right-0 hidden w-[55%] bg-[radial-gradient(circle_at_center,rgba(255,125,0,0.92)_0%,rgba(255,110,0,0.86)_35%,rgba(255,110,0,0.68)_58%,rgba(255,110,0,0.20)_85%,transparent_100%)] lg:block" />

        <div className="auth-content relative z-10">
          <div className="auth-card">
            <div className="auth-badge">Welcome Back</div>

            <h1 className="auth-title">Вход</h1>

            <p className="auth-text">
              Войди в аккаунт и продолжай заказывать еду 🍕
            </p>

            <form onSubmit={onSubmit} className="auth-form">
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

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Входим..." : "Войти"}
              </button>
            </form>

            <p className="auth-bottom">
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
          </div>

          <div className="auth-side">
            <div className="auth-side-inner">
              <div className="auth-side-badge">ClickEat</div>
              <h2 className="auth-side-title">Welcome Back</h2>
              <p className="auth-side-text">
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

const AuthInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function AuthInput({ className = "", ...props }, ref) {
  return <input ref={ref} {...props} className={`auth-input ${className}`} />;
});