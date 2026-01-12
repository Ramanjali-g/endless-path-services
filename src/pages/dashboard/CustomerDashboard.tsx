import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerBookings } from "@/hooks/useBookings";
import { useServiceCategories } from "@/hooks/useServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  rejected: "bg-red-100 text-red-800",
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useCustomerBookings();
  const { data: categories, isLoading: categoriesLoading } = useServiceCategories();

  const recentBookings = bookings?.slice(0, 3) || [];
  const activeBookings = bookings?.filter(b => ["pending", "accepted", "in_progress"].includes(b.status)) || [];
  const completedCount = bookings?.filter(b => b.status === "completed").length || 0;

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your services
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeBookings.length}</p>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
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
              <div className="p-2 rounded-lg bg-secondary/20">
                <Clock className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bookings?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="pt-6">
            <Link to="/dashboard/services">
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Browse Services
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Link to="/dashboard/bookings">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No bookings yet</p>
                  <Link to="/dashboard/services">
                    <Button variant="link" className="mt-2">
                      Book your first service
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.service?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.scheduled_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {booking.scheduled_time && ` at ${booking.scheduled_time}`}
                        </p>
                      </div>
                      <Badge className={statusColors[booking.status]}>
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Book */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Book</CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories?.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      to={`/dashboard/services?category=${category.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      <span className="text-sm font-medium">{category.name}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                  <Link to="/dashboard/services">
                    <Button variant="outline" className="w-full mt-4">
                      View All Categories
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
