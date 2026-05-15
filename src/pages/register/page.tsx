import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { useAuth } from "../../stores/auth.store";
import { api } from "../../lib/api";
import { saveAuth } from "../../lib/auth";
import AuthBg from "../../assets/auth-bg.png";

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

  const passwordTouched = form.password.length > 0;
  const confirmTouched = form.confirmPassword.length > 0;

  const passwordStatus = useMemo(() => {
    if (!passwordTouched) return null;
    if (form.password.length < 8) return "short";
    return "ok";
  }, [form.password, passwordTouched]);

  const confirmStatus = useMemo(() => {
    if (!confirmTouched) return null;
    if (form.confirmPassword !== form.password) return "mismatch";
    return "ok";
  }, [form.confirmPassword, form.password, confirmTouched]);

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

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = `${countryCode} ${form.phone.trim()}`.trim();
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

    if (!form.phone.trim()) {
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

      const response = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      const backendUser = response.data.user;
      const token = response.data.token;

      saveAuth(token, backendUser);
      handleLogin(backendUser, token);

      navigate("/");
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setError(message || "Ошибка регистрации. Попробуй снова");
    } finally {
      setLoading(false);
    }
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
        <div className="absolute inset-y-0 right-0 hidden w-[55%] bg-[radial-gradient(circle_at_center,rgba(255,125,0,0.92)_0%,rgba(255,110,0,0.86)_35%,rgba(255,110,0,0.68)_58%,rgba(255,110,0,0.20)_85%,transparent_100%)] lg:block" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] items-center justify-center gap-8 px-4 py-6 sm:px-8 lg:justify-between lg:py-10">
          <div className="w-full max-w-[540px] rounded-[28px] bg-[#f5e4da]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:rounded-[34px] sm:p-10">
            <div className="inline-flex rounded-full bg-[#ffe8d7] px-4 py-2 text-[14px] font-semibold text-[#ff6b00]">
              ClickEat Account
            </div>

            <h1 className="mt-7 text-[42px] font-extrabold leading-none text-[#2f3542] sm:text-[56px]">
              Регистрация
            </h1>

            <p className="mt-5 text-[17px] leading-8 text-[#71809a] sm:text-[18px]">
              Создай аккаунт и начни заказывать любимую еду быстро и удобно
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit();
              }}
              className="mt-8 space-y-4"
            >
              <Input
                ref={nameRef}
                placeholder="Ваше имя"
                value={form.name}
                onChange={handleChange("name")}
                onKeyDown={(event) => focusNext(event, form.name, emailRef)}
                autoComplete="name"
              />

              <Input
                ref={emailRef}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
                onKeyDown={(event) => focusNext(event, form.email, phoneRef)}
                autoComplete="email"
              />

              <div className="grid grid-cols-[125px_1fr] gap-3 sm:grid-cols-[130px_1fr]">
                <select
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value)}
                  className="rounded-[18px] border border-transparent bg-[#f3f1ef] px-4 py-4 text-[16px] text-[#4d5868] outline-none"
                >
                  <option>UZ +998</option>
                  <option>KZ +7</option>
                  <option>RU +7</option>
                </select>

                <Input
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

              <Input
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

              {passwordStatus === "short" ? (
                <p className="text-[14px] font-semibold text-[#d14d4d]">
                  Минимум 8 символов
                </p>
              ) : null}

              {passwordStatus === "ok" ? (
                <p className="text-[14px] font-semibold text-[#3ab45b]">
                  Пароль подходит
                </p>
              ) : null}

              <Input
                ref={confirmPasswordRef}
                type="password"
                placeholder="Подтвердите пароль"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                onKeyDown={(event) =>
                  focusNext(event, form.confirmPassword)
                }
                autoComplete="new-password"
              />

              {confirmStatus === "mismatch" ? (
                <p className="text-[14px] font-semibold text-[#f08a24]">
                  Пароли не совпадают
                </p>
              ) : null}

              {confirmStatus === "ok" ? (
                <p className="text-[14px] font-semibold text-[#3ab45b]">
                  Пароли совпадают
                </p>
              ) : null}

              {error ? (
                <div className="rounded-[18px] border border-[#ffd7d2] bg-[#fff3f1] px-4 py-3 text-[14px] font-medium text-[#d14d4d]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[20px] bg-[#ff8b39] px-5 py-4 text-[18px] font-bold text-white shadow-[0_16px_30px_rgba(255,107,0,0.18)] transition hover:translate-y-[-1px] hover:bg-[#ff7a1f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Создаём..." : "Создать аккаунт"}
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
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete={autoComplete}
      className="w-full rounded-[18px] border border-transparent bg-[#f3f1ef] px-5 py-4 text-[16px] text-[#4d5868] outline-none transition focus:border-[#ff8b39] focus:bg-white"
    />
  );
};