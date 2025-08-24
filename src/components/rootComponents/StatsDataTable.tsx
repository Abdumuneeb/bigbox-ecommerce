"use client";
import { api } from "@/services/api";
import { axiosInstances } from "@/services/axiosService";
import React, { useEffect, useState } from "react";

// 📊 Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

interface Stats {
  users: number;
  orders: number;
  products: number;
}

const StatsDataTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Products + Stats
  const getProducts = async () => {
    try {
      setLoading(true);
      const result = await axiosInstances.get(api.getMostPurchasedProducts);

      if (result.status === 200) {
        setProducts(result?.data?.products || []);
        setStats(result?.data?.stats || null);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // ✅ Pagination Handlers
  const handleChangePage = (newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-3">
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <>
          {/* ✅ Stats Section */}
          {stats && (
            <div className="row mb-4 g-3">
              <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0 h-100 text-center bg-light">
                  <div className="card-body">
                    <h5 className="card-title text-primary">Users</h5>
                    <h3 className="fw-bold">{stats.users}</h3>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0 h-100 text-center bg-light">
                  <div className="card-body">
                    <h5 className="card-title text-success">Orders</h5>
                    <h3 className="fw-bold">{stats.orders}</h3>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0 h-100 text-center bg-light">
                  <div className="card-body">
                    <h5 className="card-title text-warning">Products</h5>
                    <h3 className="fw-bold">{stats.products}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Responsive Line Chart Section */}
          <div className="row mb-4 g-3">
            <div className="col-12">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title text-center text-primary mb-4">
                    Purchases vs Stock per Product
                  </h5>
                  <div style={{ width: "100%", height: "400px" }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={products}
                        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="title"
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-25}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        {/* Purchases Line */}
                        <Line
                          type="monotone"
                          dataKey="purchases"
                          stroke="#82ca9d"
                          strokeWidth={1}
                          name="Purchases"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        {/* Stock Line */}
                        <Line
                          type="monotone"
                          dataKey="stock"
                          stroke="#8884d8"
                          strokeWidth={1}
                          name="Stock"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Products Table */}
          <div className="table-responsive shadow rounded">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Purchases</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {products
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((product) => (
                    <tr key={product._id}>
                      <td>{product.title}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.purchases}</td>
                      <td>{product.views}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="mb-2">
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
                ◀
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={(page + 1) * rowsPerPage >= products.length}
                onClick={() => handleChangePage(page + 1)}
              >
                ▶
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsDataTable;
