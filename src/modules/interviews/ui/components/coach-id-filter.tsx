import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { useInterviewsFilters } from "@/modules/interviews/hooks/use-interviews-filters";

export const CoachIdFilter = () => {
    const [filters, setFilters] = useInterviewsFilters();

    const [coachSearch, setCoachSearch] = useState("");

    const trpc = useTRPC();
    const {data: coaches} = useQuery(trpc.coaches.getMany.queryOptions({
        pageSize: 100,
        search: coachSearch,
    }));

    return (
        <CommandSelect
            className="h-9"
            placeholder="Coach"
            options={(coaches?.items ?? []).map((coach) => ({
                id: coach.id,
                value: coach.id,
                children: (
                    <div className="flex items-center gap-x-2">
                        <GeneratedAvatar seed={coach.name} variant="botttsNeutral" className="size-4" />
                        {coach.name}
                    </div>
                )
            }))}
            onSelect={(value) => setFilters({coachId: value})}
            onSearch={setCoachSearch}
            value={filters.coachId ?? ""}
        />
    );
};