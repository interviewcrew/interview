// import from the packages
import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

// import from the libraries
import { DEFAULT_PAGE } from "@/constants";
import { InterviewStatus } from "@/modules/interviews/types";

export const searchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  coachId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(InterviewStatus)),
};

export const loadSearchParams = createLoader(searchParams);
