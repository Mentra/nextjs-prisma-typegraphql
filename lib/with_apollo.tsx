import { ApolloClient, createHttpLink } from "@apollo/client";
import { InMemoryCache, NormalizedCacheObject } from "@apollo/client/cache";
import { getPublicRuntimeConfig } from "./utils";
import { GetServerSidePropsContext } from "next";
import { useMemo } from "react";

interface ContextAndState {
  context?: GetServerSidePropsContext;
  initialState?: NormalizedCacheObject;
}

const publicRuntimeConfig = getPublicRuntimeConfig();

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

function createApolloClient({
  context,
  initialState
}: ContextAndState): ApolloClient<NormalizedCacheObject> {
  const isBrowser = typeof window !== "undefined";

  const enhancedFetch = (url: RequestInfo, init: RequestInit) => {
    return fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        "Access-Control-Allow-Origin": "*",
        Cookie: context?.req?.headers?.cookie || ""
      }
    }).then((response) => response);
  };

  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: isBrowser,
    link: createHttpLink({
      credentials: "include",
      fetch: enhancedFetch,
      fetchOptions: {
        mode: "cors"
      },
      headers: {
        ...(initialState?.headers || {}),
        cookie: context?.req?.headers?.cookie
      },
      uri: publicRuntimeConfig.API_ENDPOINT
    }),
    ssrMode: !isBrowser // Disables forceFetch on the server (so queries are only run once)
  });
}

export function initializeApollo({
  context,
  initialState
}: ContextAndState): ApolloClient<NormalizedCacheObject> {
  const _apolloClient =
    apolloClient ?? createApolloClient({ context, initialState });

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = { ...initialState, ...existingCache } as NormalizedCacheObject;

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") {
    return _apolloClient;
  }
  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: { props: Record<string, any> }
): { props: Record<string, any> } {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo({
  context,
  pageProps
}: {
  context?: GetServerSidePropsContext;
  pageProps: Record<string, any>;
}) {
  const initialState = pageProps[
    APOLLO_STATE_PROP_NAME
  ] as NormalizedCacheObject;
  const store = useMemo(() => initializeApollo({ context, initialState }), [
    context,
    initialState
  ]);
  return store;
}
