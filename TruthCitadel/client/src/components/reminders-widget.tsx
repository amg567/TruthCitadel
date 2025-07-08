import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Clock, AlertCircle } from "lucide-react";

export function RemindersWidget() {
  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ["/api/reminders"],
  });

  const upcomingReminders = reminders
    .filter((reminder: any) => !reminder.isCompleted)
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  if (isLoading) {
    return (
      <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-academia-gold">Upcoming Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 bg-academia-dark/30 rounded-lg animate-pulse">
                <div className="h-4 bg-academia-gold/20 rounded w-3/4 mb-2" />
                <div className="h-3 bg-academia-gold/20 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyColor = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 2) return "bg-academia-red/20 border-academia-red/30";
    if (hoursUntilDue < 24) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-academia-dark/30 border-academia-gold/20";
  };

  return (
    <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-academia-gold">Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingReminders.length === 0 ? (
            <div className="text-center py-4 text-academia-beige/70">
              <Clock className="w-8 h-8 mx-auto mb-2 text-academia-gold/50" />
              No upcoming reminders
            </div>
          ) : (
            upcomingReminders.map((reminder: any) => (
              <div key={reminder.id} className={`p-3 rounded-lg border ${getUrgencyColor(reminder.dueDate)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-academia-beige">{reminder.title}</p>
                    <p className="text-xs text-academia-beige/70 mt-1">
                      {formatDistanceToNow(new Date(reminder.dueDate), { addSuffix: true })}
                    </p>
                  </div>
                  {new Date(reminder.dueDate).getTime() - new Date().getTime() < 2 * 60 * 60 * 1000 && (
                    <AlertCircle className="w-4 h-4 text-academia-red" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
