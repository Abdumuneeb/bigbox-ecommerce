"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/lib/validationSchema/signupValidations";
import { axiosInstances } from "@/services/axiosService";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { email, password, name } = values;
      const dataToSend = {
        email,
        name,
        password,
      };
      try {
        const result = await axiosInstances.post(api.signUp, dataToSend);
        if (result?.status === 200) {
          router.push("/login");
          toast.success("Account created successfully");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #e0f7fa 0%, #fff 50%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background shapes */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "rgba(255, 112, 112, 0.3)",
          borderRadius: "50%",
          top: "10%",
          left: "10%",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          background: "rgba(126, 87, 194, 0.3)",
          borderRadius: "50%",
          bottom: "20%",
          right: "20%",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "150px",
          height: "150px",
          background: "rgba(255, 183, 77, 0.3)",
          borderRadius: "50%",
          top: "30%",
          right: "10%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "100px",
          height: "100px",
          background: "rgba(126, 87, 194, 0.3)",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          top: "60%",
          left: "20%",
        }}
      />

      {/* Form */}
      <div
        className="card p-4 shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 1,
          borderRadius: "8px",
        }}
      >
        <h1
          className="text-center text-purple mb-2"
          style={{ color: "#7e57c2" }}
        >
          E-commerce
        </h1>
        <h4 className="text-center mb-4">Sign Up</h4>

        <form onSubmit={formik.handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={`form-control ${
                formik.touched.name && formik.errors.name ? "is-invalid" : ""
              }`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={`form-control ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="invalid-feedback">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#7e57c2",
              color: "#fff",
              padding: "10px 0",
              borderRadius: "6px",
            }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          {/* Login Link */}
          <p className="mt-3 text-muted text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary text-decoration-none">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
