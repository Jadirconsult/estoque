import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import DashboardShell from "@/components/layout/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireSession();

  if (!profile || !profile.active) redirect("/auth/login");

  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
