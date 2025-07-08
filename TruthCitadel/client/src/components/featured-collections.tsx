import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Palette, Music } from "lucide-react";
import { Link } from "wouter";

const collections = [
  {
    id: "literature",
    title: "Classical Literature",
    description: "Explore timeless works that shaped human thought",
    icon: Book,
    href: "/literature",
    category: "literature",
  },
  {
    id: "aesthetics",
    title: "Dark Academia",
    description: "Curated aesthetic inspirations and visual mood boards",
    icon: Palette,
    href: "/aesthetics",
    category: "aesthetics",
  },
  {
    id: "music",
    title: "Classical Compositions",
    description: "Soundscapes for contemplation and study",
    icon: Music,
    href: "/music",
    category: "music",
  },
];

export function FeaturedCollections() {
  const { data: literatureEntries = [] } = useQuery({
    queryKey: ["/api/content/literature"],
  });

  const { data: aestheticsEntries = [] } = useQuery({
    queryKey: ["/api/content/aesthetics"],
  });

  const { data: musicEntries = [] } = useQuery({
    queryKey: ["/api/content/music"],
  });

  const getCategoryCount = (category: string) => {
    switch (category) {
      case "literature":
        return literatureEntries.length;
      case "aesthetics":
        return aestheticsEntries.length;
      case "music":
        return musicEntries.length;
      default:
        return 0;
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-serif font-bold text-academia-gold mb-6">Featured Collections</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => {
          const Icon = collection.icon;
          const count = getCategoryCount(collection.category);
          
          return (
            <Card key={collection.id} className="bg-academia-brown/30 border-academia-gold/20 overflow-hidden backdrop-blur-sm">
              <div className="h-48 bg-academia-gold/10 flex items-center justify-center">
                <Icon className="w-16 h-16 text-academia-gold/50" />
              </div>
              <CardContent className="p-6">
                <h4 className="text-lg font-serif font-bold text-academia-gold mb-2">
                  {collection.title}
                </h4>
                <p className="text-academia-beige/70 text-sm mb-4">
                  {collection.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-academia-beige/60 text-sm">
                    {count} {count === 1 ? "entry" : "entries"}
                  </span>
                  <Link href={collection.href}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-academia-gold hover:text-academia-gold/80 hover:bg-academia-gold/10"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
