"use client";
import React, { useEffect, useState } from "react";
import { axiosInstances } from "@/services/axiosService";
import { api } from "@/services/api";

interface Product {
  _id?: string;
  title: string;
  description: string;
  image: File | null;
  price: number;
  stock: number;
  views?: number;
  purchases?: number;
}

export default function ProductsTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Product>({
    title: "",
    description: "",
    image: null,
    price: 0,
    stock: 0,
    views: 0,
    purchases: 0,
  });

  // Fetch Products
  const getProducts = async () => {
    try {
      setLoading(true);
      const result = await axiosInstances.get(api.getProducts);
      if (result.status === 200) setProducts(result.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Pagination Handlers
  const handleChangePage = (newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Add New Product
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      image: null,
      price: 0,
      stock: 0,
    });
    setOpen(true);
  };

  // Edit Product
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product, image: null });
    setOpen(true);
  };

  // Delete Confirmation
  const confirmDelete = (id?: string) => {
    if (!id) return;
    setConfirmDeleteId(id);
  };

  // Delete Product
  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);
    try {
      const res = await axiosInstances.delete(
        api.removeProduct(confirmDeleteId)
      );
      if (res.status === 200) {
        getProducts();
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // Save (Add / Edit) using FormData
  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      if (formData.image) fd.append("image", formData.image);
      fd.append("price", String(formData.price));
      fd.append("stock", String(formData.stock));
      fd.append("views", String(formData.views ?? 0));
      fd.append("purchases", String(formData.purchases ?? 0));

      if (editingProduct) {
        const res = await axiosInstances.put(
          api.updateProduct(editingProduct._id),
          fd
        );
        if (res.status === 200) {
          getProducts();
        }
      } else {
        if (!formData.image) {
          alert("Please upload an image before adding the product.");
          return;
        }
        const res = await axiosInstances.post(api.getProducts, fd);
        if (res.status === 201) {
          getProducts();
        }
      }
      setOpen(false);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3">
      {/* Header */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={handleAdd}>
          Add New
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <div className="table-responsive shadow rounded">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>${product.price}</td>
                    <td>
                      {product.stock === 0 ? (
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontWeight: "500",
                            fontSize: "14px",
                            border: "1px solid #dc3545",
                            backgroundColor: "#f8d7da",
                            color: "#dc3545",
                          }}
                        >
                          Out of stock
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontWeight: "500",
                            fontSize: "14px",
                            border: "1px solid #28a745",
                            backgroundColor: "#d4edda",
                            color: "#28a745",
                          }}
                        >
                          In stock
                        </span>
                      )}
                    </td>
                    <td>{product.stock}</td>
                    <td>
                      {/* Edit Button with SVG */}
                      <button
                        className="btn btn-sm me-2"
                        style={{
                          backgroundColor: "#e7f1ff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px",
                        }}
                        onClick={() => handleEdit(product)}
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="#0d6efd"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2.147-2.147 1.043-1.043a.5.5 0 0 1 .707 0l1.44 1.44zM13.752 4.396 6 12.147V14h1.854l7.752-7.751-1.854-1.853z" />
                        </svg>
                      </button>

                      {/* Delete Button with SVG */}
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#ffe7e7",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px",
                        }}
                        onClick={() => confirmDelete(product._id)}
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="#dc3545"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6H7v6.5a.5.5 0 0 1-1 0v-7z" />
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 
                            2H5a2 2 0 0 1-2-2V4H2.5a1 1 0 0 
                            1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 
                            1 1h4a1 1 0 0 1 1 1h3a1 1 0 
                            1 1 1 1v1zM4.118 4 4 4.059V13a1 
                            1 0 0 0 1 1h6a1 1 0 0 0 
                            1-1V4.059L11.882 4H4.118zM2.5 
                            3V2h11v1h-11z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Rows per page:
          <select
            className="form-select d-inline-block w-auto ms-2"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <div>
          {/* Prev Button */}
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            disabled={page === 0}
            onClick={() => handleChangePage(page - 1)}
          >
            ◀
          </button>

          {/* Next Button */}
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={(page + 1) * rowsPerPage >= products.length}
            onClick={() => handleChangePage(page + 1)}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {open && (
        <div
          className="modal show fade"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.6)",
            zIndex: 99999,
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              {/* Header */}
              <div
                className="modal-header"
                style={{ backgroundColor: "#DCF2FB", color: "black" }}
              >
                <h5 className="modal-title fw-bold">
                  {editingProduct ? " Edit Product" : " Add Product"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Body */}
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      type="text"
                      required
                      className="form-control rounded-3"
                      placeholder="Enter product title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Price</label>
                    <input
                      type="text"
                      required
                      className="form-control rounded-3"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      required
                      className="form-control rounded-3"
                      rows={4}
                      placeholder="Write product details here..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      className="form-control rounded-3"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.files ? e.target.files[0] : null,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Stock</label>
                    <input
                      type="text"
                      required
                      className="form-control rounded-3"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-0">
                <button
                  className="btn btn-light border rounded-3"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary rounded-3 px-4"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div
          className="modal show fade"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.6)",
            zIndex: 99999,
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div
                className="modal-header"
                style={{ backgroundColor: "#DCF2FB", color: "black" }}
              >
                <h5 className="modal-title fw-bold">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmDeleteId(null)}
                />
              </div>
              <div className="modal-body p-4 text-center">
                <p className="mb-0">
                  Are you sure you want to delete this product?
                </p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-between">
                <button
                  className="btn btn-light border rounded-3"
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger rounded-3 px-4"
                  onClick={handleDelete}
                  disabled={deletingId === confirmDeleteId}
                >
                  {deletingId === confirmDeleteId ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
