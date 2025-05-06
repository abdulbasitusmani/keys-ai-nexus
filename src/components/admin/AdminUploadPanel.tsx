
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadJsonFile } from "@/utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

interface FormData {
  name: string;
  description: string;
}

export function AdminUploadPanel() {
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: ''
  });

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('adminUploadFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [id.replace('agent-', '')]: value };
      // Save to localStorage as we type
      localStorage.setItem('adminUploadFormData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Agent name is required");
      }

      if (!file) {
        throw new Error("Please select a JSON file");
      }

      // Upload file
      const uploadResult = await uploadJsonFile(file);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Save agent data to database
      const { error: insertError } = await supabase
        .from('agents')
        .insert({
          name: formData.name,
          description: formData.description,
          json_file_url: uploadResult.filePath,
          importance: "Medium" // Adding a default value for the required importance field
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast({
        title: "Agent added successfully!",
        description: "Your agent has been added to the database.",
      });
      
      // Reset form
      setFormData({ name: '', description: '' });
      setFile(null);
      
      // Clear localStorage
      localStorage.removeItem('adminUploadFormData');
      
    } catch (error) {
      console.error('Error adding agent:', error);
      toast({
        title: "Error adding agent",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      // Keep form data in localStorage for recovery
      localStorage.setItem('adminUploadFormData', JSON.stringify(formData));
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not logged in
  if (!isLoading && !isLoggedIn) {
    toast({
      title: "Authentication required",
      description: "Please log in to access the admin panel.",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-brand-navy">Add New Agent</CardTitle>
        <CardDescription>
          Upload a new agent configuration file and details. Make sure the JSON file is correctly formatted.
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
            <Label htmlFor="agent-description">Description</Label>
            <Textarea
              id="agent-description"
              className="min-h-[120px]"
              placeholder="Describe what this agent does..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-json-file">JSON File *</Label>
            <Input
              id="agent-json-file"
              type="file"
              accept=".json,application/json"
              required
              onChange={handleFileChange}
            />
            <p className="text-sm text-gray-500">
              Upload the .json file containing the agent's configuration. Only .json files are accepted (max 5MB).
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
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => {
              setFormData({
                name: '',
                description: '',
              });
              setFile(null);
              localStorage.removeItem('adminUploadFormData');
            }}
          >
            Clear
          </Button>
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
                Uploading...
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
