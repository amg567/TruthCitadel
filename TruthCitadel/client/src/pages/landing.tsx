import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Crown } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-academia-dark flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-16 h-16 text-academia-gold mr-4" />
            <h1 className="text-5xl font-serif font-bold text-academia-gold">
              House of Truth
            </h1>
          </div>
          <p className="text-xl text-academia-beige/80 mb-8">
            The App of the Century
          </p>
          <p className="text-lg text-academia-beige/70 max-w-2xl mx-auto">
            A dark academia-themed sanctuary for scholars, thinkers, and seekers of truth. 
            Organize your knowledge, track your rituals, and connect with like-minded individuals 
            in an atmosphere of intellectual elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <BookOpen className="w-12 h-12 text-academia-gold mx-auto mb-4" />
              <CardTitle className="text-academia-gold font-serif">Curated Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-academia-beige/70 text-center">
                Organize your literature, aesthetics, music, and rituals in beautifully designed collections.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Sparkles className="w-12 h-12 text-academia-gold mx-auto mb-4" />
              <CardTitle className="text-academia-gold font-serif">Ritual Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-academia-beige/70 text-center">
                Build meaningful habits and track your personal growth through customizable rituals.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Crown className="w-12 h-12 text-academia-gold mx-auto mb-4" />
              <CardTitle className="text-academia-gold font-serif">Premium Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-academia-beige/70 text-center">
                Access advanced integrations, unlimited storage, and exclusive content with Premium.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-academia-gold hover:bg-academia-gold/90 text-academia-dark px-8 py-3 text-lg font-medium"
          >
            Enter the House of Truth
          </Button>
          <p className="text-academia-beige/60 mt-4 text-sm">
            Sign in with your Replit account to begin your scholarly journey
          </p>
        </div>
      </div>
    </div>
  );
}
