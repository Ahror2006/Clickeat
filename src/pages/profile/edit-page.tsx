import { useRef, useState } from "react";
import { GoPerson } from "react-icons/go";
import {
  FiSave,
  FiTrash2,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
  FiCamera,
  FiArrowLeft,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../stores/auth.store";
import { useToastStore } from "../../stores/toast.store";

export function EditProfilePage() {
  const navigate = useNavigate();

  const user = useAuth((state) => state.user);
  const updateProfile = useAuth((state) => state.updateProfile);
  const setAvatar = useAuth((state) => state.setAvatar);
  const logout = useAuth((state) => state.handleLogout);

  const showToast = useToastStore((state) => state.showToast);

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [password, setPassword] = useState(user.password || "");

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
      showToast("Аватар обновлён", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return showToast("Введите имя", "error");
    if (!email.trim()) return showToast("Введите email", "error");
    if (!password.trim()) return showToast("Введите пароль", "error");

    if (password.trim().length < 8) {
      showToast("Пароль должен содержать минимум 8 символов", "error");
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim(),
    });

    showToast("Данные профиля сохранены", "success");
    setTimeout(() => navigate("/profile"), 600);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Ты точно хочешь удалить аккаунт? Это действие нельзя отменить."
    );

    if (!confirmed) return;

    logout();
    localStorage.removeItem("click-eat-current-user");
    showToast("Аккаунт удалён", "success");
    setTimeout(() => navigate("/"), 600);
  };

  return (
    <section className="edit-profile-page pb-12">
      <div className="mx-auto max-w-[1120px] px-4">
        <div className="edit-profile-shell">
          <div className="edit-profile-hero">
            <div>
              <Link to="/profile" className="edit-profile-back">
                <FiArrowLeft />
                <span>Назад в профиль</span>
              </Link>

              <h1>Редактирование профиля</h1>
              <p>Обнови личные данные, пароль и аватар аккаунта.</p>
            </div>
          </div>

          <div className="edit-profile-content">
            <div className="edit-profile-avatar-card">
              <p className="edit-profile-card-title">Фото профиля</p>
              <span className="edit-profile-card-subtitle">
                Нажми на аватар, чтобы заменить изображение.
              </span>

              <div className="mt-8 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="edit-profile-avatar-button"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" />
                  ) : (
                    <GoPerson />
                  )}

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
                    Эти данные будут использоваться в профиле и заказах.
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
                  value={email}
                  onChange={setEmail}
                  placeholder="Введите email"
                  type="email"
                />

                <Field
                  label="Телефон"
                  icon={<FiPhone />}
                  value={phone}
                  onChange={setPhone}
                  placeholder="Введите телефон"
                  type="text"
                />

                <Field
                  label="Пароль"
                  icon={<FiLock />}
                  value={password}
                  onChange={setPassword}
                  placeholder="Введите пароль"
                  type="password"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button type="submit" className="edit-profile-save-btn">
                    <FiSave />
                    <span>Сохранить данные</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="edit-profile-delete-btn"
                  >
                    <FiTrash2 />
                    <span>Удалить аккаунт</span>
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
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
}) {
  return (
    <div>
      <label className="edit-profile-label">{label}</label>

      <div className="edit-profile-input-wrap">
        <span>{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}