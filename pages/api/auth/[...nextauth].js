import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import FormData from "form-data";

const options = {
  providers: [
    Providers.Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Nombre de usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials.username;
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", credentials.password);

        const res = await fetch("http://0.0.0.0:8001/api/v1/auth/login", {
          method: "POST",
          header: { "Content-Type": "application/json" },
          body: formData,
        });

        if (res.ok) {
          var user = await res.json();
          user = {...{access_token: user.access_token}, ...{name: username}}
          console.log(user)
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      // This JSON Web Token callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client)
      if (user?.access_token) {
        token.accessToken = user.access_token
      }
      return token
    },
    async session(session, token) {
      // The session callback is called whenever a session is checked
      session.accessToken = token.accessToken;
      return session
    }
  },
  session: {
    jwt: true,
    maxAge: 1 * 24 * 60 * 60, // 1 day
    updateAge: 6 * 60 * 60, // 6 hours
  },
};

export default (req, res) => NextAuth(req, res, options);
