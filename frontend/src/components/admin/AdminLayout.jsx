// src/pages/admin/AdminLayout.jsx
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 w-full md:p-8 p-4 pt-[120px] md:pt-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
