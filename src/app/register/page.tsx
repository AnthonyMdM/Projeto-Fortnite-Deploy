import PageRegister from "@/src/components/view/RegisterPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro",
  description: "Faça seu Registro",
};

export default function Page() {
  return <PageRegister />;
}
