import React from "react";

const Footer = () => {
  return (
    <div className="container-fluid bg-dark text-white-50 footer pt-5">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.1s">
            <a href="index.html" className="navbar-brand d-inline-block mb-3">
              <img className="img-fluid" src="images/logo.png" alt="" />
            </a>
          </div>

          <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.5s">
            <h5 className="text-white mb-4">Popular Link</h5>
            <a className="btn btn-link" href="">
              About Us
            </a>
            <a className="btn btn-link" href="">
              Contact Us
            </a>
            <a className="btn btn-link" href="">
              Privacy Policy
            </a>
            <a className="btn btn-link" href="">
              Terms & Condition
            </a>
          </div>
          <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.7s">
            <h5 className="text-white mb-4">Our Services</h5>
            <a className="btn btn-link" href="">
              Robotic Automation
            </a>
            <a className="btn btn-link" href="">
              Machine learning
            </a>

            <a className="btn btn-link" href="">
              Robot Technology
            </a>
          </div>
        </div>
        <div className="container wow fadeIn" data-wow-delay="0.1s">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                &copy;{" "}
                <a className="border-bottom" href="#">
                  Robotics
                </a>
                , All Right Reserved.
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-menu">
                  <a href="">Home</a>
                  <a href="">Cookies</a>
                  <a href="">Help</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
