import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Book, Palette, Music, Sparkles } from "lucide-react";

const categoryIcons = {
  literature: Book,
  aesthetics: Palette,
  music: Music,
  rituals: Sparkles,
};

export function ActivityFeed() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["/api/activity"],
  });

  if (isLoading) {
    return (
      <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-academia-gold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 bg-academia-dark/30 rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-academia-gold/20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-academia-gold/20 rounded w-3/4" />
                  <div className="h-3 bg-academia-gold/20 rounded w-1/2" />
                  <div className="h-3 bg-academia-gold/20 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-academia-gold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-academia-beige/70">
              No recent activity. Start by adding some content!
            </div>
          ) : (
            activities.map((activity: any) => {
              const Icon = categoryIcons[activity.category as keyof typeof categoryIcons] || Book;
              
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-academia-dark/30 rounded-lg">
                  <div className="w-12 h-12 bg-academia-gold/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-academia-gold" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-academia-beige">{activity.action}</h4>
                    <p className="text-sm text-academia-beige/70 mt-1">{activity.description}</p>
                    <p className="text-xs text-academia-beige/50 mt-2">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
