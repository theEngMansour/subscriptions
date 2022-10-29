import { merge } from "lodash";
import { authResolver } from "./auth";
import { eventResolver } from "./event";
import { bookingResolver } from "./booking";

export const resolvers = merge(
    authResolver, 
    bookingResolver, 
    eventResolver
);