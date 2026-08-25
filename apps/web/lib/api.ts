const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  error?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return (
    localStorage.getItem("xpay_token") ||
    sessionStorage.getItem("xpay_token")
  )
}

function setToken(token: string, persist: boolean) {
  if (typeof window === "undefined") return
  if (persist) {
    localStorage.setItem("xpay_token", token)
    sessionStorage.removeItem("xpay_token")
  } else {
    sessionStorage.setItem("xpay_token", token)
    localStorage.removeItem("xpay_token")
  }
}

function removeToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem("xpay_token")
  sessionStorage.removeItem("xpay_token")
}

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = (await res.json()) as ApiResponse<T>

  if (!res.ok && res.status === 401) {
    removeToken()
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/")) {
      window.location.href = "/"
    }
  }

  return data
}

export const api = {
  get: <T = unknown>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T = unknown>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: <T = unknown>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T = unknown>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
  setToken,
  removeToken,
  getToken,
}
