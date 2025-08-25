import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid pt-5 bg-primary hero-header">
        <div className="container pt-5">
          <div className="row g-5 pt-5">
            <div className="col-lg-12 align-self-center text-center text-lg-start mb-lg-5">
              <h1 className="display-4 text-white mb-4 animated slideInLeft">
                About Us
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
                    About Us
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-10 mx-auto">
            <h2 className="mb-4 fw-bold text-center">
              Building the Future with Robotics
            </h2>
            <p className="mb-4">
              At Bugbox, we don’t just sell robots — we make innovation
              accessible. Our mission is to provide high-quality robotics
              products that inspire creativity, learning, and problem-solving.
              Whether you are a student, hobbyist, educator, or business, our
              platform offers the tools you need to explore the future of
              technology.
            </p>

            <h3 className="mt-5 mb-3">Our Mission</h3>
            <p className="mb-4">
              We aim to empower people of all ages to engage with robotics in a
              meaningful way. From classroom learning to personal projects, our
              solutions are designed to encourage innovation, critical thinking,
              and hands-on experience.
            </p>

            <h3 className="mt-5 mb-3">Our Programs & Products</h3>
            <p className="mb-4">
              We provide a wide range of robotics kits, components, and learning
              modules that are:
            </p>
            <ul className="mb-4">
              <li>Easy to use and beginner-friendly</li>
              <li>Built with real-world applications in mind</li>
              <li>Compatible with modern STEM education standards</li>
              <li>Scalable for both learning and advanced projects</li>
            </ul>

            <h3 className="mt-5 mb-3">Our Impact</h3>
            <p className="mb-4">
              By making robotics practical and engaging, we have helped schools,
              institutions, and individuals create solutions that matter. Our
              customers don’t just purchase robots — they gain skills that are
              directly applicable to the future of work and innovation.
            </p>
            <p className="mb-4">
              <strong>94% of our learners feel more engaged,</strong>{" "}
              <strong>81% gain job-ready skills,</strong> and{" "}
              <strong>76% show stronger interest in STEM careers.</strong>
            </p>

            <h3 className="mt-5 mb-3">Why Choose Us</h3>
            <p className="mb-4">
              Every product and program we design is based on real-world
              industry needs. We ensure our robotics solutions are practical,
              curriculum-aligned, and enjoyable to use. Whether it’s for
              education, research, or personal passion, Bugbox stands for
              reliability, quality, and innovation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
