import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Crown,
  Link as LinkIcon,
  Unlink,
  Save
} from "lucide-react";
import { SiDiscord, SiNotion } from "react-icons/si";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const integrationSchema = z.object({
  platform: z.enum(["discord", "notion", "obsidian"]),
  isConnected: z.boolean(),
});

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: integrations = [] } = useQuery({
    queryKey: ["/api/integrations"],
    enabled: !!user,
  });

  const form = useForm<z.infer<typeof integrationSchema>>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      platform: "discord",
      isConnected: false,
    },
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/integrations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Success",
        description: "Integration updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update integration",
        variant: "destructive",
      });
    },
  });

  const handleIntegrationToggle = (platform: string, isConnected: boolean) => {
    updateIntegrationMutation.mutate({
      platform,
      isConnected: !isConnected,
      settings: {},
    });
  };

  const getIntegrationStatus = (platform: string) => {
    const integration = integrations.find((i: any) => i.platform === platform);
    return integration?.isConnected || false;
  };

  const getIntegrationIcon = (platform: string) => {
    switch (platform) {
      case "discord":
        return <SiDiscord className="w-5 h-5 text-[#5865F2]" />;
      case "notion":
        return <SiNotion className="w-5 h-5 text-academia-gold" />;
      case "obsidian":
        return <LinkIcon className="w-5 h-5 text-purple-400" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: LinkIcon },
    { id: "subscription", label: "Subscription", icon: Crown },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-academia-dark flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-academia-brown/50 border-b border-academia-gold/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold text-academia-gold">Settings</h2>
              <p className="text-academia-beige/70 mt-1">Manage your account preferences and integrations</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-academia-brown/30 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-academia-gold/20 text-academia-gold"
                        : "text-academia-beige/70 hover:text-academia-beige"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
              <Card className="bg-academia-brown/30 border-academia-gold/20">
                <CardHeader>
                  <CardTitle className="text-academia-gold">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-academia-beige">First Name</Label>
                      <Input 
                        value={user?.firstName || ""} 
                        disabled
                        className="mt-2 bg-academia-dark/50 border-academia-gold/20 text-academia-beige"
                      />
                    </div>
                    <div>
                      <Label className="text-academia-beige">Last Name</Label>
                      <Input 
                        value={user?.lastName || ""} 
                        disabled
                        className="mt-2 bg-academia-dark/50 border-academia-gold/20 text-academia-beige"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-academia-beige">Email</Label>
                    <Input 
                      value={user?.email || ""} 
                      disabled
                      className="mt-2 bg-academia-dark/50 border-academia-gold/20 text-academia-beige"
                    />
                  </div>
                  <p className="text-sm text-academia-beige/60">
                    Profile information is managed through your Replit account and cannot be changed here.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card className="bg-academia-brown/30 border-academia-gold/20">
                <CardHeader>
                  <CardTitle className="text-academia-gold">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-academia-beige">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="mt-2 bg-academia-dark/50 border-academia-gold/20 text-academia-beige">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-academia-dark border-academia-gold/30">
                        <SelectItem value="dark-academia">Dark Academia</SelectItem>
                        <SelectItem value="classical">Classical</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-academia-beige/60 mt-2">
                      Choose your preferred visual theme for the application.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="bg-academia-brown/30 border-academia-gold/20">
                <CardHeader>
                  <CardTitle className="text-academia-gold">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-academia-beige">Reminder Notifications</Label>
                      <p className="text-sm text-academia-beige/60">Get notified when reminders are due</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-academia-gold/20" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-academia-beige">Activity Updates</Label>
                      <p className="text-sm text-academia-beige/60">Receive updates about your progress</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-academia-gold/20" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-academia-beige">Integration Sync</Label>
                      <p className="text-sm text-academia-beige/60">Notifications from connected services</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "integrations" && (
              <Card className="bg-academia-brown/30 border-academia-gold/20">
                <CardHeader>
                  <CardTitle className="text-academia-gold">Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {["discord", "notion", "obsidian"].map((platform) => {
                    const isConnected = getIntegrationStatus(platform);
                    return (
                      <div key={platform} className="flex items-center justify-between p-4 bg-academia-dark/30 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getIntegrationIcon(platform)}
                          <div>
                            <h3 className="font-medium text-academia-beige capitalize">{platform}</h3>
                            <p className="text-sm text-academia-beige/60">
                              {platform === "discord" && "Connect your Discord account for community features"}
                              {platform === "notion" && "Sync your notes and documents with Notion"}
                              {platform === "obsidian" && "Import and export your knowledge vault"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={isConnected ? "default" : "outline"}
                            className={isConnected ? "bg-green-600 text-white" : "border-academia-gold/30 text-academia-beige"}
                          >
                            {isConnected ? "Connected" : "Disconnected"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleIntegrationToggle(platform, isConnected)}
                            className="border-academia-gold/30 text-academia-cream hover:bg-academia-gold/10"
                          >
                            {isConnected ? (
                              <>
                                <Unlink className="w-4 h-4 mr-1" />
                                Disconnect
                              </>
                            ) : (
                              <>
                                <LinkIcon className="w-4 h-4 mr-1" />
                                Connect
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-sm text-academia-beige/60">
                    Note: These are mock integrations for demonstration purposes. 
                    In a production environment, these would connect to actual services.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeTab === "subscription" && (
              <Card className="bg-academia-brown/30 border-academia-gold/20">
                <CardHeader>
                  <CardTitle className="text-academia-gold">Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-academia-dark/30 rounded-lg border border-academia-gold/20">
                    <div className="flex items-center space-x-4">
                      <Crown className="w-8 h-8 text-academia-gold" />
                      <div>
                        <h3 className="font-medium text-academia-beige">
                          {user?.subscriptionStatus === "premium" ? "Premium Scholar" : "Free Scholar"}
                        </h3>
                        <p className="text-sm text-academia-beige/60">
                          {user?.subscriptionStatus === "premium" 
                            ? "You have access to all premium features" 
                            : "Upgrade to unlock premium features"
                          }
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={user?.subscriptionStatus === "premium" ? "default" : "outline"}
                      className={user?.subscriptionStatus === "premium" 
                        ? "bg-academia-gold text-academia-dark" 
                        : "border-academia-gold/30 text-academia-beige"
                      }
                    >
                      {user?.subscriptionStatus === "premium" ? "Premium" : "Free"}
                    </Badge>
                  </div>
                  
                  {user?.subscriptionStatus !== "premium" && (
                    <div className="text-center py-6">
                      <Button 
                        onClick={() => window.location.href = "/subscribe"}
                        className="bg-academia-gold hover:bg-academia-gold/90 text-academia-dark"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-medium text-academia-beige">Premium Features</h4>
                    <ul className="space-y-2 text-sm text-academia-beige/70">
                      <li>• Unlimited content entries</li>
                      <li>• Advanced integration features</li>
                      <li>• Priority customer support</li>
                      <li>• Export and backup capabilities</li>
                      <li>• Custom themes and layouts</li>
                      <li>• Advanced analytics and insights</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card className="bg-academia-brown/30 border-academia-gold/20">
                <CardHeader>
                  <CardTitle className="text-academia-gold">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-academia-beige mb-2">Account Security</h4>
                    <p className="text-sm text-academia-beige/60 mb-4">
                      Your account security is managed through Replit's authentication system.
                    </p>
                  </div>
                  
                  <Separator className="bg-academia-gold/20" />
                  
                  <div>
                    <h4 className="font-medium text-academia-beige mb-2">Data Privacy</h4>
                    <p className="text-sm text-academia-beige/60 mb-4">
                      Your data is encrypted and stored securely. We never share your personal information with third parties.
                    </p>
                  </div>
                  
                  <Separator className="bg-academia-gold/20" />
                  
                  <div>
                    <h4 className="font-medium text-academia-beige mb-2">Session Management</h4>
                    <p className="text-sm text-academia-beige/60 mb-4">
                      You are automatically logged out after periods of inactivity for your security.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = "/api/logout"}
                      className="border-academia-red/30 text-academia-red hover:bg-academia-red/10"
                    >
                      Sign Out of All Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
