// import from the packages
import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
  parseAsStringEnum,
} from "nuqs";

// import from the libraries
import { DEFAULT_PAGE } from "@/constants";
import { InterviewStatus } from "@/modules/interviews/types";

export const useInterviewsFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
    coachId: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(InterviewStatus)),
  });
};
