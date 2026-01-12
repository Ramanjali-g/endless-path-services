import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useProviderBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Phone,
  Mail,
  CheckCircle,
  X,
  Play,
  Briefcase,
  User,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const ServiceRequests = () => {
  const { data: bookings, isLoading } = useProviderBookings();
  const updateStatus = useUpdateBookingStatus();
  const [activeTab, setActiveTab] = useState("pending");

  const filteredBookings = bookings?.filter((booking) => {
    if (activeTab === "pending") return booking.status === "pending";
    if (activeTab === "active") return ["accepted", "in_progress"].includes(booking.status);
    if (activeTab === "completed") return booking.status === "completed";
    return true;
  });

  const handleAccept = async (bookingId: string) => {
    await updateStatus.mutateAsync({ bookingId, status: "accepted" });
  };

  const handleReject = async (bookingId: string) => {
    await updateStatus.mutateAsync({ bookingId, status: "rejected" });
  };

  const handleStart = async (bookingId: string) => {
    await updateStatus.mutateAsync({ bookingId, status: "in_progress" });
  };

  const handleComplete = async (bookingId: string) => {
    await updateStatus.mutateAsync({ bookingId, status: "completed" });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Service Requests
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage incoming service requests
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="pending">
            Pending
            {bookings?.filter((b) => b.status === "pending").length ? (
              <Badge variant="secondary" className="ml-2">
                {bookings.filter((b) => b.status === "pending").length}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Requests List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredBookings?.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings?.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Main Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-lg">
                          {booking.service?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          #{booking.booking_number}
                        </p>
                      </div>
                      <Badge className={statusColors[booking.status]}>
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {booking.customer?.full_name || "Customer"}
                        </span>
                      </div>
                      {booking.customer?.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{booking.customer.phone}</span>
                        </div>
                      )}
                      {booking.customer?.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{booking.customer.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(booking.scheduled_date).toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
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
                        <span>
                          {booking.address}
                          {booking.city && `, ${booking.city}`}
                          {booking.pincode && ` - ${booking.pincode}`}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="mt-3 text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    )}
                  </div>

                  {/* Action Panel */}
                  <div className="lg:w-56 bg-muted/30 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <div className="flex items-center text-2xl font-bold">
                        <IndianRupee className="w-5 h-5" />
                        <span>{booking.estimated_price || "TBD"}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            className="w-full"
                            onClick={() => handleAccept(booking.id)}
                            disabled={updateStatus.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="w-full">
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Request?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject this service request?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleReject(booking.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Reject
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      {booking.status === "accepted" && (
                        <Button
                          className="w-full"
                          onClick={() => handleStart(booking.id)}
                          disabled={updateStatus.isPending}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Service
                        </Button>
                      )}
                      {booking.status === "in_progress" && (
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleComplete(booking.id)}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
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

export default ServiceRequests;
