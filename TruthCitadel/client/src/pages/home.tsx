import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { StatCard } from "@/components/stat-card";
import { ActivityFeed } from "@/components/activity-feed";
import { QuickActions } from "@/components/quick-actions";
import { RemindersWidget } from "@/components/reminders-widget";
import { SubscriptionWidget } from "@/components/subscription-widget";
import { FeaturedCollections } from "@/components/featured-collections";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Sparkles, Users, LogOut } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!user,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-academia-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-academia-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academia-dark flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-academia-brown/50 border-b border-academia-gold/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold text-academia-gold">Scholar's Dashboard</h2>
              <p className="text-academia-beige/70 mt-1">Your personal sanctum of knowledge and progress</p>
            </div>
            <Button 
              onClick={() => window.location.href = "/api/logout"}
              variant="outline"
              className="bg-academia-gold/20 hover:bg-academia-gold/30 border-academia-gold/30 text-academia-cream"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Entries"
              value={stats?.totalEntries || 0}
              icon={BookOpen}
              trend="+12% from last month"
            />
            <StatCard
              title="Hours Studied"
              value={stats?.hoursStudied || 0}
              icon={Clock}
              trend="+8% from last month"
            />
            <StatCard
              title="Active Rituals"
              value={stats?.activeRituals || 0}
              icon={Sparkles}
              trend="2 due today"
              trendColor="yellow"
            />
            <StatCard
              title="Connections"
              value={stats?.connections || 0}
              icon={Users}
              trend="+3 new this week"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              <QuickActions />
              <RemindersWidget />
              <SubscriptionWidget />
            </div>
          </div>

          {/* Featured Collections */}
          <FeaturedCollections />
        </main>
      </div>
    </div>
  );
}
