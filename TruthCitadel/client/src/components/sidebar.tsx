import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Book, 
  Home, 
  Palette, 
  Music, 
  Bell, 
  Settings, 
  Sparkles,
  Crown,
  MessageCircle,
  Shield
} from "lucide-react";
import { SiDiscord, SiNotion } from "react-icons/si";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Literature", href: "/literature", icon: Book },
  { name: "Rituals", href: "/rituals", icon: Sparkles },
  { name: "Aesthetics", href: "/aesthetics", icon: Palette },
  { name: "Music", href: "/music", icon: Music },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const { data: integrations } = useQuery({
    queryKey: ["/api/integrations"],
    enabled: !!user,
  });

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="w-64 bg-academia-brown border-r border-academia-gold/20 flex flex-col">
      {/* Logo & Title */}
      <div className="p-6 border-b border-academia-gold/20">
        <h1 className="text-2xl font-serif font-bold text-academia-gold">House of Truth</h1>
        <p className="text-sm text-academia-beige/70 mt-1">The App of the Century</p>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-academia-gold/20">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 border-2 border-academia-gold/30">
            <AvatarImage src={user?.profileImageUrl} alt="User profile" />
            <AvatarFallback className="bg-academia-gold/20 text-academia-gold">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-academia-cream">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : "Scholar"
              }
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs border-academia-gold/30 text-academia-gold">
                {user?.subscriptionStatus === "premium" ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </>
                ) : (
                  "Free"
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="p-4 border-b border-academia-gold/20">
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="bg-academia-dark border-academia-gold/30 text-academia-cream">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent className="bg-academia-dark border-academia-gold/30">
            <SelectItem value="dark-academia">Dark Academia</SelectItem>
            <SelectItem value="classical">Classical</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimalist">Minimalist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-academia-gold/20 text-academia-gold border border-academia-gold/30" 
                  : "hover:bg-academia-gold/10 text-academia-cream"
              }`}>
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
        
        {/* Admin Link - Only show for admin users */}
        {user?.role === 'admin' && (
          <Link href="/admin">
            <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location === '/admin' 
                ? "bg-academia-gold/20 text-academia-gold border border-academia-gold/30" 
                : "hover:bg-academia-gold/10 text-academia-cream"
            }`}>
              <Shield className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </div>
          </Link>
        )}
      </nav>

      {/* Integrations */}
      <div className="p-4 border-t border-academia-gold/20">
        <h3 className="text-sm font-medium text-academia-beige/70 mb-3">Integrations</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded bg-academia-dark/50">
            <span className="text-sm flex items-center space-x-2">
              <SiDiscord className="w-4 h-4 text-[#5865F2]" />
              <span className="text-academia-cream">Discord</span>
            </span>
            <span className="text-xs text-green-400">
              {integrations?.find((i: any) => i.platform === "discord")?.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-academia-dark/50">
            <span className="text-sm flex items-center space-x-2">
              <SiNotion className="w-4 h-4 text-academia-gold" />
              <span className="text-academia-cream">Notion</span>
            </span>
            <span className="text-xs text-green-400">
              {integrations?.find((i: any) => i.platform === "notion")?.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-academia-dark/50">
            <span className="text-sm flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span className="text-academia-cream">Obsidian</span>
            </span>
            <span className="text-xs text-green-400">
              {integrations?.find((i: any) => i.platform === "obsidian")?.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
