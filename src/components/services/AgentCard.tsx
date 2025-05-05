
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Agent {
  id: string;
  name: string;
  description: string;
  price: number;
  importance: "High" | "Medium" | "Low";
  how_to_use?: string;
  json_file_url?: string;
  created_at?: string;
  created_by?: string;
}

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const importanceColors = {
    High: "bg-red-100 text-red-800 hover:bg-red-200",
    Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Low: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  return (
    <Card className="hover-lift h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-brand-navy">{agent.name}</CardTitle>
          <Badge className={importanceColors[agent.importance]}>
            {agent.importance}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">
          {agent.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <p className="font-bold text-lg text-brand-navy">
          ${agent.price.toFixed(2)}
        </p>
        <Link
          to={`/services/${agent.id}`}
          className="px-4 py-2 bg-brand-navy text-white rounded hover:bg-opacity-90 transition-colors"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
