// src/pages/OrdersPage.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Admin", link: "/" },
  { name: "Dashboard", link: "/dashboard" },
  { name: "Products", link: "/products" },
  { name: "Orders", link: "/orders", active: true },
  { name: "Coupons", link: "/coupons" },
];

const initialOrders = [
  {
    id: "ORD12345",
    customer: "John Doe",
    total: 999,
    status: "Processing",
    date: "2025-09-01",
  },
  {
    id: "ORD12346",
    customer: "Jane Smith",
    total: 1499,
    status: "Shipped",
    date: "2025-09-02",
  },
  {
    id: "ORD12347",
    customer: "David Johnson",
    total: 799,
    status: "Delivered",
    date: "2025-09-03",
  },
  {
    id: "ORD12348",
    customer: "Alice Brown",
    total: 1299,
    status: "Cancelled",
    date: "2025-09-04",
  },
  {
    id: "ORD12349",
    customer: "Robert Green",
    total: 350,
    status: "Shipped",
    date: "2025-09-05",
  },
  {
    id: "ORD12350",
    customer: "Laura Wilson",
    total: 2100,
    status: "Processing",
    date: "2025-09-05",
  },
  {
    id: "ORD12351",
    customer: "Michael Clark",
    total: 150,
    status: "Delivered",
    date: "2025-09-06",
  },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Processing":
      return "bg-sky-50 text-sky-700 border border-sky-200";
    case "Shipped":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200";
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const listRef = useRef(null);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = statusFilter ? o.status === statusFilter : true;
      const matchesSearch = term
        ? o.id.toLowerCase().includes(term) ||
          o.customer.toLowerCase().includes(term)
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const totalRevenue = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + o.total, 0),
    [filteredOrders]
  );

  useEffect(() => {
    const rows = listRef.current?.querySelectorAll(".order-card");
    if (!rows) return;
    rows.forEach((row, index) => {
      row.style.opacity = "0";
      row.style.transform = "translateY(8px)";
      row.style.transitionProperty = "opacity, transform";
      row.style.transitionDuration = "300ms";
      row.style.transitionTimingFunction = "cubic-bezier(.2,.9,.3,1)";
      row.style.transitionDelay = `${index * 45}ms`;
      void row.offsetWidth;
      row.style.opacity = "1";
      row.style.transform = "translateY(0)";
    });
  }, [filteredOrders.length, statusFilter, search]);

  const handleViewOrder = (order) => setSelectedOrder({ ...order });
  const handleCloseModal = () => setSelectedOrder(null);
  const handleSaveStatus = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: selectedOrder.status } : o
      )
    );
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-800">
      <nav className="hidden md:block w-52 bg-white border-r border-neutral-200 p-6 flex-shrink-0">
        <div className="text-lg font-extrabold text-neutral-900 mb-6">
          App Menu
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-neutral-100 text-neutral-900 font-semibold border-l-4 border-neutral-800"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`
                }
                end
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900">
              Orders Management
            </h2>
            <p className="text-neutral-500 mt-1 text-sm">
              Track, filter and review all customer orders in real time.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl bg-white border border-neutral-200">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                Total Orders
              </div>
              <div className="text-lg font-bold text-emerald-600">
                {filteredOrders.length}
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-neutral-200">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                Revenue (filtered)
              </div>
              <div className="text-lg font-bold text-cyan-600">
                ₹{totalRevenue}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mb-8">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input
            placeholder="Search by Order ID or Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm w-72"
          />
        </div>

        <div className="transition-opacity duration-500">
          {filteredOrders.length > 0 ? (
            <div
              ref={listRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="order-card bg-white p-5 rounded-xl border border-neutral-200 cursor-pointer"
                  onClick={() => handleViewOrder(order)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-neutral-700 font-mono">
                        {order.id}
                      </h4>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        Customer:{" "}
                        <span className="text-neutral-800 font-medium">
                          {order.customer}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 mt-1 ${getStatusClass(
                        order.status
                      )}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-neutral-200 pt-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="text-neutral-500 uppercase text-xs tracking-wider">
                        Total Amount
                      </p>
                      <p className="text-2xl font-extrabold text-cyan-600">
                        ₹{order.total}
                      </p>
                    </div>

                    <div className="text-right w-32">
                      <p className="text-neutral-500 uppercase text-xs tracking-wider">
                        Order Date
                      </p>
                      <p className="text-neutral-700 font-medium mt-1">
                        {order.date}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order);
                        }}
                        className="mt-3 w-full px-4 py-1.5 bg-neutral-800 text-white rounded-lg text-xs font-semibold"
                      >
                        View / Update
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="bg-neutral-100 text-neutral-800 px-8 py-6 rounded-xl border border-neutral-300 max-w-md text-center">
                <h3 className="text-xl font-semibold mb-2">
                  No orders match your filters
                </h3>
                <p className="text-neutral-600 text-sm">
                  Try clearing the search or changing the status filter.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white text-neutral-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-neutral-900">
                Order Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-neutral-500 hover:text-neutral-800"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order ID</span>
                <span className="font-mono text-emerald-600 font-medium">
                  {selectedOrder.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer</span>
                <span className="text-neutral-700">
                  {selectedOrder.customer}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total</span>
                <span className="text-cyan-600 font-medium">
                  ₹{selectedOrder.total}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-neutral-500">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <div className="mt-4">
                <label className="text-xs text-neutral-500">
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    setSelectedOrder((p) => ({ ...p, status: e.target.value }))
                  }
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">
                  (Right now this only updates locally.)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-transparent border rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-5 py-2 bg-neutral-900 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
