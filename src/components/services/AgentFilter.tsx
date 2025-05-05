
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AgentFilterProps {
  onFilterChange: (type: "importance" | "price", value: string) => void;
}

export function AgentFilter({ onFilterChange }: AgentFilterProps) {
  const [importance, setImportance] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("none");

  const handleImportanceChange = (value: string) => {
    setImportance(value);
    onFilterChange("importance", value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange("price", value);
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-8 bg-gray-50 p-4 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="importance-filter">Filter by Importance</Label>
        <Select value={importance} onValueChange={handleImportanceChange}>
          <SelectTrigger id="importance-filter" className="w-full sm:w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort-by">Sort by Price</Label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger id="sort-by" className="w-full sm:w-[180px]">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
