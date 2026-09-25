import { AdminLayoutProvider } from "@/src/components/admin/AdminLayoutContext";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { AdminHeader } from "@/src/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutProvider>
      <div className="flex h-screen w-full overflow-hidden bg-warm-white">
        <AdminSidebar />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-warm-white/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminLayoutProvider>
  );
}
