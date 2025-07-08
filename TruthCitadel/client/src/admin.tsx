import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Crown, Users, FileText, Bell, Activity, Trash2, Shield, User } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: content } = useQuery({
    queryKey: ['/api/admin/content'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: reminders } = useQuery({
    queryKey: ['/api/admin/reminders'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: activities } = useQuery({
    queryKey: ['/api/admin/activities'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await apiRequest("PUT", `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-amber-700 dark:text-amber-300">
            Welcome back, {user?.firstName || user?.email}. Here's your system overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {stats?.totalUsers || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Content Entries
              </CardTitle>
              <FileText className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {stats?.totalContent || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Reminders
              </CardTitle>
              <Bell className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {stats?.totalReminders || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Activities
              </CardTitle>
              <Activity className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {stats?.totalActivities || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Breakdown */}
        <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mb-8">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-amber-100">
              Subscription Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {stats?.subscriptionBreakdown?.map((item: any) => (
                <div key={item.status} className="flex items-center gap-2">
                  <Badge variant={item.status === 'premium' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    {item.count} users
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-amber-100 dark:bg-amber-900/30">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-900 dark:text-amber-100">
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users?.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {user.role === 'admin' ? (
                            <Shield className="w-5 h-5 text-amber-600" />
                          ) : (
                            <User className="w-5 h-5 text-amber-600" />
                          )}
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">
                              {user.firstName || user.lastName ? 
                                `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                                user.email
                              }
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.subscriptionStatus === 'premium' ? 'default' : 'outline'}>
                          {user.subscriptionStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={user.role} 
                          onValueChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {user.id !== user?.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user? This action cannot be undone.
                                  All their content, reminders, and data will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteUserMutation.mutate(user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-900 dark:text-amber-100">
                  Content Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content?.slice(0, 10).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-100">
                          {item.title}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {item.category} • User: {item.userId}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-900 dark:text-amber-100">
                  Reminders Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reminders?.slice(0, 10).map((reminder: any) => (
                    <div key={reminder.id} className="flex items-center justify-between p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-100">
                          {reminder.title}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          User: {reminder.userId} • Due: {new Date(reminder.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={reminder.isCompleted ? 'default' : 'secondary'}>
                        {reminder.isCompleted ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card className="bg-white/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-900 dark:text-amber-100">
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities?.slice(0, 20).map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-100">
                          {activity.action}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          User: {activity.userId} • {activity.details}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
