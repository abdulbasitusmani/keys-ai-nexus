import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCard } from "@/components/packages/PricingCard";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const PackagesPage = () => {
  const { toast } = useToast();
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Convert the packages data from Supabase to the PricingTier format
          const formattedPackages: PricingTier[] = data.map(pkg => {
            // Parse features if they're stored as a JSON string
            let features: string[] = [];
            try {
              if (typeof pkg.features === 'string') {
                features = JSON.parse(pkg.features);
              } else if (Array.isArray(pkg.features)) {
                // Convert each item in the array to a string
                features = pkg.features.map(item => String(item));
              } else if (pkg.features && typeof pkg.features === 'object') {
                // Handle case where features might be a JSONB object
                features = Object.values(pkg.features).map(val => String(val));
              }
            } catch (e) {
              // Fallback if parsing fails
              console.error('Error parsing features:', e);
              features = ['Error loading features'];
            }

            return {
              id: pkg.id,
              name: pkg.name,
              description: pkg.description,
              price: pkg.price,
              features: features,
              isPopular: pkg.is_popular || false
            };
          });
          
          setPackages(formattedPackages);
        } else {
          // If no packages in the database, use mock data as fallback
          setPackages(pricingTiers);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast({
          title: "Error loading packages",
          description: "There was a problem loading the packages. Using sample data instead.",
          variant: "destructive",
        });
        // Use mock data as fallback
        setPackages(pricingTiers);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPackages();
  }, [toast]);
  
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
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-brand-navy to-blue-900 text-white py-16">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose the Right Plan for Your Business</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Our flexible subscription plans are designed to scale with your business needs.
            </p>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container">
            {isLoading ? (
              <div className="py-16 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Loading packages...</h3>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {packages.map((tier) => (
                  <PricingCard key={tier.id} tier={tier} />
                ))}
              </div>
            )}
            
            <div className="mt-16 bg-white p-8 rounded-lg border text-center">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">Not sure which plan is right for you?</h2>
              <p className="text-gray-600 mb-6">
                Our team can help you determine the best solution for your business needs.
                Contact us for a personalized recommendation.
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-brand-navy text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Contact Sales
              </a>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-bold text-brand-navy mb-4">Frequently Asked Questions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-bold text-lg mb-2">Can I upgrade my plan later?</h4>
                  <p className="text-gray-600">
                    Yes, you can upgrade your plan at any time. Your billing will be prorated for the remainder of the billing cycle.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-bold text-lg mb-2">How does billing work?</h4>
                  <p className="text-gray-600">
                    All plans are billed monthly. You can cancel your subscription at any time from your account settings.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-bold text-lg mb-2">What happens if I exceed my plan limits?</h4>
                  <p className="text-gray-600">
                    We'll notify you if you're approaching your limits. If you exceed them, additional operations will be billed at our standard rate.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-bold text-lg mb-2">Can I try before I buy?</h4>
                  <p className="text-gray-600">
                    We offer a 14-day free trial on all plans. No credit card required to start your trial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </div>
  );
};

// Mock data for pricing tiers as fallback
const pricingTiers: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    description: "For individuals and small businesses just getting started",
    price: 29,
    features: [
      "Access to 1 AI agent",
      "Basic email support",
      "Standard integration options",
      "Monthly usage reports",
      "Up to 1,000 operations per month",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses with advanced needs",
    price: 99,
    features: [
      "Access to 5 AI agents",
      "Priority email and chat support",
      "Advanced integration options",
      "Weekly performance reports",
      "Up to 10,000 operations per month",
      "Custom agent training",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations requiring comprehensive solutions",
    price: "Custom",
    features: [
      "Unlimited AI agents",
      "24/7 dedicated support",
      "Enterprise-grade integrations",
      "Real-time reporting dashboard",
      "Unlimited operations",
      "Custom agent development",
      "Dedicated account manager",
      "Service level agreement (SLA)",
    ],
  },
];

export default PackagesPage;
