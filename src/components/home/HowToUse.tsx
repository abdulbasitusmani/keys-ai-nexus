
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HowToUse() {
  const steps = [
    {
      id: 1,
      title: "Browse & Select",
      description: "Explore our range of AI agents and select the one that best fits your business needs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      ),
    },
    {
      id: 2,
      title: "Purchase",
      description: "Purchase your chosen AI agent with our secure payment system powered by Stripe.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      ),
    },
    {
      id: 3,
      title: "Download",
      description: "Download the .json file for your purchased AI agent and follow the implementation guide.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M14 2v6h6"/><path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-8.3"/><path d="M9 18.4 4 22v-7"/></svg>
      ),
    },
    {
      id: 4,
      title: "Implement & Scale",
      description: "Integrate the AI agent into your systems and scale your business with enhanced productivity.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M10 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="m16 18-2.5-2.5"/><path d="M16 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M10 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="m18 10-2-2"/><path d="m12 10-2-2"/><path d="m8 14-2-2"/></svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">How to Use Your AI Agent</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Getting started with Keys-AI agents is simple. Follow these steps to integrate intelligent automation into your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <Card key={step.id} className="hover-lift border-t-4 border-t-brand-gold">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-lg mb-2">
                  {step.id}
                </div>
                <CardTitle className="text-xl text-brand-navy">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 p-8 bg-brand-navy text-white rounded-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-8/12">
              <h3 className="text-2xl font-bold mb-4">Ready to Automate Your Business?</h3>
              <p className="text-gray-300">
                After purchasing, download the .json file and follow the provided guide to deploy your agent.
                Our detailed documentation will help you integrate the agent smoothly into your existing systems.
              </p>
            </div>
            <div className="md:w-4/12 mt-6 md:mt-0 flex justify-center md:justify-end">
              <div className="p-4 bg-white text-brand-navy rounded-lg inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-brand-gold"><path d="M14 2v6h6"/><path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-8.3"/><path d="M9 18.4 4 22v-7"/></svg>
                agent-config.json
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
