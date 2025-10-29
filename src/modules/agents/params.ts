// import from the packages
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

// import from the libraries
import { DEFAULT_PAGE } from "@/constants";

export const searchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(searchParams);
