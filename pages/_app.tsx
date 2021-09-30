/* eslint-disable sort-imports */
import "reflect-metadata";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { useApollo } from "lib/with_apollo";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo({ pageProps });
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
