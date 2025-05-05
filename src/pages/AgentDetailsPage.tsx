
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Mock data for a single agent
const mockAgents = {
  "1": {
    id: "1",
    name: "Email Automation Agent",
    description: "Streamline your email workflow with AI that sorts, prioritizes, and responds to emails based on your preferences and past actions. This agent integrates with popular email platforms like Gmail, Outlook, and more.",
    price: 29.99,
    importance: "Medium",
    howToUse: "After purchasing, download the provided .json file and import it into your email management system. Follow the setup guide to configure the agent according to your preferences.",
    faqs: [
      {
        question: "What can this agent do?",
        answer: "This agent can sort incoming emails by priority, generate automatic responses for common inquiries, flag important messages, and learn from your behaviors to improve over time."
      },
      {
        question: "Is it customizable?",
        answer: "Yes, the agent is fully customizable. You can set up specific rules, response templates, and priority criteria to match your specific needs."
      },
      {
        question: "Which email platforms are supported?",
        answer: "Our agent works with Gmail, Outlook, Yahoo Mail, and most other IMAP/POP3 email services. Integration is simple with our step-by-step guide."
      },
      {
        question: "Do I need technical knowledge to set it up?",
        answer: "No, the setup process is designed to be user-friendly. Basic familiarity with your email platform is all you need."
      },
    ]
  },
  "2": {
    id: "2",
    name: "Data Analysis Agent",
    description: "Transform raw data into actionable insights with our AI-powered data analysis tool that automatically identifies trends and patterns. Perfect for businesses looking to leverage their data for strategic decision-making.",
    price: 49.99,
    importance: "High",
    howToUse: "Import the agent configuration file into your business intelligence platform. The agent will begin analyzing your data sources and generating insights immediately.",
    faqs: [
      {
        question: "What types of data can this agent analyze?",
        answer: "Our agent can work with structured data from spreadsheets, databases, and most business applications. It excels at numerical data, time series, and categorical information."
      },
      {
        question: "How does it present insights?",
        answer: "The agent generates visual reports with charts, graphs, and written summaries highlighting key trends and anomalies in your data."
      },
      {
        question: "Can it integrate with our existing tools?",
        answer: "Yes, the Data Analysis Agent integrates with popular platforms like Excel, Google Sheets, SQL databases, and most BI tools."
      },
      {
        question: "How often does it update its analysis?",
        answer: "You can schedule analysis runs hourly, daily, weekly, or trigger them manually when needed."
      },
    ]
  },
  // Add more mock data as needed
};

const importanceColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

const AgentDetailsPage = () => {
  const { toast } = useToast();
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { isLoggedIn, isAdmin, signOut, user } = useAuth();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agent, setAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch the agent data from Supabase or use mock data
  useEffect(() => {
    const fetchAgent = async () => {
      setIsLoading(true);
      
      try {
        // First try to fetch from Supabase
        if (agentId) {
          const { data, error } = await supabase
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single();
          
          if (error) {
            console.error('Error fetching agent:', error);
            // Fallback to mock data if not found in database
            setAgent(mockAgents[agentId]);
          } else {
            setAgent(data);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setAgent(agentId ? mockAgents[agentId] : null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgent();
  }, [agentId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          isAdmin={isAdmin} 
          onLoginClick={() => setShowAuthForm(true)} 
          onLogout={signOut} 
        />
        
        <main className="flex-grow container py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading...</h1>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          isAdmin={isAdmin} 
          onLoginClick={() => setShowAuthForm(true)} 
          onLogout={signOut} 
        />
        
        <main className="flex-grow container py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Agent Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The agent you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate('/services')}>
            Back to Services
          </Button>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  const handleLoginClick = () => {
    setShowAuthForm(true);
  };
  
  const handlePurchase = () => {
    console.log("Purchase button clicked, isLoggedIn:", isLoggedIn);
    // Only show login if user is truly not logged in
    if (!isLoggedIn) {
      setShowAuthForm(true);
      return;
    }
    
    // If logged in, proceed to payment dialog
    setShowPaymentDialog(true);
  };
  
  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create a purchase record in the database
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: user?.id,
          agent_id: agent.id,
          payment_status: 'pending'
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentDialog(false);
        
        toast({
          title: "Purchase Successful",
          description: "You have successfully purchased this agent.",
        });
        
        // Update purchase status to completed
        if (data && data[0]) {
          supabase
            .from('purchases')
            .update({ payment_status: 'completed' })
            .eq('id', data[0].id);
        }
      }, 2000);
    } catch (error: any) {
      console.error('Purchase error:', error);
      setIsProcessing(false);
      
      toast({
        title: "Purchase Failed",
        description: error.message || "An error occurred during purchase.",
        variant: "destructive",
      });
    }
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
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={importanceColors[agent.importance]}>
                  {agent.importance} Priority
                </Badge>
                <span className="text-gray-500">ID: {agent.id}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">{agent.name}</h1>
              <p className="text-lg text-gray-600">
                {agent.description}
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-brand-navy mb-4">How This Agent Helps Your Business</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-4">
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Saves time by automating repetitive tasks</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Reduces human error and improves accuracy</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Scales with your business without additional staffing</span>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Provides actionable insights to optimize processes</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-brand-navy mb-4">How to Use</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">{agent.howToUse || "After purchasing, you'll receive detailed instructions on how to implement and use this agent in your business workflow."}</p>
              </div>
            </div>
            
            {agent.faqs && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="bg-gray-50 rounded-lg">
                  {agent.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="px-6 hover:no-underline hover:text-brand-navy">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-white rounded-lg border p-6 sticky top-20">
              <div className="text-center mb-4">
                <h3 className="text-3xl font-bold text-brand-navy">${typeof agent.price === 'number' ? agent.price.toFixed(2) : agent.price}</h3>
                <p className="text-gray-500">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-gray-700">Instant download after purchase</span>
                </div>
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-gray-700">30-day money-back guarantee</span>
                </div>
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-gray-700">Free technical support</span>
                </div>
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-gray-700">Regular updates included</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-brand-gold hover:bg-opacity-90 text-white py-6"
                onClick={handlePurchase}
              >
                Purchase Now
              </Button>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Secure payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
      
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Enter your payment details to purchase {agent.name} for ${typeof agent.price === 'number' ? agent.price.toFixed(2) : agent.price}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name on Card</Label>
              <Input id="name" placeholder="John Smith" />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              className="bg-brand-navy hover:bg-opacity-90" 
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay $${typeof agent.price === 'number' ? agent.price.toFixed(2) : agent.price}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentDetailsPage;
