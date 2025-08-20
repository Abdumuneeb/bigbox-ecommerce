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
    setFormData({ ...product, image: null }); // keep image null until user uploads
    setOpen(true);
  };

  // Delete Product
  const handleDelete = async (id?: string) => {
    if (!id) return;
    setDeletingId(id);
    try {
      const res = await axiosInstances.delete(api.removeProduct(id));
      if (res.status === 200) {
        getProducts();
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
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
                    <td>{product.stock}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(product)}
                      >
                        edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(product._id)}
                      >
                        {deletingId === product._id ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          />
                        ) : (
                          "delete"
                        )}
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
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            disabled={page === 0}
            onClick={() => handleChangePage(page - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={(page + 1) * rowsPerPage >= products.length}
            onClick={() => handleChangePage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal (Add/Edit) */}
      {open && (
        <div
          className="modal show fade"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
            zIndex: "99999",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    required
                    className="form-control"
                    rows={8}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files ? e.target.files[0] : null,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
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
    </div>
  );
}
