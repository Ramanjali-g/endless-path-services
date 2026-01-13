import { z } from "zod";

export const bookingSchema = z.object({
  service_id: z.string().uuid("Invalid service ID"),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  scheduled_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters")
    .trim(),
  city: z
    .string()
    .max(100, "City must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  pincode: z
    .string()
    .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  estimated_price: z.number().min(0).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const validateBookingData = (data: unknown) => {
  return bookingSchema.safeParse(data);
};
