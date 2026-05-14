import { useRef, useState } from "react";
import { GoPerson } from "react-icons/go";
import {
  FiSave,
  FiTrash2,
  FiMail,
  FiPhone,
  FiUser,
  FiCamera,
  FiArrowLeft,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../stores/auth.store";
import { useToastStore } from "../../stores/toast.store";
import { getToken, saveAuth } from "../../lib/auth";

export function EditProfilePage() {
  const navigate = useNavigate();

  const user = useAuth((state) => state.user);
  const updateProfile = useAuth((state) => state.updateProfile);
  const logout = useAuth((state) => state.handleLogout);
  const showToast = useToastStore((state) => state.showToast);

  const token = getToken();

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Введите имя", "error");
      return;
    }

    if (!token) {
      showToast("Сначала войдите в аккаунт", "error");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/me", {
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

      if (!response.ok) {
        showToast(data.message || "Ошибка сохранения профиля", "error");
        return;
      }

      updateProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        avatar: data.user.avatar || "",
        role: data.user.role,
      });

      saveAuth(token, data.user);

      showToast("Профиль сохранён", "success");
      setTimeout(() => navigate("/profile"), 500);
    } catch {
      showToast("Backend не отвечает", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Выйти из аккаунта?");

    if (!confirmed) return;

    logout();
    localStorage.removeItem("clickeat-token");
    localStorage.removeItem("clickeat-user");
    localStorage.removeItem("click-eat-current-user");

    showToast("Вы вышли из аккаунта", "success");
    setTimeout(() => navigate("/"), 500);
  };

  return (
    <section className="edit-profile-page pb-10 sm:pb-12">
      <div className="mx-auto max-w-[1120px] px-3 sm:px-4">
        <div className="edit-profile-shell">
          <div className="edit-profile-hero !px-5 !py-7 sm:!px-8 sm:!py-10">
            <div>
              <Link to="/profile" className="edit-profile-back">
                <FiArrowLeft />
                <span>Назад в профиль</span>
              </Link>

              <h1 className="!text-[34px] sm:!text-[48px] lg:!text-[58px]">
                Редактирование профиля
              </h1>
              <p className="!text-[15px] sm:!text-[17px]">
                Обнови личные данные и аватар аккаунта.
              </p>
            </div>
          </div>

          <div className="edit-profile-content !grid-cols-1 lg:!grid-cols-[360px_1fr]">
            <div className="edit-profile-avatar-card">
              <p className="edit-profile-card-title">Фото профиля</p>
              <span className="edit-profile-card-subtitle">
                Аватар сохранится в MongoDB и будет доступен после входа с другого устройства.
              </span>

              <div className="mt-8 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="edit-profile-avatar-button"
                >
                  {avatar ? <img src={avatar} alt="avatar" /> : <GoPerson />}

                  <span>
                    <FiCamera />
                    Изменить
                  </span>
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="edit-profile-upload-btn"
                >
                  Загрузить фото
                </button>
              </div>
            </div>

            <div className="edit-profile-form-card">
              <div className="edit-profile-form-head">
                <div>
                  <p className="edit-profile-card-title">Личные данные</p>
                  <span className="edit-profile-card-subtitle">
                    Email меняется только через backend-логику безопасности.
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <Field
                  label="Имя"
                  icon={<FiUser />}
                  value={name}
                  onChange={setName}
                  placeholder="Введите имя"
                  type="text"
                />

                <Field
                  label="Email"
                  icon={<FiMail />}
                  value={user.email}
                  onChange={() => {}}
                  placeholder="Email"
                  type="email"
                  disabled
                />

                <Field
                  label="Телефон"
                  icon={<FiPhone />}
                  value={phone}
                  onChange={setPhone}
                  placeholder="Введите телефон"
                  type="text"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="edit-profile-save-btn disabled:opacity-60"
                  >
                    <FiSave />
                    <span>{loading ? "Сохраняем..." : "Сохранить данные"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="edit-profile-delete-btn"
                  >
                    <FiTrash2 />
                    <span>Выйти из аккаунта</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="edit-profile-label">{label}</label>

      <div className="edit-profile-input-wrap">
        <span>{icon}</span>
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}