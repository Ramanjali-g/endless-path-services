import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useProviderBookings } from "@/hooks/useBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Star,
  Users,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  rejected: "bg-red-100 text-red-800",
};

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading } = useProviderBookings();

  const pendingRequests = bookings?.filter((b) => b.status === "pending") || [];
  const activeBookings = bookings?.filter((b) => ["accepted", "in_progress"].includes(b.status)) || [];
  const completedCount = bookings?.filter((b) => b.status === "completed").length || 0;
  const totalEarnings = bookings
    ?.filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.final_price || b.estimated_price || 0), 0) || 0;

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Provider Dashboard 🛠️
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your services and track earnings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                <p className="text-sm text-muted-foreground">New Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeBookings.length}</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <IndianRupee className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* New Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>New Service Requests</CardTitle>
              <Link to="/provider/requests">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No pending requests</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    New service requests will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{booking.service?.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {booking.customer?.full_name || "Customer"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.scheduled_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                            {booking.scheduled_time && ` at ${booking.scheduled_time}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={statusColors.pending}>New</Badge>
                          <p className="text-sm font-medium mt-2">
                            ₹{booking.estimated_price || "TBD"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Link to={`/provider/requests/${booking.id}`} className="flex-1">
                          <Button size="sm" className="w-full">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-medium">4.8/5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Customers Served</span>
                </div>
                <span className="font-medium">{completedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm">This Month</span>
                </div>
                <span className="font-medium text-green-600">+12%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/provider/services">
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Manage My Services
                </Button>
              </Link>
              <Link to="/provider/earnings">
                <Button variant="outline" className="w-full justify-start">
                  <IndianRupee className="w-4 h-4 mr-2" />
                  View Earnings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
