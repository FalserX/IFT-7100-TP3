// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUser = async (userId: string, data: any) => {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  else if (res.status !== 204) {
    return await res.json();
  }
};
