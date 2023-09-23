export function isAdmin(userId: string) {
  const adminIds = Deno.env.get("ADMIN_USER_ID")?.split(",") ?? [];
  return adminIds.includes(userId);
}
