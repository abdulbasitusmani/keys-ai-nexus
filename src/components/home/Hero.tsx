
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-navy">
            Unlock Business Growth with Keys-AI Agents
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl">
            Discover intelligent AI agents designed to automate tasks and boost productivity for your business.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <Button 
              asChild
              className="bg-brand-navy hover:bg-opacity-90 text-white px-8 py-6 text-lg hover-lift"
            >
              <Link to="/services">Explore Our Agents</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white px-8 py-6 text-lg hover-lift"
            >
              <Link to="/packages">View Packages</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <img 
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=800&h=600" 
            alt="AI Technology" 
            className="rounded-lg shadow-2xl hover-lift object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
