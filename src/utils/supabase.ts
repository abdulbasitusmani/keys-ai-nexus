
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Validates a JSON file for upload
 * @param file The file to validate
 * @returns An object containing validation status and error message if applicable
 */
export const validateJsonFile = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
  // Check file type
  if (!file.type.includes('json') && !file.name.endsWith('.json')) {
    return { isValid: false, error: "Invalid file type. Please upload a JSON file." };
  }
  
  // Check file size (< 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: "File too large. Maximum file size is 5MB." };
  }

  // Validate JSON content
  try {
    const text = await file.text();
    JSON.parse(text);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: "Invalid JSON content. Please check your file." };
  }
};

/**
 * Uploads a JSON file to the Supabase storage
 * @param file The file to upload
 * @returns Object containing upload status and file path or error
 */
export const uploadJsonFile = async (file: File): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw new Error(bucketsError.message);
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'agents');
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createBucketError } = await supabase.storage.createBucket('agents', {
        public: false
      });
      
      if (createBucketError) {
        return { 
          success: false, 
          error: `Could not create 'agents' bucket: ${createBucketError.message}` 
        };
      }
    }
    
    // Validate file
    const validation = await validateJsonFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    // Create file path with unique name to avoid collisions
    const timestamp = new Date().getTime();
    const filePath = `json-files/${timestamp}_${file.name}`;
    
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('agents')
      .upload(filePath, file, {
        contentType: 'application/json',
        upsert: true
      });
      
    if (uploadError) {
      if (uploadError.message.includes('Permission denied')) {
        return { success: false, error: "Permission denied. Please check your authentication status." };
      }
      throw new Error(uploadError.message);
    }
    
    return { success: true, filePath };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred during file upload."
    };
  }
};

/**
 * Fetches agents from the Supabase database with pagination
 * @param page Current page number (1-indexed)
 * @param pageSize Number of items per page
 * @returns Object containing agents data and pagination information
 */
export const fetchAgents = async (page = 1, pageSize = 10) => {
  try {
    // Calculate range for pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      throw new Error(countError.message);
    }
    
    // Fetch paginated data
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .range(start, end)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw new Error(error.message);
    }
    
    return { 
      agents: data || [], 
      totalCount: count || 0,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
      currentPage: page 
    };
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

/**
 * Downloads a JSON file from Supabase storage
 * @param filePath Path of the file to download
 * @returns Promise that resolves when download is complete
 */
export const downloadJsonFile = async (filePath: string): Promise<void> => {
  try {
    toast({
      title: "Downloading file...",
      description: "Your download will begin shortly.",
    });

    const { data, error } = await supabase.storage
      .from('agents')
      .download(filePath);
      
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error("File not found");
    }
    
    // Create download link
    const fileName = filePath.split('/').pop() || 'download.json';
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    toast({
      title: "Error downloading file",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
  }
};
