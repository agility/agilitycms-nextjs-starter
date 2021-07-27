import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";

function MyApp({ Component, pageProps }) {
  // wrap our site with the apollo provider, passing in our client
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
