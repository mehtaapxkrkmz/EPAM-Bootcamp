import type { ApiResponse, TokenPayload } from "./types";

async function request<T>(url: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return (await response.json()) as ApiResponse<T>;
}

export function register(email: string, password: string) {
  return request<TokenPayload>("/api/auth/register", { email, password });
}

export function login(email: string, password: string) {
  return request<TokenPayload>("/api/auth/login", { email, password });
}

export function forgotPassword(email: string) {
  return request<{ message: string }>("/api/auth/forgot-password", { email });
}

export function resetPassword(token: string, newPassword: string) {
  return request<TokenPayload>("/api/auth/reset-password", { token, newPassword });
}
