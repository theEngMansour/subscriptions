import langs from "site-settings/site-translations";
import { AuthenticationError } from "apollo-server-micro";

export const isLoggedin = (_, __, { user }) => {
  if (!user) throw new AuthenticationError(langs.ar.authentication);
};