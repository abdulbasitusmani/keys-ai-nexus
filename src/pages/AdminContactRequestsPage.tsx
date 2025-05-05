
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed';
  created_at: string;
}

const AdminContactRequestsPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRequests = async () => {
      if (!isLoggedIn || !isAdmin) return;
      
      try {
        let query = supabase
          .from('contact_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setRequests(data || []);
      } catch (error: any) {
        console.error('Error fetching contact requests:', error);
        toast({
          title: "Error loading requests",
          description: error.message || "Failed to load contact requests.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, [isLoggedIn, isAdmin, toast, statusFilter]);
  
  const viewDetails = (request: ContactRequest) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };
  
  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: status as 'new' | 'in-progress' | 'completed' } : req
      ));
      
      // Also update selected request if dialog is open
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: status as 'new' | 'in-progress' | 'completed' });
      }
      
      toast({
        title: "Status updated",
        description: `Request status has been updated to "${status}".`,
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: error.message || "Failed to update request status.",
        variant: "destructive",
      });
    }
  };
  
  const deleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact request? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('contact_requests')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setRequests(requests.filter(req => req.id !== id));
      
      // Close dialog if open
      if (selectedRequest && selectedRequest.id === id) {
        setShowDetailsDialog(false);
      }
      
      toast({
        title: "Request deleted",
        description: "The contact request has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error deleting request",
        description: error.message || "Failed to delete contact request.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLoginClick={() => {}} onLogout={() => {}} />
        <main className="flex-grow container py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Loading...</h1>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLoginClick={() => {}} onLogout={() => {}} />
      
      <main className="flex-grow container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-2">Contact Requests</h1>
          <p className="text-lg text-gray-600">
            Manage and respond to customer inquiries from the contact form.
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter contact requests by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-[200px]">
                <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setStatusFilter(null)}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{format(new Date(request.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                      {request.status === 'in-progress' ? 'In Progress' : 
                        request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewDetails(request)}
                      >
                        View
                      </Button>
                      <Select 
                        defaultValue={request.status} 
                        onValueChange={(value) => updateStatus(request.id, value)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No contact requests found with the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      
      <Footer />
      
      {/* Request Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Contact Request Details</DialogTitle>
                <DialogDescription>
                  Submitted on {format(new Date(selectedRequest.created_at), 'MMMM d, yyyy, h:mm a')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="text-lg">{selectedRequest.name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="text-lg">
                    <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">
                      {selectedRequest.email}
                    </a>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedRequest.status)}`}>
                      {selectedRequest.status === 'in-progress' ? 'In Progress' : 
                        selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                    
                    <div className="ml-4">
                      <Select 
                        defaultValue={selectedRequest.status} 
                        onValueChange={(value) => updateStatus(selectedRequest.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Change" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Message</h4>
                  <p className="mt-1 p-4 bg-gray-50 rounded-md whitespace-pre-line">
                    {selectedRequest.message}
                  </p>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                <Button 
                  variant="destructive" 
                  onClick={() => deleteRequest(selectedRequest.id)}
                >
                  Delete
                </Button>
                <Button onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContactRequestsPage;
