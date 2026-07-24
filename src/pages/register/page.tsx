import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../stores/auth.store";
import { api } from "../../lib/api";
import { saveAuth } from "../../lib/auth";
import { getErrorMessage } from "../../lib/get-error-message";
import AuthBg from "../../assets/auth-bg.webp";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const handleLogin = useAuth((state) => state.handleLogin);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [countryCode, setCountryCode] = useState("UZ +998");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStatus = useMemo(() => {
    if (!form.password) return "empty";
    if (form.password.length < 8) return "short";
    return "ok";
  }, [form.password]);

  const confirmStatus = useMemo(() => {
    if (!form.confirmPassword) return "empty";
    if (form.password !== form.confirmPassword) return "mismatch";
    return "ok";
  }, [form.password, form.confirmPassword]);

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
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phoneOnly = form.phone.trim();
    const phone = `${countryCode} ${phoneOnly}`.trim();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!name) {
      setError("Введите имя");
      nameRef.current?.focus();
      return;
    }

    if (!email) {
      setError("Введите email");
      emailRef.current?.focus();
      return;
    }

    if (!phoneOnly) {
      setError("Введите телефон");
      phoneRef.current?.focus();
      return;
    }

    if (!password) {
      setError("Введите пароль");
      passwordRef.current?.focus();
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      passwordRef.current?.focus();
      return;
    }

    if (!confirmPassword) {
      setError("Подтвердите пароль");
      confirmPasswordRef.current?.focus();
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      confirmPasswordRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      const backendUser = response.data.user;
      const token = response.data.token;

      const beforeAt = email.split("@")[0].toLowerCase();

      let role: "client" | "employee" | "admin" = "client";

      if (beforeAt.endsWith("staf")) {
        role = "employee";
      }

      if (beforeAt.endsWith("admn")) {
        role = "admin";
      }

      const userWithRole = {
        ...backendUser,
        role,
      };

      saveAuth(token, userWithRole);
      handleLogin(userWithRole, token);

      navigate("/");
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Ошибка регистрации"));
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
      <title>Регистрация</title>

      <div
        className="auth-viewport relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${AuthBg})` }}
      >
        <div className="absolute inset-0 bg-[rgba(30,20,10,0.28)] backdrop-blur-[4px]" />

        <div className="absolute inset-y-0 right-0 hidden w-[55%] bg-[radial-gradient(circle_at_center,rgba(255,125,0,0.92)_0%,rgba(255,110,0,0.86)_35%,rgba(255,110,0,0.68)_58%,rgba(255,110,0,0.20)_85%,transparent_100%)] lg:block" />

        <div className="auth-content relative z-10">
          <div className="auth-card auth-card-register">
            <div className="auth-badge">ClickEat Account</div>

            <h1 className="auth-title">Регистрация</h1>

            <p className="auth-text">
              Создай аккаунт и начни заказывать любимую еду быстро и удобно
            </p>

            <form onSubmit={onSubmit} className="auth-form">
              <AuthInput
                ref={nameRef}
                placeholder="Ваше имя"
                value={form.name}
                onChange={handleChange("name")}
                onKeyDown={(event) => focusNext(event, form.name, emailRef)}
                autoComplete="name"
              />

              <AuthInput
                ref={emailRef}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
                onKeyDown={(event) => focusNext(event, form.email, phoneRef)}
                autoComplete="email"
              />

              <div className="auth-phone-grid">
                <select
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value)}
                  className="auth-select"
                >
                  <option>UZ +998</option>
                  <option>KZ +7</option>
                  <option>RU +7</option>
                </select>

                <AuthInput
                  ref={phoneRef}
                  placeholder="90 123 45 67"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  onKeyDown={(event) =>
                    focusNext(event, form.phone, passwordRef)
                  }
                  autoComplete="tel"
                />
              </div>

              <AuthInput
                ref={passwordRef}
                type="password"
                placeholder="Пароль"
                value={form.password}
                onChange={handleChange("password")}
                onKeyDown={(event) =>
                  focusNext(event, form.password, confirmPasswordRef)
                }
                autoComplete="new-password"
              />

              {passwordStatus === "short" && (
                <p className="auth-hint-red">Минимум 8 символов</p>
              )}

              {passwordStatus === "ok" && (
                <p className="auth-hint-green">Пароль подходит</p>
              )}

              <AuthInput
                ref={confirmPasswordRef}
                type="password"
                placeholder="Подтвердите пароль"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                onKeyDown={(event) => focusNext(event, form.confirmPassword)}
                autoComplete="new-password"
              />

              {confirmStatus === "mismatch" && (
                <p className="auth-hint-orange">Пароли не совпадают</p>
              )}

              {confirmStatus === "ok" && (
                <p className="auth-hint-green">Пароли совпадают</p>
              )}

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Создаём..." : "Создать аккаунт"}
              </button>
            </form>

            <p className="auth-bottom">
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>

          <div className="auth-side">
            <div className="auth-side-inner">
              <div className="auth-side-badge">Welcome to ClickEat</div>
              <h2 className="auth-side-title">ClickEat</h2>
              <p className="auth-side-text">
                Быстрый заказ еды, удобный сервис и современный стиль в одном
                месте
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
