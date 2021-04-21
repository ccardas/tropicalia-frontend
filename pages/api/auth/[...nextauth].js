import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user;

        if (credentials.username == "demo" && credentials.password == "demo") {
          user = {
            id: 1,
            name: "Demo",
            email: "username@demo.com",
          };
        }

        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.reject(new Error('error message'))
        }
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 1 * 24 * 60 * 60, // 1 day
    updateAge: 6 * 60 * 60, // 6 hours
  },
};

export default (req, res) => NextAuth(req, res, options);
