import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Bell, Edit3, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  type: z.enum(["daily", "weekly", "monthly", "custom"]),
});

export default function Reminders() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const { toast } = useToast();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ["/api/reminders"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      type: "custom",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/reminders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Reminder created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create reminder",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PUT", `/api/reminders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      setIsDialogOpen(false);
      setEditingReminder(null);
      form.reset();
      toast({
        title: "Success",
        description: "Reminder updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/reminders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      toast({
        title: "Success",
        description: "Reminder deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: ({ id, isCompleted }: { id: number; isCompleted: boolean }) => 
      apiRequest("PUT", `/api/reminders/${id}`, { isCompleted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      toast({
        title: "Success",
        description: "Reminder status updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update reminder status",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      dueDate: new Date(values.dueDate).toISOString(),
    };

    if (editingReminder) {
      updateMutation.mutate({ id: editingReminder.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (reminder: any) => {
    setEditingReminder(reminder);
    form.setValue("title", reminder.title);
    form.setValue("description", reminder.description || "");
    form.setValue("dueDate", format(new Date(reminder.dueDate), "yyyy-MM-dd'T'HH:mm"));
    form.setValue("type", reminder.type);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleComplete = (id: number, isCompleted: boolean) => {
    toggleCompleteMutation.mutate({ id, isCompleted: !isCompleted });
  };

  const filteredReminders = reminders.filter((reminder: any) => {
    if (filter === "completed") return reminder.isCompleted;
    if (filter === "pending") return !reminder.isCompleted;
    return true;
  });

  const getUrgencyColor = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) return "text-green-400";
    
    const now = new Date();
    const due = new Date(dueDate);
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 0) return "text-academia-red";
    if (hoursUntilDue < 2) return "text-academia-red";
    if (hoursUntilDue < 24) return "text-yellow-400";
    return "text-academia-beige";
  };

  const getUrgencyIcon = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) return CheckCircle;
    
    const now = new Date();
    const due = new Date(dueDate);
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 2) return AlertCircle;
    return Clock;
  };

  return (
    <div className="min-h-screen bg-academia-dark flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-academia-brown/50 border-b border-academia-gold/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold text-academia-gold">Reminders</h2>
              <p className="text-academia-beige/70 mt-1">Manage your rituals and important tasks</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-40 bg-academia-dark border-academia-gold/30 text-academia-cream">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-academia-dark border-academia-gold/30">
                  <SelectItem value="all">All Reminders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingReminder(null);
                      form.reset();
                    }}
                    className="bg-academia-gold hover:bg-academia-gold/90 text-academia-dark"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-academia-dark border-academia-gold/20">
                  <DialogHeader>
                    <DialogTitle className="text-academia-gold">
                      {editingReminder ? "Edit Reminder" : "Add Reminder"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-academia-beige">Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Reminder title" 
                                {...field}
                                className="bg-academia-brown/30 border-academia-gold/20 text-academia-cream"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-academia-beige">Description (optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional details about this reminder..."
                                className="bg-academia-brown/30 border-academia-gold/20 text-academia-cream"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-academia-beige">Due Date & Time</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local"
                                {...field}
                                className="bg-academia-brown/30 border-academia-gold/20 text-academia-cream"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-academia-beige">Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-academia-brown/30 border-academia-gold/20 text-academia-cream">
                                  <SelectValue placeholder="Select reminder type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-academia-dark border-academia-gold/30">
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="border-academia-gold/30 text-academia-cream"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={createMutation.isPending || updateMutation.isPending}
                          className="bg-academia-gold hover:bg-academia-gold/90 text-academia-dark"
                        >
                          {editingReminder ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-academia-brown/30 border-academia-gold/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-academia-gold/20 rounded w-1/3" />
                        <div className="h-3 bg-academia-gold/20 rounded w-1/2" />
                      </div>
                      <div className="h-8 w-20 bg-academia-gold/20 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredReminders.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-academia-gold/50 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-academia-gold mb-2">
                {filter === "all" ? "No reminders yet" : `No ${filter} reminders`}
              </h3>
              <p className="text-academia-beige/70 mb-6">
                {filter === "all" 
                  ? "Create your first reminder to stay on track with your rituals and goals."
                  : `You have no ${filter} reminders at the moment.`
                }
              </p>
              {filter === "all" && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-academia-gold hover:bg-academia-gold/90 text-academia-dark"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Reminder
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReminders.map((reminder: any) => {
                const UrgencyIcon = getUrgencyIcon(reminder.dueDate, reminder.isCompleted);
                const urgencyColor = getUrgencyColor(reminder.dueDate, reminder.isCompleted);
                
                return (
                  <Card key={reminder.id} className={`bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm ${
                    reminder.isCompleted ? "opacity-75" : ""
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <Checkbox
                            checked={reminder.isCompleted}
                            onCheckedChange={() => handleToggleComplete(reminder.id, reminder.isCompleted)}
                            className="border-academia-gold/30"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className={`font-medium ${
                                reminder.isCompleted ? "line-through text-academia-beige/50" : "text-academia-beige"
                              }`}>
                                {reminder.title}
                              </h3>
                              <Badge variant="outline" className="text-xs border-academia-gold/30 text-academia-gold">
                                {reminder.type}
                              </Badge>
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-academia-beige/70 mb-2">
                                {reminder.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2">
                              <UrgencyIcon className={`w-4 h-4 ${urgencyColor}`} />
                              <span className={`text-sm ${urgencyColor}`}>
                                {reminder.isCompleted
                                  ? "Completed"
                                  : formatDistanceToNow(new Date(reminder.dueDate), { addSuffix: true })
                                }
                              </span>
                              <span className="text-xs text-academia-beige/50">
                                {format(new Date(reminder.dueDate), "MMM dd, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(reminder)}
                            className="text-academia-beige/70 hover:text-academia-gold"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(reminder.id)}
                            className="text-academia-beige/70 hover:text-academia-red"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
