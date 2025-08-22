"use client";

import { axiosInstances } from "@/services/axiosService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

const page = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    setLoading(true);
    const result = await axiosInstances.get(api.getProducts);
    if (result.status === 200) setProducts(result.data);
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleClick = (e: any, id: any) => {
    router.push(`/product/${id}`);
  };
  return (
    <div>
      <div className="container-fluid pt-5 bg-primary hero-header">
        <div className="container pt-5">
          <div className="row g-5 pt-5">
            <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
              <div
                className="btn btn-sm border rounded-pill text-white px-3 mb-3 animated slideInRight"
                data-wow-delay="1.2s"
              >
                Robotics
              </div>
              <h1
                className="display-4 text-white mb-4 animated slideInRight"
                data-wow-delay="1.2s"
              >
                Artificial Intelligence for Your Business
              </h1>

              <a
                href=""
                className="btn btn-light py-sm-3 px-sm-5 rounded-pill me-3 animated slideInRight"
                data-wow-delay="1.2s"
              >
                Read More
              </a>
              <a
                href=""
                className="btn btn-outline-light py-sm-3 px-sm-5 rounded-pill animated slideInRight"
                data-wow-delay="1.2s "
              >
                Contact Us
              </a>
            </div>
            <div className="col-lg-6 align-self-end text-center text-lg-end">
              <img className="img-fluid" src="images/hero-img-2.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div
            className="mx-auto text-center wow fadeIn"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="mb-5">Our Products</h1>
          </div>
          {loading ? (
            <div className="row g-4">
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            products && (
              <div className="row g-4">
                {products.map?.((content: any, index: number) => (
                  <div
                    className="col-lg-4 wow fadeIn"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handleClick(e, content._id)}
                    key={index}
                  >
                    <div className="case-item position-relative overflow-hidden rounded mb-2">
                      <img
                        className="img-fluid"
                        src={content.image}
                        alt=""
                        style={{
                          height: "300px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <a
                        className="case-overlay text-decoration-none category-link"
                        data-category="Educational Robots"
                      >
                        <small>{content.title}</small>
                        <span className="btn btn-square btn-primary">
                          <i className="fa fa-arrow-right"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      <div className="container-fluid bg-primary newsletter py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div
              className="col-md-5 ps-lg-0 pt-5 pt-md-0 text-start wow fadeIn"
              data-wow-delay="0.3s"
            >
              <img className="img-fluid" src="images/newsletter2.png" alt="" />
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
    </div>
  );
};
export default page;
