import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials: any) {
        if (
          credentials.username === "admin" &&
          credentials.password === "admin"
        ) {
          return {
            id: "1",
            name: "Admin User",
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
}
