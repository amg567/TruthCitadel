import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, CreditCard } from "lucide-react";
import { Link } from "wouter";

export function SubscriptionWidget() {
  const { user } = useAuth();

  const isPremium = user?.subscriptionStatus === "premium";

  return (
    <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-academia-gold">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="w-16 h-16 bg-academia-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
          {isPremium ? (
            <Crown className="w-8 h-8 text-academia-gold" />
          ) : (
            <CreditCard className="w-8 h-8 text-academia-gold" />
          )}
        </div>
        <p className="font-medium text-academia-beige">
          {isPremium ? "Premium Scholar" : "Free Scholar"}
        </p>
        <p className="text-sm text-academia-beige/70 mt-1">
          {isPremium ? "All features unlocked" : "Limited features"}
        </p>
        <Link href="/subscribe">
          <Button 
            className="mt-3 w-full bg-academia-gold/20 hover:bg-academia-gold/30 border border-academia-gold/30 text-academia-cream"
            variant="outline"
          >
            {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
