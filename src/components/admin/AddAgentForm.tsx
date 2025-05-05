
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AddAgentFormProps {
  onAgentAdded?: () => void;
}

export function AddAgentForm({ onAgentAdded }: AddAgentFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    howToUse: '',
    importance: 'Medium'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('agent-', '')]: value
    }));
  };

  const handleImportanceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      importance: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.includes('json') && !selectedFile.name.endsWith('.json')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a .json file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let jsonFileUrl = null;

      // Upload JSON file to storage if provided
      if (file) {
        // Check if bucket exists and create if needed
        try {
          const { data: bucketData } = await supabase.storage.getBucket('agent-configs');
          if (!bucketData) {
            await supabase.storage.createBucket('agent-configs', { public: false });
          }
        } catch (error: any) {
          // If bucket doesn't exist, create it
          if (error.message && error.message.includes('not found')) {
            await supabase.storage.createBucket('agent-configs', { public: false });
          } else {
            throw error;
          }
        }
        
        const fileName = `${Date.now()}_${file.name}`;
        
        // Upload file
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('agent-configs')
          .upload(fileName, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: urlData } = supabase
          .storage
          .from('agent-configs')
          .getPublicUrl(fileName);
        
        jsonFileUrl = urlData.publicUrl;
      }

      // Insert into database
      const { data, error } = await supabase
        .from('agents')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          how_to_use: formData.howToUse,
          importance: formData.importance,
          json_file_url: jsonFileUrl,
          created_by: user?.id
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Agent Added",
        description: "The agent has been successfully added to the platform.",
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        howToUse: '',
        importance: 'Medium'
      });
      setFile(null);
      
      // Callback for parent component to refresh
      if (onAgentAdded) {
        onAgentAdded();
      }
    } catch (error: any) {
      console.error('Error adding agent:', error);
      toast({
        title: "Error Adding Agent",
        description: error.message || "An error occurred while adding the agent.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-brand-navy">Add New AI Agent</CardTitle>
        <CardDescription>
          Create a new AI agent for your customers. Fill out the form below with the agent details.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name *</Label>
            <Input 
              id="agent-name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-description">Description *</Label>
            <Textarea
              id="agent-description"
              className="min-h-[120px]"
              placeholder="Describe what this agent does and how it helps businesses..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-price">Price ($) *</Label>
            <Input
              id="agent-price"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="29.99"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-howToUse">How to Use</Label>
            <Textarea
              id="agent-howToUse"
              className="min-h-[120px]"
              placeholder="Provide instructions on how to use this agent..."
              value={formData.howToUse}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-importance">Importance *</Label>
            <Select 
              required 
              value={formData.importance} 
              onValueChange={handleImportanceChange}
            >
              <SelectTrigger id="agent-importance">
                <SelectValue placeholder="Select importance level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-json-file">JSON File Upload *</Label>
            <Input
              id="agent-json-file"
              type="file"
              accept=".json,application/json"
              required
              onChange={handleFileChange}
            />
            <p className="text-sm text-gray-500">
              Upload the .json file containing the agent's configuration. Only .json files are accepted.
            </p>
            {file && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                <span className="text-sm text-green-700">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="text-red-600 h-auto p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => {
            setFormData({
              name: '',
              description: '',
              price: '',
              howToUse: '',
              importance: 'Medium'
            });
            setFile(null);
          }}>Cancel</Button>
          <Button 
            type="submit" 
            className="bg-brand-navy hover:bg-opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Add Agent"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
