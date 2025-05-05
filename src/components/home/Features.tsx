
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      id: 1,
      title: "Task Automation",
      description: "Automate repetitive tasks and workflows to save time and reduce errors in your business processes.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><rect width="8" height="8" x="8" y="8" rx="2"/><path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2"/><path d="M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2"/><path d="M4 20a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2"/><path d="M14 4a2 2 0 0 0 2-2h4a2 2 0 0 0 2 2v4a2 2 0 0 0-2 2"/></svg>
      ),
    },
    {
      id: 2,
      title: "Data Analysis",
      description: "Gain valuable insights from your data with AI-powered analysis and visualization tools.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M4 13h12"/><path d="M8 21v-4"/><path d="M12 17v4"/><path d="M16 21v-5"/></svg>
      ),
    },
    {
      id: 3,
      title: "24/7 Operation",
      description: "Our AI agents work around the clock, ensuring your business processes continue even when you're away.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ),
    },
    {
      id: 4,
      title: "Easy Integration",
      description: "Seamlessly integrate our AI agents with your existing tools and workflows with minimal setup.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">What Are Keys-AI Agents?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Keys-AI agents are intelligent software tools that leverage artificial intelligence to automate tasks, 
            analyze data, and optimize business processes. Our agents are designed to save you time, reduce errors, 
            and help your business scale efficiently.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="hover-lift bg-white border border-gray-200">
              <CardHeader className="pb-2">
                <div className="p-2 w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center mb-2">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-brand-navy">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
