import LoginPage from "@/src/components/view/LoginPage";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login",
  description: "Faça Login",
};

export default function Page() {
  return <LoginPage />;
}
