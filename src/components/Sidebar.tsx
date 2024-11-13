interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-gray-800 text-white p-4 overflow-y-auto">
      {children}
    </aside>
  );
}
