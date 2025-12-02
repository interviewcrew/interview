import { useState } from "react";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useTRPC } from "@/trpc/client";
import { InterviewGetById } from "@/modules/interviews/types";

interface TranscriptProps {
  interview: InterviewGetById;
}

export const Transcript = ({ interview }: TranscriptProps) => {
  const trpc = useTRPC();
  const { data: transcript } = useQuery(
    trpc.interviews.getTranscript.queryOptions({ id: interview.id })
  );

  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = (transcript ?? []).filter((item) =>
    item.text.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
      <p className="text-sm font-medium">Transcript</p>
      <div className="relative">
        <Input
          placeholder="Search transcript"
          className="pl-7 h-9 w-[240px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-y-4">
          {filteredData.map((item) => (
            <div
              key={item.start_ts}
              className="flex items-center gap-y-2 hover:bg-muted p-4 rounded-md border"
            >
              <div className="flex gap-x-2 items-center">
                <Avatar className="size-6">
                  <AvatarImage src={item.user.image ?? ""} />
                </Avatar>
                <p className="text-sm font-medium">{item.user.name}</p>
                <p className="text-sm text-blue-500 font-medium">
                  {format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), "mm:ss")}
                </p>
              </div>
              <Highlighter
                className="text-sm text-neutral-700 ml-2"
                highlightClassName="bg-yellow-200"
                searchWords={[searchQuery]}
                autoEscape={true}
                textToHighlight={item.text.toString()}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
