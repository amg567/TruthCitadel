import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Palette, Edit3, Trash2, Image } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export default function Aesthetics() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const { toast } = useToast();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/content/aesthetics"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      imageUrl: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/content", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/aesthetics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Aesthetic entry created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create aesthetic entry",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PUT", `/api/content/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/aesthetics"] });
      setIsDialogOpen(false);
      setEditingEntry(null);
      form.reset();
      toast({
        title: "Success",
        description: "Aesthetic entry updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update aesthetic entry",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/aesthetics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Aesthetic entry deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete aesthetic entry",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tags = values.tags ? values.tags.split(",").map(tag => tag.trim()) : [];
    const data = {
      ...values,
      tags,
      category: "aesthetics",
      imageUrl: values.imageUrl || undefined,
    };

    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    form.setValue("title", entry.title);
    form.setValue("content", entry.content);
    form.setValue("tags", entry.tags?.join(", ") || "");
    form.setValue("imageUrl", entry.imageUrl || "");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this aesthetic entry?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-academia-dark flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-academia-brown/50 border-b border-academia-gold/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold text-academia-gold">Aesthetics</h2>
              <p className="text-academia-beige/70 mt-1">Your curated collection of visual inspiration and mood boards</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingEntry(null);
                    form.reset();
                  }}
                  className="bg-academia-gold hover:bg-academia-gold/90 text-academia-dark"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Aesthetic
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-academia-dark border-academia-gold/20">
                <DialogHeader>
                  <DialogTitle className="text-academia-gold">
                    {editingEntry ? "Edit Aesthetic" : "Add Aesthetic"}
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
                              placeholder="Mood board title, theme, or inspiration source" 
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
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-academia-beige">Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the aesthetic, its meaning, or why it inspires you..."
                              className="bg-academia-brown/30 border-academia-gold/20 text-academia-cream min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-academia-beige">Image URL (recommended)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg"
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
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-academia-beige">Tags (comma-separated)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="dark academia, vintage, cozy, library"
                              {...field}
                              className="bg-academia-brown/30 border-academia-gold/20 text-academia-cream"
                            />
                          </FormControl>
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
                        {editingEntry ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-academia-brown/30 border-academia-gold/20 animate-pulse">
                  <div className="h-48 bg-academia-gold/20" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-academia-gold/20 rounded w-3/4 mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-academia-gold/20 rounded" />
                      <div className="h-3 bg-academia-gold/20 rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16">
              <Palette className="w-16 h-16 text-academia-gold/50 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-academia-gold mb-2">No aesthetic entries yet</h3>
              <p className="text-academia-beige/70 mb-6">Start curating your visual inspiration by adding your first aesthetic entry.</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-academia-gold hover:bg-academia-gold/90 text-academia-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Aesthetic
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry: any) => (
                <Card key={entry.id} className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
                  <div className="h-48 bg-academia-gold/10 overflow-hidden relative">
                    {entry.imageUrl ? (
                      <img 
                        src={entry.imageUrl} 
                        alt={entry.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-12 h-12 text-academia-gold/50" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(entry)}
                        className="bg-academia-dark/80 text-academia-beige/70 hover:text-academia-gold"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(entry.id)}
                        className="bg-academia-dark/80 text-academia-beige/70 hover:text-academia-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-academia-gold font-serif text-lg">
                      {entry.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-academia-beige/70 text-sm mb-4 line-clamp-3">
                      {entry.content}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {entry.tags.map((tag: string, index: number) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-academia-gold/20 text-academia-gold text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-academia-beige/50">
                      {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
