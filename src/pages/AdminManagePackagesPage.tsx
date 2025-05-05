
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
  CardFooter, 
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number | string;
  features: string[];
  is_popular: boolean;
}

const AdminManagePackagesPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [packageFeatures, setPackageFeatures] = useState<string[]>([]);
  const [newPackage, setNewPackage] = useState<Omit<Package, 'id'>>({
    name: '',
    description: '',
    price: '',
    features: [],
    is_popular: false
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  useEffect(() => {
    const fetchPackages = async () => {
      if (!isLoggedIn || !isAdmin) return;
      
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setPackages(data || []);
      } catch (error: any) {
        console.error('Error fetching packages:', error);
        toast({
          title: "Error loading packages",
          description: error.message || "Failed to load packages data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPackages();
  }, [isLoggedIn, isAdmin, toast]);
  
  const openFeatureDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
    setPackageFeatures(Array.isArray(pkg.features) ? pkg.features : []);
    setShowFeatureDialog(true);
  };
  
  const addFeature = () => {
    if (!newFeature.trim()) return;
    setPackageFeatures([...packageFeatures, newFeature]);
    setNewFeature("");
  };
  
  const removeFeature = (index: number) => {
    const updatedFeatures = [...packageFeatures];
    updatedFeatures.splice(index, 1);
    setPackageFeatures(updatedFeatures);
  };
  
  const saveFeatures = async () => {
    if (!selectedPackage) return;
    
    try {
      const { error } = await supabase
        .from('packages')
        .update({ features: packageFeatures })
        .eq('id', selectedPackage.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setPackages(packages.map(pkg => 
        pkg.id === selectedPackage.id ? { ...pkg, features: packageFeatures } : pkg
      ));
      
      toast({
        title: "Features updated",
        description: "Package features have been updated successfully.",
      });
      
      setShowFeatureDialog(false);
    } catch (error: any) {
      console.error('Error updating features:', error);
      toast({
        title: "Error updating features",
        description: error.message || "Failed to update package features.",
        variant: "destructive",
      });
    }
  };
  
  const togglePopular = async (pkg: Package) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ is_popular: !pkg.is_popular })
        .eq('id', pkg.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setPackages(packages.map(p => 
        p.id === pkg.id ? { ...p, is_popular: !pkg.is_popular } : p
      ));
      
      toast({
        title: "Package updated",
        description: `Package '${pkg.name}' ${!pkg.is_popular ? 'is now' : 'is no longer'} marked as popular.`,
      });
    } catch (error: any) {
      console.error('Error updating package:', error);
      toast({
        title: "Error updating package",
        description: error.message || "Failed to update package.",
        variant: "destructive",
      });
    }
  };
  
  const deletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setPackages(packages.filter(pkg => pkg.id !== id));
      
      toast({
        title: "Package deleted",
        description: "The package has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error deleting package",
        description: error.message || "Failed to delete package.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddPackage = async () => {
    try {
      // Validate package data
      if (!newPackage.name || !newPackage.description || !newPackage.price) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('packages')
        .insert({
          name: newPackage.name,
          description: newPackage.description,
          price: typeof newPackage.price === 'string' ? 
            newPackage.price === 'Custom' ? 'Custom' : parseFloat(newPackage.price) : 
            newPackage.price,
          features: newPackage.features,
          is_popular: newPackage.is_popular
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setPackages([...packages, data[0]]);
      
      // Reset form
      setNewPackage({
        name: '',
        description: '',
        price: '',
        features: [],
        is_popular: false
      });
      
      setShowAddDialog(false);
      
      toast({
        title: "Package added",
        description: "The new package has been added successfully.",
      });
    } catch (error: any) {
      console.error('Error adding package:', error);
      toast({
        title: "Error adding package",
        description: error.message || "Failed to add new package.",
        variant: "destructive",
      });
    }
  };
  
  const handleNewFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeature(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-2">Manage Packages</h1>
            <p className="text-lg text-gray-600">
              Create and manage subscription packages for your customers.
            </p>
          </div>
          
          <Button 
            className="bg-brand-navy hover:bg-opacity-90"
            onClick={() => setShowAddDialog(true)}
          >
            Add New Package
          </Button>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{pkg.description}</TableCell>
                  <TableCell>{typeof pkg.price === 'number' ? `$${pkg.price}` : pkg.price}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openFeatureDialog(pkg)}
                    >
                      Manage Features ({Array.isArray(pkg.features) ? pkg.features.length : 0})
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={pkg.is_popular} 
                      onCheckedChange={() => togglePopular(pkg)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deletePackage(pkg.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {packages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No packages found. Use the "Add New Package" button to create your first package.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      
      <Footer />
      
      {/* Features Dialog */}
      <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Features</DialogTitle>
            <DialogDescription>
              Add or remove features for the "{selectedPackage?.name}" package.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Add a new feature..." 
                value={newFeature}
                onChange={handleNewFeatureChange}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" onClick={addFeature} className="shrink-0">
                Add
              </Button>
            </div>
            
            {packageFeatures.length > 0 ? (
              <div className="space-y-2">
                {packageFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <span>{feature}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 h-auto p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                No features yet. Add your first feature above.
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeatureDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveFeatures}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Package Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Package</DialogTitle>
            <DialogDescription>
              Create a new subscription package for your customers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="package-name">Package Name *</Label>
              <Input 
                id="package-name" 
                value={newPackage.name}
                onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="package-description">Description *</Label>
              <Textarea 
                id="package-description" 
                value={newPackage.description}
                onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="package-price">Price *</Label>
              <Input 
                id="package-price" 
                value={newPackage.price}
                onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                placeholder="29.99 or 'Custom'"
                required
              />
              <p className="text-xs text-gray-500">Enter a number or "Custom" for custom pricing</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="package-popular">Mark as Popular</Label>
              <Switch 
                id="package-popular"
                checked={newPackage.is_popular}
                onCheckedChange={(checked) => setNewPackage({...newPackage, is_popular: checked})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPackage}>
              Add Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagePackagesPage;
