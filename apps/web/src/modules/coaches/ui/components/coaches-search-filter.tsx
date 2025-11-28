// import from the packages
import { SearchIcon } from "lucide-react";

// import from the components
import { Input } from "@/components/ui/input";

// import from the libraries
import { useCoachFilters } from "@/modules/coaches/hooks/use-coach-filters";

export const CoachesSearchFilter = () => {
    const [filters, setFilters] = useCoachFilters();

    return (
        <div className="relative">
            <Input
                placeholder="Filter by name"
                className="h-9 bg-white w-[200px] pl-7"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
            />
            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
    );
};
