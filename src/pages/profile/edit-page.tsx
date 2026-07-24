import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FiArrowLeft,
  FiCamera,
  FiLogOut,
  FiMail,
  FiPhone,
  FiSave,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { Container } from "../../widgets/container";
import { useAuth } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";
import { useToastStore } from "../../stores/toast.store";
import { getToken, saveAuth } from "../../lib/auth";
import { API_BASE_URL } from "../../configs/api";

export function EditProfilePage() {
  const navigate = useNavigate();

  const user = useAuth((state) => state.user);
  const updateProfile = useAuth((state) => state.updateProfile);
  const logout = useAuth((state) => state.handleLogout);
  const theme = useThemeStore((state) => state.theme);
  const showToast = useToastStore((state) => state.showToast);

  const isDark = theme === "dark";

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Фото слишком большое. Лучше выбрать до 2MB.", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result as string);
      showToast("Аватар выбран", "success");
    };

    reader.readAsDataURL(file);
  };

  const saveLocalProfile = (nextUser: typeof user) => {
    updateProfile(nextUser);

    const token = getToken();
    if (token) {
      saveAuth(token, nextUser);
    }

    localStorage.setItem("click-eat-current-user", JSON.stringify(nextUser));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      showToast("Введите имя", "error");
      return;
    }

    const token = getToken();

    const fallbackUser = {
      ...user,
      name: name.trim(),
      phone: phone.trim(),
      avatar,
      role: user.role || "client",
    };

    try {
      setLoading(true);

      if (!token) {
        saveLocalProfile(fallbackUser);
        showToast("Профиль сохранён локально", "success");
        navigate("/profile");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          avatar,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.user) {
        saveLocalProfile(fallbackUser);
        showToast(data.message || "Backend не ответил, сохранил локально", "info");
        navigate("/profile");
        return;
      }

      updateProfile({
        name: data.user.name || "",
        email: data.user.email || user.email,
        phone: data.user.phone || "",
        avatar: data.user.avatar || "",
        role: data.user.role || user.role || "client",
      });

      saveAuth(token, data.user);

      showToast("Профиль сохранён", "success");
      navigate("/profile");
    } catch {
      saveLocalProfile(fallbackUser);
      showToast("Backend не отвечает, сохранил локально", "info");
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    showToast("Аватар удалён", "info");
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Выйти из аккаунта?");
    if (!confirmed) return;

    logout();

    localStorage.removeItem("clickeat-token");
    localStorage.removeItem("clickeat-user");
    localStorage.removeItem("click-eat-current-user");

    showToast("Вы вышли из аккаунта", "success");
    navigate("/");
  };

  return (
    <main
      className={`min-h-screen min-w-[360px] pb-16 pt-[120px] ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
      }`}
    >
      <Container>
        <section
          className={`overflow-hidden rounded-[34px] border ${
            isDark
              ? "border-[#2b1708] bg-[#101010]"
              : "border-black/10 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.08)]"
          }`}
        >
          <div className="bg-gradient-to-br from-[#ff6b00] via-[#ff8c22] to-[#111] p-5 sm:p-8">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-black text-[#ff6b00]"
            >
              <FiArrowLeft />
              Назад в профиль
            </Link>

            <h1 className="mt-8 max-w-[700px] text-[34px] font-black leading-tight text-white sm:text-[50px]">
              Редактирование профиля
            </h1>

            <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-white/75">
              Обнови личные данные и аватар аккаунта.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 p-5 lg:grid-cols-[360px_1fr] lg:p-8">
            <div
              className={`rounded-[28px] border p-5 text-center ${
                isDark ? "border-[#2b1708] bg-[#151515]" : "border-black/10 bg-[#fff8f1]"
              }`}
            >
              <h2 className="text-[22px] font-black">Фото профиля</h2>
              <p className={`mt-1 text-[14px] ${isDark ? "text-white/50" : "text-black/50"}`}>
                Выбери изображение до 2MB.
              </p>

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative mx-auto mt-7 flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-[34px] bg-[#fff3e8] text-[64px] text-[#ff6b00] shadow-[0_16px_36px_rgba(0,0,0,0.14)]"
              >
                {avatar ? (
                  <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <GoPerson />
                )}

                <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#ff6b00] text-[20px] text-white">
                  <FiCamera />
                </span>
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-full bg-[#ff6b00] px-6 py-4 text-[14px] font-black text-white"
                >
                  Загрузить фото
                </button>

                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-[14px] font-black ${
                    isDark ? "bg-white/10 text-white" : "bg-white text-red-500"
                  }`}
                >
                  <FiTrash2 />
                  Удалить фото
                </button>
              </div>
            </div>

            <div
              className={`rounded-[28px] border p-5 ${
                isDark ? "border-[#2b1708] bg-[#151515]" : "border-black/10 bg-[#fff8f1]"
              }`}
            >
              <div>
                <h2 className="text-[22px] font-black">Личные данные</h2>
                <p className={`mt-1 text-[14px] ${isDark ? "text-white/50" : "text-black/50"}`}>
                  Email пока не меняем, чтобы не ломать авторизацию.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                <Field
                  icon={<FiUser />}
                  label="Имя"
                  value={name}
                  onChange={setName}
                  placeholder="Введите имя"
                  isDark={isDark}
                />

                <Field
                  icon={<FiPhone />}
                  label="Телефон"
                  value={phone}
                  onChange={setPhone}
                  placeholder="Введите телефон"
                  isDark={isDark}
                />

                <ReadonlyField
                  icon={<FiMail />}
                  label="Email"
                  value={user.email || "Не указано"}
                  isDark={isDark}
                />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b00] px-6 py-4 text-[15px] font-black text-white disabled:opacity-60"
                >
                  <FiSave />
                  {loading ? "Сохраняем..." : "Сохранить"}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-black ${
                    isDark ? "bg-white/10 text-white" : "bg-white text-red-500"
                  }`}
                >
                  <FiLogOut />
                  Выйти
                </button>
              </div>
            </div>
          </form>
        </section>
      </Container>
    </main>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isDark: boolean;
}) {
  return (
    <label>
      <span className={`mb-2 block text-[13px] font-black ${isDark ? "text-white/60" : "text-black/55"}`}>
        {label}
      </span>

      <div
        className={`flex items-center gap-3 rounded-[22px] border px-4 py-4 ${
          isDark
            ? "border-white/10 bg-black/35 text-white"
            : "border-black/10 bg-white text-[#2f3542]"
        }`}
      >
        <span className="text-[20px] text-[#ff6b00]">{icon}</span>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
        />
      </div>
    </label>
  );
}

function ReadonlyField({
  icon,
  label,
  value,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div>
      <span className={`mb-2 block text-[13px] font-black ${isDark ? "text-white/60" : "text-black/55"}`}>
        {label}
      </span>

      <div
        className={`flex items-center gap-3 rounded-[22px] border px-4 py-4 opacity-75 ${
          isDark
            ? "border-white/10 bg-black/35 text-white"
            : "border-black/10 bg-white text-[#2f3542]"
        }`}
      >
        <span className="text-[20px] text-[#ff6b00]">{icon}</span>
        <b className="break-all">{value}</b>
      </div>
    </div>
  );
}
