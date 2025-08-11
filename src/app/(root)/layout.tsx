import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const Layout = ({ children }: any) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
