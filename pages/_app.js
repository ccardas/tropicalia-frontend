import Head from "next/head";
import { Provider } from "next-auth/client";

import "antd/dist/antd.css";
import "../styles/globals.css";
import "../public/css/custom-styles.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider
        session={pageProps.session}
        options={{
          basePath: `/api/auth`,
        }}
      >
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>TROPICAL-IA</title>
        </Head>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
