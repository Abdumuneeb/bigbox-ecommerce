"use client";
import { loginSchema } from "@/lib/validationSchema/loginValidation";
import { axiosInstances } from "@/services/axiosService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { useFormik } from "formik";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await axiosInstances.post(api.signIn, values);
        if (result?.status === 200) {
          router.push("/home");
          toast.success("Login successful");
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
      {/* Background Blur Shapes */}
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

      {/* Login Card */}
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
        <h1 className="text-center mb-2" style={{ color: "#7e57c2" }}>
          E-commerce
        </h1>
        <h4 className="text-center mb-4">Login</h4>

        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Submit Button */}
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
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* Link to Signup */}
          <p className="mt-3 text-muted text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary text-decoration-none">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
