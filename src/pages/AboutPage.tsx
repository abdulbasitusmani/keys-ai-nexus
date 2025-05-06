
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AboutPage = () => {
  const { toast } = useToast();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  
  const handleLoginClick = () => {
    setShowAuthForm(true);
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
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">About Keys-AI</h1>
          <p className="text-lg text-gray-600">
            Learn about our mission to revolutionize real estate with artificial intelligence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Keys-AI was founded in 2025 with a simple mission: to make real estate transactions 
              smoother and more efficient through the power of artificial intelligence.
            </p>
            <p className="text-gray-700 mb-4">
              What started as a small project to help a few local realtors has grown into a 
              comprehensive platform serving thousands of real estate professionals across the country.
            </p>
            <p className="text-gray-700">
              Our team of AI specialists and real estate experts work together to develop cutting-edge 
              solutions that address the most pressing challenges in the industry.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              We believe that AI should augment human expertise, not replace it. Our AI agents are 
              designed to handle routine tasks, analyze complex data, and provide insights that help 
              real estate professionals make better decisions.
            </p>
            <p className="text-gray-700">
              By automating the mundane and illuminating the complex, we free up real estate 
              professionals to focus on what matters most: building relationships and closing deals.
            </p>
          </div>
        </div>
        
        <div className="mt-12 bg-brand-navy text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p>
                We continuously push the boundaries of what AI can do in the real estate industry.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p>
                Our agents are built to be dependable tools that you can count on day in and day out.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
              <p>
                We make advanced AI technology accessible to real estate professionals of all sizes.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </div>
  );
};

export default AboutPage;
