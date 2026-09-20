export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <aside>here is a side</aside>
        <main>
            <nav>here is nav</nav>
            {children}
        </main>
    </div>
  );
}