import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Crown, Check, Sparkles, Zap, Shield, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing Stripe public key - subscription features will be limited');
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/?subscription=success",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to Premium Scholar tier!",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-academia-gold hover:bg-academia-gold/90 text-academia-dark"
      >
        {isLoading ? "Processing..." : "Subscribe to Premium"}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!stripePromise) {
      setIsLoading(false);
      return;
    }

    // Create subscription as soon as the page loads
    apiRequest("POST", "/api/create-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error creating subscription:", error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again later.",
          variant: "destructive",
        });
      });
  }, [toast]);

  const features = [
    {
      icon: Crown,
      title: "Unlimited Content",
      description: "Create unlimited entries across all categories"
    },
    {
      icon: Sparkles,
      title: "Advanced Rituals",
      description: "Custom ritual templates and advanced scheduling"
    },
    {
      icon: Zap,
      title: "Premium Integrations",
      description: "Full access to Discord, Notion, and Obsidian sync"
    },
    {
      icon: Shield,
      title: "Data Export",
      description: "Export your data in multiple formats for backup"
    },
    {
      icon: Star,
      title: "Priority Support",
      description: "Get priority customer support and feature requests"
    },
  ];

  const isPremium = user?.subscriptionStatus === "premium";

  return (
    <div className="min-h-screen bg-academia-dark flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-academia-brown/50 border-b border-academia-gold/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold text-academia-gold">Premium Subscription</h2>
              <p className="text-academia-beige/70 mt-1">Unlock the full potential of House of Truth</p>
            </div>
            {isPremium && (
              <Badge className="bg-academia-gold text-academia-dark">
                <Crown className="w-4 h-4 mr-1" />
                Premium Active
              </Badge>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {isPremium ? (
              // Already Premium
              <Card className="bg-academia-brown/30 border-academia-gold/20 text-center">
                <CardContent className="p-12">
                  <Crown className="w-16 h-16 text-academia-gold mx-auto mb-6" />
                  <h3 className="text-2xl font-serif font-bold text-academia-gold mb-4">
                    You're Already a Premium Scholar!
                  </h3>
                  <p className="text-academia-beige/70 mb-6">
                    Thank you for being a premium subscriber. You have access to all our advanced features.
                  </p>
                  <Button 
                    onClick={() => window.location.href = "/settings"}
                    className="bg-academia-gold hover:bg-academia-gold/90 text-academia-dark"
                  >
                    Manage Subscription
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pricing Card */}
                <Card className="bg-academia-brown/30 border-academia-gold/20">
                  <CardHeader className="text-center pb-4">
                    <Crown className="w-12 h-12 text-academia-gold mx-auto mb-4" />
                    <CardTitle className="text-2xl font-serif text-academia-gold">Premium Scholar</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-academia-beige">$9.99</span>
                      <span className="text-academia-beige/70">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-medium text-academia-beige">Premium Features:</h4>
                      {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <div key={index} className="flex items-start space-x-3">
                            <Icon className="w-5 h-5 text-academia-gold mt-0.5 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-academia-beige">{feature.title}</h5>
                              <p className="text-sm text-academia-beige/70">{feature.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <Separator className="my-6 bg-academia-gold/20" />
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-academia-beige">Also Included:</h4>
                      <ul className="space-y-2 text-sm text-academia-beige/70">
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>All free features</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>Custom themes and layouts</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>Mobile app access (coming soon)</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Form */}
                <Card className="bg-academia-brown/30 border-academia-gold/20">
                  <CardHeader>
                    <CardTitle className="text-academia-gold">Subscribe Now</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!stripePromise ? (
                      <div className="text-center py-8">
                        <p className="text-academia-beige/70 mb-4">
                          Payment processing is currently unavailable.
                        </p>
                        <p className="text-sm text-academia-beige/60">
                          Please contact support to subscribe to premium features.
                        </p>
                      </div>
                    ) : isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-academia-gold border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-academia-beige/70">Setting up payment...</p>
                      </div>
                    ) : !clientSecret ? (
                      <div className="text-center py-8">
                        <p className="text-academia-beige/70 mb-4">
                          Unable to initialize payment.
                        </p>
                        <Button 
                          onClick={() => window.location.reload()}
                          variant="outline"
                          className="border-academia-gold/30 text-academia-cream"
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <SubscribeForm />
                      </Elements>
                    )}
                    
                    <div className="mt-6 text-center">
                      <p className="text-xs text-academia-beige/60">
                        Secure payment processing powered by Stripe. 
                        Cancel anytime from your account settings.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
