import axios from "axios";

type ErrorResponse = {
  message?: string;
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.code === "ECONNABORTED") {
      return "Сервер не ответил вовремя. Попробуйте ещё раз через минуту.";
    }

    if (error.code === "ERR_NETWORK") {
      return "Не удалось подключиться к серверу. Проверьте интернет или повторите позже.";
    }

    return error.response?.data?.message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
