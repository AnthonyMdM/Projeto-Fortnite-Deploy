'use client'
import { actionLogin } from "@/src/actions/actionsAccount";
import { useState } from "react";

export default function LoginPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await actionLogin(formData);
    setErrors(result.errors);
    setSuccess(result.success);
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-md mx-auto mt-16 p-6 rounded-2xl border border-zinc-700 bg-zinc-900/60 space-y-4"
    >
      <h1 className="text-2xl font-bold text-center text-white">Entrar</h1>

      <input
        name="email"
        placeholder="E-mail"
        className="w-full p-2 rounded bg-zinc-800 text-white"
      />
      <input
        name="password"
        type="password"
        placeholder="Senha"
        className="w-full p-2 rounded bg-zinc-800 text-white"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold"
      >
        Entrar
      </button>

      {errors.length > 0 && (
        <div className="text-red-400 text-sm mt-2 space-y-1">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
      {success && (
        <p className="text-green-400">Login realizado com sucesso!</p>
      )}
    </form>
  );
}
