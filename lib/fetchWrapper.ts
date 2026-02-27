export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include"
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include"
    });

    if (!refreshRes.ok) {
        console.log("fetchApi redirectig the")
      window.location.href = "/auth/signin";
      return;
    }

    return fetch(url, {
      ...options,
      credentials: "include"
    });
  }

  return res;
}
