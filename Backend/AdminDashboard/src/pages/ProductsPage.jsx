/* eslint-disable no-unused-vars */
// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

// Navigation data for the sidebar
const navItems = [
  { name: "Admin", link: "/" },
  { name: "Dashboard", link: "/dashboard" },
  { name: "Products", link: "/products", active: true },
  { name: "Orders", link: "/orders" },
  { name: "Coupons", link: "/coupons" },
];

// Either use env var or fallback to localhost
const SERVER_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_BASE =
  import.meta.env.VITE_API_BASE || `${SERVER_BASE}/api/v1/products`;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  // Mock data for demonstration if API fails (to show UI)
  const [mockProducts, setMockProducts] = useState([
    {
      _id: "1",
      name: "Vintage Scrapbook",
      category: "scrapbook",
      price: 1200,
      stock: 15,
      images: [],
    },
    {
      _id: "2",
      name: "Gold Foil Bookmark",
      category: "bookmark",
      price: 350,
      stock: 50,
      images: [],
    },
    {
      _id: "3",
      name: "Botanical Sticker Set",
      category: "scrapbook",
      price: 450,
      stock: 0,
      images: [],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "scrapbook",
    price: "",
    stock: "",
    images: [],
    files: [],
    existingImages: [],
  });

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceRange, setPriceRange] = useState(2000);
  const [stockRange, setStockRange] = useState(1000);

  // Image modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // -------------------------------
  // Backend Integration
  // -------------------------------
  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.append("q", search);
      if (categoryFilter !== "all") query.append("category", categoryFilter);
      if (priceRange) query.append("maxPrice", priceRange);
      if (stockRange) query.append("maxStock", stockRange);

      const res = await fetch(`${API_BASE}?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
      } else {
        throw new Error(data.error || "API Error");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // API offline -> fallback to mock with client-side filtering
      console.warn("Using local data (API offline)");
      const filtered = mockProducts.filter((p) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || p.category === categoryFilter;
        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "in" ? p.stock > 0 : p.stock === 0);
        const matchesPrice = p.price <= priceRange;
        const matchesStockRange = p.stock <= stockRange;
        return (
          matchesSearch &&
          matchesCategory &&
          matchesStock &&
          matchesPrice &&
          matchesStockRange
        );
      });
      setProducts(filtered);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, priceRange, stockRange, mockProducts]);

  // Image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http") || imagePath.startsWith("blob:"))
      return imagePath;
    return `${SERVER_BASE}${imagePath}`;
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "scrapbook",
      price: "",
      stock: "",
      images: [],
      files: [],
      existingImages: [],
    });
    setIsEdit(false);
    setEditId(null);
  };

  // Submit (add or edit)
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", Number(form.price));
      formData.append("stock", Number(form.stock));

      if (isEdit && form.existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(form.existingImages));
      }

      form.files.forEach((file) => formData.append("images", file));

      const url = isEdit ? `${API_BASE}/${editId}` : API_BASE;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      // Simulate local save
      console.log("Simulating save (API offline)");
      const newProduct = {
        _id: isEdit ? editId : Date.now().toString(),
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images,
      };

      if (isEdit)
        setMockProducts((prev) =>
          prev.map((p) => (p._id === editId ? newProduct : p))
        );
      else setMockProducts((prev) => [...prev, newProduct]);

      alert(isEdit ? "Product updated (Locally)" : "Product added (Locally)");
    } finally {
      setShowModal(false);
      resetForm();
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price,
      stock: product.stock,
      images: product.images || [],
      files: [],
      existingImages: product.images || [],
    });
    setEditId(product._id);
    setIsEdit(true);
    setShowModal(true);
  };

  // Delete flows
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchProducts();
      else throw new Error("API Failed");
    } catch (err) {
      console.log("Simulating delete (API offline)");
      setMockProducts((prev) => prev.filter((p) => p._id !== deleteId));
    } finally {
      setDeleteId(null);
      setDeleteModal(false);
    }
  };

  // Remove image locally
  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      const updatedExisting = [...form.existingImages];
      updatedExisting.splice(index, 1);
      const remainingNewImages = form.images.slice(form.existingImages.length);
      setForm((prev) => ({
        ...prev,
        existingImages: updatedExisting,
        images: [...updatedExisting, ...remainingNewImages],
      }));
    } else {
      const newIndex = index - form.existingImages.length;
      const updatedImages = [...form.images];
      updatedImages.splice(index, 1);
      const updatedFiles = [...form.files];
      if (newIndex >= 0) updatedFiles.splice(newIndex, 1);
      setForm((prev) => ({
        ...prev,
        images: updatedImages,
        files: updatedFiles,
      }));
    }
  };

  const openImageModal = (images, startIndex = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setShowImageModal(true);
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-800 font-sans">
      {/* Sidebar */}
      <nav className="hidden md:block w-52 bg-white border-r border-neutral-200 p-6 flex-shrink-0">
        <div className="text-lg font-extrabold text-neutral-900 mb-6 tracking-tight">
          App Menu
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
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

      {/* Main */}
      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Products
            </h2>
            <p className="text-neutral-500 mt-1 text-sm">
              Manage your catalog, stock, and pricing.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
          >
            + Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm outline-none bg-neutral-50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
              ⌕
            </span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Categories</option>
            <option value="scrapbook">Scrapbook</option>
            <option value="bookmark">Bookmark</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Stock Status</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          <div className="flex gap-4 items-center border-l pl-4 ml-2">
            <div className="flex flex-col w-32">
              <label className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
                Max Price: ₹{priceRange}
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="h-1 bg-neutral-200 rounded-lg"
              />
            </div>
            <div className="flex flex-col w-32">
              <label className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
                Max Stock: {stockRange}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={stockRange}
                onChange={(e) => setStockRange(Number(e.target.value))}
                className="h-1 bg-neutral-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-xs uppercase text-neutral-500 tracking-wider">
                    <th className="p-4 font-semibold">Product Info</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 font-semibold">Images</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((prod) => (
                    <tr
                      key={prod._id}
                      className="hover:bg-neutral-50 transition-colors duration-150 group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-neutral-900">
                          {prod.name}
                        </div>
                        <div className="text-xs text-neutral-400 truncate max-w-[150px]">
                          {prod._id}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-md capitalize border border-neutral-200">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-neutral-700">
                        ₹{prod.price}
                      </td>
                      <td className="p-4">
                        <div
                          className={`flex items-center gap-1.5 text-sm font-medium ${
                            prod.stock > 0
                              ? "text-emerald-700"
                              : "text-rose-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              prod.stock > 0 ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {prod.stock > 0
                            ? `${prod.stock} in stock`
                            : "Out of Stock"}
                        </div>
                      </td>
                      <td className="p-4">
                        {prod.images?.length > 0 ? (
                          <div className="flex -space-x-2 overflow-hidden py-1">
                            {prod.images.slice(0, 3).map((img, idx) => (
                              <img
                                key={idx}
                                src={getImageUrl(img)}
                                alt="mini"
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover cursor-pointer hover:scale-110 transition-transform hover:z-10"
                                onClick={() =>
                                  openImageModal(
                                    prod.images.map(getImageUrl),
                                    idx
                                  )
                                }
                              />
                            ))}
                            {prod.images.length > 3 && (
                              <div className="h-8 w-8 rounded-full ring-2 ring-white bg-neutral-100 flex items-center justify-center text-[10px] text-neutral-500 font-medium">
                                +{prod.images.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-xs italic">
                            No img
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(prod)}
                            className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(prod._id)}
                            className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-white border border-rose-200 rounded hover:bg-rose-50"
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
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-neutral-400">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                No Products Found
              </h3>
              <p className="text-neutral-500 text-sm max-w-xs">
                Try adjusting your filters or add a new product to your
                inventory.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
              <h3 className="text-lg font-bold text-neutral-800">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full p-2.5 border rounded-lg text-sm bg-neutral-50"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      className="w-full p-2.5 border rounded-lg text-sm bg-neutral-50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, category: e.target.value }))
                      }
                      className="w-full p-2.5 border rounded-lg text-sm bg-white"
                    >
                      <option value="scrapbook">Scrapbook</option>
                      <option value="bookmark">Bookmark</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, price: e.target.value }))
                        }
                        className="w-full p-2.5 border rounded-lg text-sm bg-neutral-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, stock: e.target.value }))
                        }
                        className="w-full p-2.5 border rounded-lg text-sm bg-neutral-50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="border-t border-neutral-100 pt-5">
                  <label className="block text-sm font-semibold text-neutral-800 mb-3">
                    Product Images
                  </label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {isEdit &&
                      form.existingImages.map((img, idx) => (
                        <div
                          key={`existing-${idx}`}
                          className="relative group w-20 h-20 rounded-lg overflow-hidden border border-neutral-200"
                        >
                          <img
                            src={getImageUrl(img)}
                            alt="exist"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx, true)}
                            className="absolute top-1 right-1 bg-white text-rose-500 rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                    {form.images
                      .slice(form.existingImages.length)
                      .map((img, idx) => (
                        <div
                          key={`new-${idx}`}
                          className="relative group w-20 h-20 rounded-lg overflow-hidden border border-emerald-500"
                        >
                          <img
                            src={img}
                            alt="new"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeImage(form.existingImages.length + idx)
                            }
                            className="absolute top-1 right-1 bg-white text-rose-500 rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-white text-[9px] text-center py-0.5">
                            NEW
                          </div>
                        </div>
                      ))}

                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer text-neutral-400">
                      <span className="text-xl">+</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const previews = files.map((f) =>
                            URL.createObjectURL(f)
                          );
                          setForm((prev) => ({
                            ...prev,
                            images: [...prev.images, ...previews],
                            files: [...prev.files, ...files],
                          }));
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {form.images.length} images selected
                  </p>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg"
              >
                {isEdit ? "Update Product" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <button
            className="absolute top-4 right-4 text-white/70"
            onClick={() => setShowImageModal(false)}
          >
            ✕
          </button>
          <div className="relative w-full max-w-4xl flex flex-col items-center">
            <img
              src={selectedImages[currentImageIndex]}
              alt="Preview"
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
            <div className="flex gap-4 mt-6">
              <button
                disabled={currentImageIndex === 0}
                onClick={() => setCurrentImageIndex((i) => i - 1)}
                className="px-4 py-2 bg-white/10 text-white rounded-full disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-white/50">
                {currentImageIndex + 1} / {selectedImages.length}
              </span>
              <button
                disabled={currentImageIndex === selectedImages.length - 1}
                onClick={() => setCurrentImageIndex((i) => i + 1)}
                className="px-4 py-2 bg-white/10 text-white rounded-full disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setDeleteModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center border border-neutral-100">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              !
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-white border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
