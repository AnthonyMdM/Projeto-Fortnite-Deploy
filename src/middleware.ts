import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "@auth/core/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const blockedForLogged = ["/login", "/register"];

  // Se a rota NÃO estiver na lista, deixar passar
  if (!blockedForLogged.includes(pathname)) {
    return NextResponse.next();
  }
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET!,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isLoggedIn = !!token;

  // Se está logado E tentando acessar login/register → REDIRECIONA
  if (isLoggedIn) {
    return NextResponse.redirect(new URL("/shop", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
