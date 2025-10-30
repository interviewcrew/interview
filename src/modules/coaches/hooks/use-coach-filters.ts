// import from the packages
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

// import from the libraries
import { DEFAULT_PAGE } from "@/constants";

export const useCoachFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
  });
};
