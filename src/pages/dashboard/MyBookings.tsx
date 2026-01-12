import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useCustomerBookings, useUpdateBookingStatus, BookingStatus } from "@/hooks/useBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Search,
  AlertCircle,
  X,
  Star,
  Phone,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const MyBookings = () => {
  const { data: bookings, isLoading } = useCustomerBookings();
  const updateStatus = useUpdateBookingStatus();
  const [activeTab, setActiveTab] = useState("all");

  const filteredBookings = bookings?.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return ["pending", "accepted", "in_progress"].includes(booking.status);
    if (activeTab === "completed") return booking.status === "completed";
    if (activeTab === "cancelled") return ["cancelled", "rejected"].includes(booking.status);
    return true;
  });

  const handleCancel = async (bookingId: string) => {
    await updateStatus.mutateAsync({ bookingId, status: "cancelled" });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            My Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your service bookings
          </p>
        </div>
        <Link to="/dashboard/services">
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Book New Service
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredBookings?.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No bookings found</p>
          <Link to="/dashboard/services">
            <Button variant="link" className="mt-2">
              Browse services to book
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings?.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Left Section */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-lg">
                          {booking.service?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Booking #{booking.booking_number}
                        </p>
                      </div>
                      <Badge className={statusColors[booking.status]}>
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(booking.scheduled_date).toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {booking.scheduled_time && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{booking.scheduled_time}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{booking.address}{booking.city && `, ${booking.city}`}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="mt-3 text-sm text-muted-foreground italic">
                        "{booking.notes}"
                      </p>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="sm:w-48 bg-muted/50 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Estimated Price</p>
                      <div className="flex items-center text-xl font-bold">
                        <IndianRupee className="w-5 h-5" />
                        <span>{booking.estimated_price || booking.final_price || "TBD"}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {booking.status === "pending" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancel(booking.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Cancel Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {booking.status === "completed" && (
                        <Button variant="outline" size="sm" className="w-full">
                          <Star className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyBookings;
