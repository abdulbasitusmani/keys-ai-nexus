
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number | string;
  features: string[];
  isPopular?: boolean;
}

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  const { toast } = useToast();
  
  const handleSubscribe = () => {
    toast({
      title: "Integration Required",
      description: "Please integrate with Stripe to enable subscription processing.",
    });
  };

  return (
    <Card className={cn(
      "flex flex-col h-full hover-lift",
      tier.isPopular ? "border-2 border-brand-gold" : "border border-gray-200"
    )}>
      {tier.isPopular && (
        <div className="bg-brand-gold text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader className={cn(
        tier.isPopular ? "pb-8" : "pb-10"
      )}>
        <CardTitle className="text-2xl font-bold text-brand-navy">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-brand-navy">
            {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
          </span>
          {typeof tier.price === 'number' && <span className="text-gray-500">/month</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2 text-green-500 flex-shrink-0"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={cn(
            "w-full", 
            tier.isPopular 
              ? "bg-brand-gold hover:bg-opacity-90 text-white" 
              : "bg-brand-navy hover:bg-opacity-90 text-white"
          )}
          onClick={handleSubscribe}
        >
          Choose Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
