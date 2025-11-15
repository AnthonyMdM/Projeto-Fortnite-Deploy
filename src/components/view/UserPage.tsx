"use client";
import { HoldButton } from "../ui/pressButton";

export default function PageUser() {
  return (
    <>
      <HoldButton
        duration={2000}
        onConfirm={() => alert("Compra confirmada!")}
        className="text-2xl p-5 "
      >
        Comprar Skin
      </HoldButton>
    </>
  );
}
