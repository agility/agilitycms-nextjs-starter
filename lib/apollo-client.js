import { ApolloClient, InMemoryCache } from "@apollo/client";

// default options for apollo to disable their caching
const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

// set up our apollo client
const client = new ApolloClient({
  uri: `https://api.aglty.io/v1/${process.env.AGILITY_GUID}/fetch/${process.env.AGILITY_LOCALES}/graphql`,
  cache: new InMemoryCache(),
  defaultOptions,
});

export default client;
