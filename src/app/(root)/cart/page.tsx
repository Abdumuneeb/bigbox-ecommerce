"use client";

import { api } from "@/services/api";
import { axiosInstances } from "@/services/axiosService";
import { useEffect, useState } from "react";
import CartTableSkeleton from "@/components/skeletons/TableSkeleton";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const orderCount = Cookies.get("cartCount") || "0";
  const userId = Cookies.get("id");

  const getCartItems = async () => {
    setLoading(true);
    try {
      const result = await axiosInstances.get(api.getOrders(userId));
      if (result.status === 200) {
        setCartItems(result.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const handleCheckout = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await axiosInstances.put(api.updateProductStatus(userId));

      if (result.status === 200) {
        getCartItems();
        Cookies.set("cartCount", "0");
        window.dispatchEvent(new Event("storage"));
        toast.success("Checkout successful!");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  const handleRemoveFromCart = async (orderId: string) => {
    try {
      const result = await axiosInstances.delete(
        api.removeProductFromCart(orderId)
      );
      if (result.status === 200) {
        getCartItems();
        const newCount = Number(orderCount) - 1;
        Cookies.set("cartCount", newCount.toString());
        window.dispatchEvent(new Event("storage"));
        toast.success("Item removed from cart successfully");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, order) => {
      return (
        total +
        order.products.reduce(
          (orderTotal: number, item: any) =>
            orderTotal + item.productId.price * item.quantity,
          0
        )
      );
    }, 0);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="container-fluid pt-5 bg-primary hero-header">
        <div className="container pt-5">
          <div className="row g-5 pt-5">
            <div className="col-lg-12 align-self-center text-center text-lg-start mb-lg-5">
              <h1 className="display-4 text-white mb-4 animated slideInLeft category-title">
                Cart
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center justify-content-lg-start mb-lg-5">
                  <li className="breadcrumb-item">
                    <a className="text-white" href="#">
                      Home
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Cart
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Table */}
      <div className="container-fluid pt-3">
        <div className="container pt-5">
          <div className="table-responsive">
            <table className="table table-hover align-middle shadow-sm rounded">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>

              {loading ? (
                <CartTableSkeleton />
              ) : cartItems?.length > 0 ? (
                <tbody>
                  {cartItems.map((order: any) =>
                    order.products.map((item: any) => (
                      <tr key={item._id}>
                        <td>
                          <img
                            src={item.productId.image}
                            alt={item.productId.title}
                            className="rounded"
                            style={{
                              width: "55px",
                              height: "55px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>{item.productId.title}</td>
                        <td className="text-success fw-bold">
                          ${item.productId.price}
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            onClick={() => handleRemoveFromCart(order._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No products in cart
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button
              disabled={cartItems?.length == 0}
              className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm"
              onClick={() => setShowModal(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Stylish Checkout Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-light border-0">
                <h5 className="modal-title fw-bold">🛒 Checkout Summary</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "60vh", overflowY: "auto" }}
              >
                {cartItems.map((order: any) =>
                  order.products.map((item: any) => (
                    <div
                      key={item._id}
                      className="d-flex align-items-center justify-content-between py-3 border-bottom"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={item.productId.image}
                          alt={item.productId.title}
                          className="rounded me-3"
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div className="fw-semibold">
                            {item.productId.title}
                          </div>
                          <small className="text-muted">
                            {item.quantity} × ${item.productId.price}
                          </small>
                        </div>
                      </div>
                      <div className="fw-bold text-success">
                        ${(item.productId.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="modal-footer bg-light border-0 d-flex justify-content-between align-items-center">
                <div className="fw-bold fs-5 text-primary">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
                <div>
                  <button
                    className="btn btn-outline-secondary rounded-pill px-4 me-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success rounded-pill px-4 shadow-sm"
                    onClick={(e) => handleCheckout(e)}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Proceed"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <br />
      <br />
    </div>
  );
};

export default Page;
