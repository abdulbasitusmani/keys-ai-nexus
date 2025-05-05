
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AboutPage = () => {
  const { toast } = useToast();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const handleLoginClick = () => {
    setShowAuthForm(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  const teamMembers = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      bio: "John has over 15 years of experience in AI and machine learning. He founded Keys-AI with a mission to make AI accessible to businesses of all sizes.",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      bio: "Sarah leads our technical team with her expertise in AI development and cloud infrastructure, ensuring our agents are cutting-edge and reliable.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      bio: "Michael brings a user-centered approach to our product development, making sure our AI agents are intuitive and solve real business problems.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success Manager",
      bio: "Emily ensures our customers get the most value from our AI agents, providing support and training to optimize their implementation.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200"
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin} 
        onLoginClick={handleLoginClick} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow">
        <section className="bg-brand-navy text-white py-16">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About Keys-AI</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We're on a mission to empower businesses with intelligent AI agents that automate tasks,
              analyze data, and drive growth.
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  At Keys-AI, we believe that artificial intelligence should be accessible to businesses of all sizes.
                  Our mission is to democratize AI technology by providing easy-to-use, powerful AI agents that solve
                  real business problems without requiring extensive technical knowledge.
                </p>
                <p className="text-gray-600 mb-4">
                  We're committed to developing AI solutions that are not only effective but also ethical and
                  transparent. Our agents are designed to augment human capabilities, not replace them, helping
                  teams work more efficiently and focus on high-value tasks.
                </p>
                <p className="text-gray-600">
                  By making AI accessible and practical, we aim to help businesses across industries unlock new
                  levels of productivity, innovation, and growth.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=650&h=500" 
                  alt="Team collaboration" 
                  className="rounded-lg shadow-xl hover-lift"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2 text-center">Our Team</h2>
            <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Meet the talented individuals behind Keys-AI who are passionate about bringing powerful AI solutions to businesses worldwide.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover-lift">
                  <div className="mb-4 flex justify-center">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-brand-navy"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy text-center">{member.name}</h3>
                  <p className="text-brand-gold text-center mb-3">{member.role}</p>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-brand-navy text-white">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Ready to experience the power of AI in your business? Explore our services or get in touch with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-brand-navy hover:bg-gray-100">
                <Link to="/services">Explore Services</Link>
              </Button>
              <Button asChild className="bg-brand-gold text-white hover:bg-opacity-90">
                <Link to="/contact">Contact Us</Link>
              </Button>
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

export default AboutPage;
