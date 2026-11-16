import DashboardShell from "@/components/dashboard-shell/DashboarShell";

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>{children}</DashboardShell>
  );
}