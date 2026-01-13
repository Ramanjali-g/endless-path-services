import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useService } from "@/hooks/useServices";
import { useCreateBooking } from "@/hooks/useBookings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Clock,
  MapPin,
  IndianRupee,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

// Validation constants
const MAX_ADDRESS_LENGTH = 500;
const MAX_CITY_LENGTH = 100;
const MAX_NOTES_LENGTH = 1000;
const PINCODE_REGEX = /^[0-9]{6}$/;

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading } = useService(serviceId || "");
  const createBooking = useCreateBooking();

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!date) {
      newErrors.date = "Please select a date";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    } else if (address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    } else if (address.length > MAX_ADDRESS_LENGTH) {
      newErrors.address = `Address must be less than ${MAX_ADDRESS_LENGTH} characters`;
    }

    if (city && city.length > MAX_CITY_LENGTH) {
      newErrors.city = `City must be less than ${MAX_CITY_LENGTH} characters`;
    }

    if (pincode && !PINCODE_REGEX.test(pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    if (notes && notes.length > MAX_NOTES_LENGTH) {
      newErrors.notes = `Notes must be less than ${MAX_NOTES_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await createBooking.mutateAsync({
      service_id: serviceId!,
      scheduled_date: format(date!, "yyyy-MM-dd"),
      scheduled_time: time || undefined,
      address: address.trim(),
      city: city.trim() || undefined,
      pincode: pincode || undefined,
      notes: notes.trim() || undefined,
      estimated_price: service?.base_price || undefined,
    });

    navigate("/dashboard/bookings");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!service) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Service not found</p>
          <Button variant="link" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        {/* Service Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-display font-bold">{service.name}</h2>
                <p className="text-muted-foreground mt-1">{service.description}</p>
                {service.category && (
                  <p className="text-sm text-primary mt-2">{service.category.name}</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center text-lg font-bold">
                  <IndianRupee className="w-5 h-5" />
                  <span>{service.base_price === 0 ? "Free" : service.base_price}</span>
                </div>
                <p className="text-xs text-muted-foreground">{service.price_unit}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Book Service</CardTitle>
            <CardDescription>Fill in the details to complete your booking</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label>Select Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <Label>Preferred Time (Optional)</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={time === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTime(time === slot ? "" : slot)}
                      className="text-xs"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Service Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full address (minimum 10 characters)"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                  }}
                  maxLength={MAX_ADDRESS_LENGTH}
                  className={errors.address ? "border-destructive" : ""}
                  required
                />
                <div className="flex justify-between text-xs">
                  {errors.address ? (
                    <span className="text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.address}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Minimum 10 characters</span>
                  )}
                  <span className="text-muted-foreground">{address.length}/{MAX_ADDRESS_LENGTH}</span>
                </div>
              </div>

              {/* City & Pincode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Your city"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
                    }}
                    maxLength={MAX_CITY_LENGTH}
                    className={errors.city ? "border-destructive" : ""}
                  />
                  {errors.city && (
                    <span className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.city}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="000000"
                    value={pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setPincode(value);
                      if (errors.pincode) setErrors(prev => ({ ...prev, pincode: "" }));
                    }}
                    maxLength={6}
                    className={errors.pincode ? "border-destructive" : ""}
                  />
                  {errors.pincode && (
                    <span className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pincode}
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific requirements or instructions..."
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (errors.notes) setErrors(prev => ({ ...prev, notes: "" }));
                  }}
                  maxLength={MAX_NOTES_LENGTH}
                  className={errors.notes ? "border-destructive" : ""}
                />
                <div className="flex justify-between text-xs">
                  {errors.notes ? (
                    <span className="text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.notes}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">&nbsp;</span>
                  )}
                  <span className="text-muted-foreground">{notes.length}/{MAX_NOTES_LENGTH}</span>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!date || !address || createBooking.isPending}
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BookService;
