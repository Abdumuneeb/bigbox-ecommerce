import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home({ locale }: any) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session) redirect("/");

  return null;
}
