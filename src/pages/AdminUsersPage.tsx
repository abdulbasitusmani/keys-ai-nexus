
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

const AdminUsersPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isLoggedIn || !isAdmin) return;
      
      try {
        // We need to join the auth.users and public.profiles tables
        // Since we can't directly query auth.users from the client, we'll use profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('role', { ascending: false });
        
        if (profilesError) {
          throw profilesError;
        }
        
        // Now we need to get the email from auth.users
        // This would normally be done with a join, but we can't do that from the client
        // Instead, we'll fetch the relevant user data for each profile
        
        // For demonstration purposes, we'll create some mock data that includes all fields
        // In a real application, you would use edge functions or RLS policies to
        // properly join this data securely
        
        const mockUserData: UserProfile[] = profiles.map(profile => ({
          id: profile.id,
          email: profile.id === '9c8ce9ef-246c-436c-b252-018726c98274' ? 
            'abdulbasitusmani10@gmail.com' : `user-${profile.id.slice(0, 6)}@example.com`,
          first_name: profile.first_name || '(Not set)',
          last_name: profile.last_name || '(Not set)',
          role: profile.role,
          created_at: profile.created_at
        }));
        
        setUsers(mockUserData);
        setFilteredUsers(mockUserData);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error loading users",
          description: error.message || "Failed to load user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [isLoggedIn, isAdmin, toast]);
  
  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const updateRole = async (userId: string, currentRole: string) => {
    // For security, don't allow changing roles of admin users
    if (currentRole === 'admin') {
      toast({
        title: "Cannot modify admin",
        description: "For security reasons, admin roles cannot be changed through this interface.",
        variant: "destructive",
      });
      return;
    }
    
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setFilteredUsers(filteredUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Role updated",
        description: `User role has been updated to "${newRole}".`,
      });
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Error updating role",
        description: error.message || "Failed to update user role.",
        variant: "destructive",
      });
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
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-2">User Management</h1>
          <p className="text-lg text-gray-600">
            View and manage user accounts for your platform.
          </p>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-md"
          />
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : '(Not set)'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Button 
                      variant={user.role === 'admin' ? "destructive" : "outline"} 
                      size="sm"
                      onClick={() => updateRole(user.id, user.role)}
                      disabled={user.email === 'abdulbasitusmani10@gmail.com'} // Prevent changing the primary admin
                    >
                      {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchQuery 
                      ? `No users found matching "${searchQuery}"`
                      : "No users found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminUsersPage;
