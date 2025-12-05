import React, { useState } from "react";

// Navigation data for the sidebar
const navItems = [
  { name: "Admin", link: "/" },
  { name: "Dashboard", link: "/dashboard" },
  { name: "Products", link: "/products" },
  { name: "Orders", link: "/orders" },
  { name: "Coupons", link: "/coupons", active: true },
];

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([
    {
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 0,
      usageLimit: 0,
      usedCount: 20,
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      active: true,
      applicableCategories: ["scrapbook"],
    },
    {
      code: "FESTIVE20",
      discountType: "percentage",
      discountValue: 20,
      minOrderValue: 500,
      usageLimit: 50,
      usedCount: 15,
      validFrom: "2025-08-01",
      validTo: "2025-11-15",
      active: true,
      applicableCategories: ["bookmark"],
    },
    {
      code: "SUMMER15",
      discountType: "flat",
      discountValue: 150,
      minOrderValue: 200,
      usageLimit: 10,
      usedCount: 5,
      validFrom: "2025-06-01",
      validTo: "2025-10-30",
      active: true,
      applicableCategories: ["scrapbook", "bookmark"],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCode, setEditCode] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteCode, setDeleteCode] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: 0,
    usageLimit: 0,
    validFrom: "",
    validTo: "",
    active: true,
    applicableCategories: [],
  });

  const [searchCode, setSearchCode] = useState("");
  const [discountRange, setDiscountRange] = useState(100);
  const [usedRange, setUsedRange] = useState(100);
  const [dateFilter, setDateFilter] = useState("");

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: 0,
      usageLimit: 0,
      validFrom: "",
      validTo: "",
      active: true,
      applicableCategories: [],
    });
    setIsEdit(false);
    setEditCode(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedCoupon = {
      ...form,
      code: form.code.toUpperCase(),
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue),
      usageLimit: Number(form.usageLimit),
      usedCount: isEdit
        ? coupons.find((c) => c.code === editCode).usedCount
        : 0,
    };

    if (isEdit) {
      setCoupons((prev) =>
        prev.map((c) => (c.code === editCode ? formattedCoupon : c))
      );
    } else {
      setCoupons([...coupons, formattedCoupon]);
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (c) => {
    setForm({ ...c });
    setEditCode(c.code);
    setIsEdit(true);
    setShowModal(true);
  };

  const confirmDelete = (code) => {
    setDeleteCode(code);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    setCoupons(coupons.filter((c) => c.code !== deleteCode));
    setDeleteModal(false);
    setDeleteCode(null);
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesCode = c.code.toLowerCase().includes(searchCode.toLowerCase());
    const matchesDiscount = c.discountValue <= discountRange;
    const matchesUsed = c.usedCount <= usedRange;
    const matchesDate = dateFilter
      ? new Date(c.validTo) >= new Date(dateFilter)
      : true;
    return matchesCode && matchesDiscount && matchesUsed && matchesDate;
  });

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-800 font-sans">
      {/* 1. Sidebar Navigation */}
      <nav className="hidden md:block w-52 bg-white border-r border-neutral-200 p-6 flex-shrink-0">
        <div className="text-lg font-extrabold text-neutral-900 mb-6 tracking-tight">
          App Menu
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.link}
                className={`
                  flex items-center p-2 rounded-lg text-sm font-medium transition-colors duration-200
                  ${
                    item.active
                      ? "bg-neutral-100 text-neutral-900 font-semibold border-l-4 border-neutral-800"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }
                `}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 2. Main Content Area */}
      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Coupons
            </h2>
            <p className="text-neutral-500 mt-1 text-sm">
              Manage discounts, promo codes, and offers.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-5 py-2.5 bg-neutral-900 text-white font-medium text-sm rounded-lg hover:bg-neutral-800 transition-all shadow-sm hover:shadow-md active:scale-95 duration-200"
          >
            + Add Coupon
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center transition-all duration-300">
          <div className="relative flex-grow max-w-xs">
            <input
              type="text"
              placeholder="Search code..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50 focus:bg-white transition-colors"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
              ⌕
            </span>
          </div>

          <input
            type="date"
            className="p-2 border border-neutral-300 bg-neutral-50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-400 text-neutral-600 focus:bg-white transition-colors"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <div className="flex gap-4 items-center border-l border-neutral-200 pl-4 ml-2">
            <div className="flex flex-col w-32">
              <label className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
                Max Discount
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={discountRange}
                onChange={(e) => setDiscountRange(Number(e.target.value))}
                className="h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-800"
              />
            </div>
            <div className="flex flex-col w-32">
              <label className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
                Max Used
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={usedRange}
                onChange={(e) => setUsedRange(Number(e.target.value))}
                className="h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-800"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden transition-all duration-500">
          {filteredCoupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-xs uppercase text-neutral-500 tracking-wider">
                    <th className="p-4 font-semibold">Code</th>
                    <th className="p-4 font-semibold">Discount</th>
                    <th className="p-4 font-semibold">Min Order</th>
                    <th className="p-4 font-semibold">Validity</th>
                    <th className="p-4 font-semibold">Usage</th>
                    <th className="p-4 font-semibold">Active</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCoupons.map((c, index) => (
                    <tr
                      key={c.code}
                      className="hover:bg-neutral-50 transition-colors duration-150 group"
                      style={{
                        animation: `fadeIn 0.3s ease-out forwards ${
                          index * 0.05
                        }s`,
                      }}
                    >
                      <td className="p-4">
                        <span className="font-mono font-medium text-neutral-900 bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-emerald-600">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}%`
                          : `₹${c.discountValue}`}{" "}
                        OFF
                      </td>
                      <td className="p-4 text-neutral-600">
                        ₹{c.minOrderValue}
                      </td>
                      <td className="p-4 text-xs text-neutral-500">
                        <div className="flex flex-col">
                          <span className="font-medium text-neutral-700">
                            {c.validFrom}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            to {c.validTo}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-600">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-neutral-800 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (c.usedCount / (c.usageLimit || 100)) * 100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs">{c.usedCount}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                            c.active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.active ? "bg-emerald-500" : "bg-neutral-400"
                            }`}
                          ></span>
                          {c.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-neutral-500 max-w-[150px] truncate">
                        {c.applicableCategories.join(", ")}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(c)}
                            className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(c.code)}
                            className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-white border border-rose-200 rounded hover:bg-rose-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-pulse">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-neutral-400">🏷️</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                No Coupons Found
              </h3>
              <p className="text-neutral-500 text-sm max-w-xs">
                Adjust your filters or add a new coupon to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setDeleteModal(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center border border-neutral-100 transform transition-all duration-300 scale-100 opacity-100">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              !
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Delete Coupon?
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="font-mono text-neutral-700">{deleteCode}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-300 scale-100 opacity-100">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
              <h3 className="text-lg font-bold text-neutral-800">
                {isEdit ? "Edit Coupon" : "Add New Coupon"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER25"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-800 bg-neutral-50 focus:bg-white transition-colors font-mono"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    required
                    disabled={isEdit}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-1/2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Discount Type
                    </label>
                    <select
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-800 bg-white"
                      value={form.discountType}
                      onChange={(e) =>
                        setForm({ ...form, discountType: e.target.value })
                      }
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-800 bg-neutral-50 focus:bg-white transition-colors"
                      value={form.discountValue}
                      onChange={(e) =>
                        setForm({ ...form, discountValue: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-1/2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Min Order Value
                    </label>
                    <input
                      type="number"
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-800 bg-neutral-50 focus:bg-white transition-colors"
                      value={form.minOrderValue}
                      onChange={(e) =>
                        setForm({ ...form, minOrderValue: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-800 bg-neutral-50 focus:bg-white transition-colors"
                      value={form.usageLimit}
                      onChange={(e) =>
                        setForm({ ...form, usageLimit: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-1/2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Valid From
                    </label>
                    <input
                      type="date"
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-800 bg-neutral-50 focus:bg-white transition-colors text-neutral-600"
                      value={form.validFrom}
                      onChange={(e) =>
                        setForm({ ...form, validFrom: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Valid To
                    </label>
                    <input
                      type="date"
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-800 bg-neutral-50 focus:bg-white transition-colors text-neutral-600"
                      value={form.validTo}
                      onChange={(e) =>
                        setForm({ ...form, validTo: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                    Applicable Categories
                  </label>
                  <select
                    multiple
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-neutral-800 bg-neutral-50 focus:bg-white h-24"
                    value={form.applicableCategories}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        applicableCategories: Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        ),
                      })
                    }
                  >
                    <option value="scrapbook">Scrapbook</option>
                    <option value="bookmark">Bookmark</option>
                  </select>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) =>
                        setForm({ ...form, active: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-neutral-800 focus:ring-neutral-800 border-gray-300"
                    />
                    <span className="text-sm font-medium text-neutral-700">
                      Set as Active
                    </span>
                  </label>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 shadow-sm transition-colors"
              >
                {isEdit ? "Update Coupon" : "Save Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple fadeIn keyframes for table rows */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CouponsPage;
