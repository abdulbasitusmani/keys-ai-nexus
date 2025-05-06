
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAgents, downloadJsonFile } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Updated Agent interface to match database schema
interface Agent {
  id: string;
  name: string;
  description: string | null;
  json_file_url: string;
  created_at: string;
  importance: string;
  how_to_use?: string | null;
}

const ServicesPage = () => {
  const { toast } = useToast();
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const result = await fetchAgents(pagination.currentPage, 10);
        setAgents(result.agents);
        setPagination({
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalCount: result.totalCount
        });
      } catch (error) {
        toast({
          title: "Error fetching agents",
          description: error instanceof Error ? error.message : "Failed to load agent data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAgents();
  }, [pagination.currentPage, toast]);
  
  const handleLoginClick = () => {
    setShowAuthForm(true);
  };

  const handleDownload = async (filePath: string) => {
    await downloadJsonFile(filePath);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };
  
  const renderPaginationItems = () => {
    const items = [];
    const maxPages = Math.min(5, pagination.totalPages);
    
    let startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);
    
    // Adjust start page if necessary to show maximum number of pages
    startPage = Math.max(1, endPage - maxPages + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={pagination.currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
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
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Our Services</h1>
          <p className="text-lg text-gray-600">
            Browse our collection of AI agents and their capabilities.
          </p>
        </div>
        
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center p-16">
              <svg className="animate-spin h-12 w-12 mx-auto text-brand-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-700">Loading agents...</p>
            </div>
          ) : agents.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>File</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>{agent.description || "No description available"}</TableCell>
                        <TableCell>{new Date(agent.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(agent.json_file_url)}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                          className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                          className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-16 bg-gray-50 rounded-lg border">
              <p className="text-lg font-medium text-gray-700">No agents found.</p>
              <p className="mt-2 text-gray-500">Add your first agent using the admin panel.</p>
              {isAdmin && (
                <Button 
                  className="mt-4 bg-brand-navy hover:bg-opacity-90"
                  onClick={() => window.location.href = "/admin/upload"}
                >
                  Add Agent
                </Button>
              )}
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

export default ServicesPage;
