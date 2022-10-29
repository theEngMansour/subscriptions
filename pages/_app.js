import msgs from "site-settings/site-translations";
import { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";
import { AuthContextProvider } from "contexts";
import { setContext } from "@apollo/client/link/context";
import { IntlProvider } from "react-intl";
import { MainLayout } from "layouts";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);
  const locale = "ar";

  const httpLink = createHttpLink({
    uri: "/api/graphql",
    credentials: "same-origin",
  }); 

  const authLink = setContext((_, { headers }) => {
    const cookies = new URLSearchParams(
      document.cookie.replaceAll("&", "%26").replaceAll("; ", "&")
    );
    const token = cookies.get("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) return null;

  return (
    <AuthContextProvider>
      <ApolloProvider client={client}>
        <IntlProvider locale={locale} messages={msgs[locale]}>
          <MainLayout>
            {typeof window === undefined ? <></> : <Component {...pageProps} />}
          </MainLayout>
        </IntlProvider>
      </ApolloProvider>
    </AuthContextProvider>
  );
}