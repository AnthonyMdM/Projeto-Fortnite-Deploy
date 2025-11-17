"use client";

import { createUser } from "@/src/actions/actionsAccount";
import { useState } from "react";

export default function PageRegister() {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async function (formData: FormData) {
    const result = await createUser(formData);
    setErrors(result.errors);
    setSuccess(result.success);
  };

  return (
    <form
      action={handleSubmit}
      className="max-w-md mx-auto mt-16 p-6 rounded-2xl border border-zinc-700 bg-zinc-900/60 space-y-4"
    >
      <h1 className="text-2xl font-bold text-center text-white">Criar Conta</h1>

      <input
        name="nome"
        placeholder="Nome"
        className="w-full p-2 rounded bg-zinc-800 text-white"
      />
      <input
        name="email"
        placeholder="E-mail"
        className="w-full p-2 rounded bg-zinc-800 text-white"
      />
      <input
        name="senha"
        type="password"
        placeholder="Senha"
        className="w-full p-2 rounded bg-zinc-800 text-white"
      />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold"
      >
        Registrar
      </button>

      {errors.length > 0 && (
        <div className="text-red-400 text-sm mt-2 space-y-1">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
      {success && <p className="text-green-400">Usuário criado com sucesso!</p>}
    </form>
  );
}
