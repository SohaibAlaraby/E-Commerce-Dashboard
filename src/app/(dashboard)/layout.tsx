import DashboardShell from "@/components/DashboardShell/DashboarShell";

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>{children}</DashboardShell>
  );
}