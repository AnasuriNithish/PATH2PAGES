import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 font-bold text-xl border-b">Admin</div>
        <nav className="p-4 space-y-2">
          <Link to="/" className="block p-2 hover:bg-gray-200 rounded">Dashboard</Link>
          <Link to="/products" className="block p-2 hover:bg-gray-200 rounded">Products</Link>
          <Link to="/orders" className="block p-2 hover:bg-gray-200 rounded">Orders</Link>
          <Link to="/coupons" className="block p-2 hover:bg-gray-200 rounded">Coupons</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
