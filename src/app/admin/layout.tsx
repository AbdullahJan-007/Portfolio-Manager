import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // A regular user hitting /admin is sent to their own dashboard, not to an
  // error page — there's nothing here for them, but it's not worth alarming
  // them with a 403 screen either.
  if (user.role !== "ADMIN") redirect("/dashboard");

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
