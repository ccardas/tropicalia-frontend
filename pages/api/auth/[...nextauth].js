import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";

const options = {
  providers: [
    Providers.Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // const user = await axios({
        //   method: "post",
        //   url: "http://0.0.0.0:8001/api/v1/auth/login",
        //   headers: {
        //     accept: '*/*',
        //     'Content-Type': 'application/json'
        //   },
        //   data: {
        //     user: {
        //       username: credentials.username,
        //       password: credentials.password
        //     }
        //   }
        // });

        let user;

        if (credentials.username == "demo" && credentials.password == "demo") {
          user = {
            id: 1,
            name: "Demo",
            email: "username@demo.com",
          };
        }

        if (user) {
          return user;
        } else {
          return null;
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
