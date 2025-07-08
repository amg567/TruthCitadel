import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const { toast } = useToast();

  const handleNewEntry = () => {
    toast({
      title: "New Entry",
      description: "Navigate to a specific category to add new content",
    });
  };

  const handleScheduleRitual = () => {
    toast({
      title: "Schedule Ritual",
      description: "Go to Reminders to schedule a new ritual",
    });
  };

  const handleImportFromNotion = () => {
    toast({
      title: "Import from Notion",
      description: "Notion integration is currently in development",
    });
  };

  return (
    <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-academia-gold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={handleNewEntry}
          className="w-full bg-academia-gold/20 hover:bg-academia-gold/30 border border-academia-gold/30 text-academia-cream justify-start"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
        <Button 
          onClick={handleScheduleRitual}
          className="w-full bg-academia-gold/20 hover:bg-academia-gold/30 border border-academia-gold/30 text-academia-cream justify-start"
          variant="outline"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Ritual
        </Button>
        <Button 
          onClick={handleImportFromNotion}
          className="w-full bg-academia-gold/20 hover:bg-academia-gold/30 border border-academia-gold/30 text-academia-cream justify-start"
          variant="outline"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import from Notion
        </Button>
      </CardContent>
    </Card>
  );
}
