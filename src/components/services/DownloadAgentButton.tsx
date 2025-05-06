
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

interface DownloadAgentButtonProps {
  agentId: string;
  fileName?: string;
}

export function DownloadAgentButton({ agentId, fileName = "agent-config.json" }: DownloadAgentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      // First, check if the user has purchased this agent
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .select('*')
        .eq('agent_id', agentId)
        .eq('user_id', supabase.auth.getSession().then(res => res.data.session?.user.id))
        .eq('payment_status', 'completed')
        .single();

      if (purchaseError || !purchaseData) {
        toast({
          title: "Access denied",
          description: "You haven't purchased this agent or the purchase is not complete.",
          variant: "destructive",
        });
        return;
      }

      // Get the agent details to find the JSON file URL
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .select('json_file_url')
        .eq('id', agentId)
        .single();

      if (agentError || !agent?.json_file_url) {
        toast({
          title: "Error retrieving agent",
          description: "Could not find the agent's file information.",
          variant: "destructive",
        });
        return;
      }

      // Download the file from Supabase Storage
      const { data, error: downloadError } = await supabase
        .storage
        .from('agents')
        .download(agent.json_file_url);

      if (downloadError || !data) {
        toast({
          title: "Download failed",
          description: "Could not download the agent file.",
          variant: "destructive",
        });
        return;
      }

      // Create a download link and trigger it
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "agent-config.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your agent file is being downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "An error occurred while downloading the file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700"
      size="sm"
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Downloading...
        </span>
      ) : (
        <span className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Download
        </span>
      )}
    </Button>
  );
}
