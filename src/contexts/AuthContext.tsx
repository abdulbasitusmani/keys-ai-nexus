
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Effect for special admin user (for demo purposes)
  useEffect(() => {
    const checkForAdminUser = async () => {
      if (user?.email === 'abdulbasitusmani10@gmail.com') {
        // Set this special user as admin
        try {
          // First check if there's already a profile
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError && !profileError.message.includes('No rows found')) {
            console.error('Error checking profile:', profileError);
            return;
          }
          
          if (!existingProfile) {
            // Create profile if it doesn't exist
            await supabase
              .from('profiles')
              .insert({
                id: user.id,
                first_name: 'Admin',
                last_name: 'User',
                role: 'admin'
              });
          } else if (existingProfile.role !== 'admin') {
            // Update to admin if not already
            await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', user.id);
          }
          
          setIsAdmin(true);
        } catch (error) {
          console.error('Error setting admin:', error);
        }
      }
    };
    
    if (user) {
      checkForAdminUser();
    }
  }, [user]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session?.user);
        
        // If user logged out, clear profile
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAdmin(false);
          setIsLoggedIn(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
        setIsAdmin(data?.role === 'admin');
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
      }
    };

    // Use setTimeout to prevent blocking the UI during auth state change
    if (user) {
      setTimeout(() => {
        fetchProfile();
      }, 0);
    }
  }, [user]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    isLoggedIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
