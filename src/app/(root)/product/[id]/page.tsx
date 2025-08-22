"use client";
import { useEffect, useState } from "react";
import { axiosInstances } from "@/services/axiosService";
import { api } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<any>({});
  const orderCount = Cookies.get("cartCount") || "0";

  const getProductDetails = async () => {
    setLoading(true);
    try {
      const result = await axiosInstances.get(api.getProduct(id));
      if (result.status === 200) setProductDetails(result.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const userId = Cookies.get("id"); // Get userId from cookies
      if (!userId) {
        console.error("User ID not found in cookies");
        return;
      }

      const dataToSend = {
        userId,
        products: [
          {
            productId: productDetails._id,
            quantity: 1,
          },
        ],
        totalAmount: 0,
        status: "pending",
      };

      const res: any = await axiosInstances.post(api.addToCart, dataToSend);
      if (res.status === 201) {
        toast.success("Product added to cart successfully!");
        const newCount = Number(orderCount) + 1;
        Cookies.set("cartCount", newCount.toString());
        window.dispatchEvent(new Event("storage"));
        router.push("/cart");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {/* Hero Start */}
      <div className="container-fluid pt-5 bg-primary hero-header">
        <div className="container pt-5">
          <div className="row g-5 pt-5">
            <div className="col-lg-12 align-self-center text-center text-lg-start mb-lg-5">
              <h1
                className="display-4 text-white mb-4 animated slideInLeft"
                id="product-name"
              >
                Our Products
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center justify-content-lg-start mb-lg-5">
                  <li className="breadcrumb-item">
                    <Link href="/home" className="text-white">
                      Home
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Our Products
                  </li>
                </ol>
              </nav>
            </div>

            {/* Optional Hero Image */}
            {/* <div className="col-lg-6 align-self-end text-center text-lg-end">
              <img
                className="img-fluid"
                src="/images/hero-img.png"
                alt="Hero"
                style={{ maxHeight: "300px" }}
              />
            </div> */}
          </div>
        </div>
      </div>
      {/* Hero End */}

      {/* Product Detail */}
      {loading ? (
        <div className="mt-5 mb-5 m-auto text-center">
          <ProductDetailSkeleton />
        </div>
      ) : (
        <div className="container-fluid pt-5 pb-5 productDeteil">
          <div className="container pt-5">
            <div className="row justify-content-center align-items-center">
              <div className="col-md-7 pe-5">
                <div className="d-flex align-items-center justify-content-between pe-5">
                  <h2 id="product-title">{productDetails?.title}</h2>
                  <span id="product-price">${productDetails?.price}</span>
                </div>
                <p id="product-description" className="pe-5">
                  {productDetails?.description}
                </p>

                <button
                  className="btn btn-primary btn-main mt-3"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
              <div className="col-md-5">
                <img
                  id="product-image"
                  src={productDetails?.image}
                  alt="Product"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Start */}
      <div className="container-fluid bg-primary newsletter py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div
              className="col-md-5 ps-lg-0 pt-5 pt-md-0 text-start wow fadeIn"
              data-wow-delay="0.3s"
            >
              <img
                className="img-fluid"
                src="/images/newsletter2.png"
                alt="Newsletter"
              />
            </div>
            <div
              className="col-md-7 py-5 newsletter-text wow fadeIn"
              data-wow-delay="0.5s"
            >
              <div className="btn btn-sm border rounded-pill text-white px-3 mb-3">
                Newsletter
              </div>
              <h1 className="text-white mb-4">
                Let's subscribe the newsletter
              </h1>
              <div className="position-relative w-100 mt-3 mb-2">
                <input
                  className="form-control border-0 rounded-pill w-100 ps-4 pe-5"
                  type="text"
                  placeholder="Enter Your Email"
                  style={{ height: "48px" }}
                />
                <button
                  type="button"
                  className="btn shadow-none position-absolute top-0 end-0 mt-1 me-2"
                >
                  <i className="fa fa-paper-plane text-primary fs-4"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter End */}
    </>
  );
};

export default page;
