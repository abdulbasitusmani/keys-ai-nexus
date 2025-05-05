
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { AddAgentForm } from "@/components/admin/AddAgentForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Define the Agent type
interface Agent {
  id: string;
  name: string;
  description: string;
  price: number;
  importance: string;
  created_at: string;
  how_to_use?: string;
  json_file_url?: string;
  created_by?: string;
}

const AdminAddAgentPage = () => {
  const { toast } = useToast();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('agents')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error fetching agents",
        description: "Could not load the agent data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      fetchAgents();
    }
  }, [isLoggedIn, isAdmin]);
  
  const handleLoginClick = () => {
    setShowAuthForm(true);
  };
  
  const handleDeleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Agent Deleted",
        description: "The agent has been successfully deleted.",
      });
      
      // Refresh the agents list
      fetchAgents();
    } catch (error: any) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error Deleting Agent",
        description: error.message || "An error occurred while deleting the agent.",
        variant: "destructive",
      });
    }
  };
  
  // If not logged in or not an admin, redirect to home
  if (!isLoading && (!isLoggedIn || !isAdmin)) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin} 
        onLoginClick={handleLoginClick} 
        onLogout={signOut} 
      />
      
      <main className="flex-grow container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Admin Panel</h1>
          <p className="text-lg text-gray-600">
            Use this form to add new AI agents to the platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AddAgentForm onAgentAdded={fetchAgents} />
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold text-brand-navy mb-4">Admin Actions</h2>
            <div className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = "/admin/manage-packages"}
              >
                Manage Packages
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = "/admin/contact-requests"}
              >
                View Contact Requests
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = "/admin/users"}
              >
                Manage Users
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Existing Agents</h2>
          
          {isLoading ? (
            <div className="text-center p-8">Loading agents...</div>
          ) : agents.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Importance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{agent.description}</TableCell>
                      <TableCell>${typeof agent.price === 'number' ? agent.price.toFixed(2) : agent.price}</TableCell>
                      <TableCell>{agent.importance}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => window.location.href = `/admin/edit-agent/${agent.id}`}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAgent(agent.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg border">
              No agents found. Add your first agent using the form above.
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </div>
  );
};

export default AdminAddAgentPage;
