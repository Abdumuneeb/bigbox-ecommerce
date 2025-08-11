import type { Metadata } from "next";
import BootstrapJsLoader from "@/components/ui/BootstrapJsLoader";
import Registry from "@/components/Registry";
import "@/styles/global.css";
import "@/styles/animate.min.css";
import "@/styles/animate.min.css";

export const metadata: Metadata = {
  title: "Ecommerce website",
  description:
    "Make cheap international calls anywhere around the globe. Stay in touch with your loved ones. Download talk home app for international top ups and recharge",
};

export default async function LocaleLayout({ children, params }: any) {
  return (
    <html>
      <body>
        <BootstrapJsLoader />
        <Registry>{children}</Registry>
      </body>
    </html>
  );
}
