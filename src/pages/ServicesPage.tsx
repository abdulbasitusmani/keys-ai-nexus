
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AgentCard, Agent } from "@/components/services/AgentCard";
import { AgentFilter } from "@/components/services/AgentFilter";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const ServicesPage = () => {
  const { toast } = useToast();
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setAgents(data);
          setFilteredAgents(data);
        } else {
          // If no agents in the database, use mock data as fallback
          setAgents(mockAgents);
          setFilteredAgents(mockAgents);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: "Error loading agents",
          description: "There was a problem loading the agents. Using sample data instead.",
          variant: "destructive",
        });
        // Use mock data as fallback
        setAgents(mockAgents);
        setFilteredAgents(mockAgents);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgents();
  }, [toast]);
  
  const handleLoginClick = () => {
    setShowAuthForm(true);
  };
  
  const handleFilterChange = (type: "importance" | "price", value: string) => {
    let filtered = [...agents];
    
    // Filter by importance
    if (type === "importance" && value !== "all") {
      filtered = filtered.filter(agent => agent.importance === value);
    }
    
    // Sort by price
    if (type === "price") {
      if (value === "asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (value === "desc") {
        filtered.sort((a, b) => b.price - a.price);
      }
    }
    
    setFilteredAgents(filtered);
  };
  
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
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">AI Agent Services</h1>
          <p className="text-lg text-gray-600">
            Browse our collection of AI agents designed to boost your business productivity.
          </p>
        </div>
        
        <AgentFilter onFilterChange={handleFilterChange} />
        
        {isLoading ? (
          <div className="py-16 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Loading agents...</h3>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
            
            {filteredAgents.length === 0 && (
              <div className="py-16 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No agents found</h3>
                <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </div>
  );
};

// Mock data for agents as fallback
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Email Automation Agent",
    description: "Streamline your email workflow with AI that sorts, prioritizes, and responds to emails based on your preferences and past actions.",
    price: 29.99,
    importance: "Medium",
  },
  {
    id: "2",
    name: "Data Analysis Agent",
    description: "Transform raw data into actionable insights with our AI-powered data analysis tool that automatically identifies trends and patterns.",
    price: 49.99,
    importance: "High",
  },
  {
    id: "3",
    name: "Customer Support Bot",
    description: "Provide 24/7 customer support with an AI agent that handles common questions and routes complex issues to your team.",
    price: 39.99,
    importance: "Medium",
  },
  {
    id: "4",
    name: "Social Media Manager",
    description: "Automate your social media presence with an AI that schedules posts, engages with followers, and analyzes performance metrics.",
    price: 19.99,
    importance: "Low",
  },
  {
    id: "5",
    name: "Content Generation Agent",
    description: "Create high-quality blog posts, product descriptions, and marketing copy with our AI content generator.",
    price: 59.99,
    importance: "High",
  },
  {
    id: "6",
    name: "Meeting Scheduler",
    description: "Let AI handle the back-and-forth of scheduling meetings, finding optimal times based on everyone's availability.",
    price: 14.99,
    importance: "Low",
  },
];

export default ServicesPage;
