import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcryptjs";
import { getFindLogin } from "@/src/actions/actionsAccount";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: { strategy: "jwt" },
  jwt: { maxAge: 60 * 60 * 24 },
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) {
          return null;
        }

        try {
          const user = await getFindLogin(email);

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Erro no authorize:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
