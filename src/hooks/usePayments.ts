import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PaymentOrder {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  payment_id: string;
  booking_id: string;
  service_name: string;
}

interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  invoice_number: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

export const useCreatePaymentOrder = () => {
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (bookingId: string): Promise<PaymentOrder> => {
      const response = await supabase.functions.invoke("create-payment-order", {
        body: { booking_id: bookingId },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create payment order");
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data as PaymentOrder;
    },
    onError: (error) => {
      toast.error("Failed to initiate payment: " + error.message);
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (verification: PaymentVerification) => {
      const response = await supabase.functions.invoke("verify-payment", {
        body: verification,
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to verify payment");
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Payment verified successfully!");
    },
    onError: (error) => {
      toast.error("Payment verification failed: " + error.message);
    },
  });
};

export const usePayments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          id,
          booking_id,
          user_id,
          amount,
          currency,
          status,
          razorpay_order_id,
          razorpay_payment_id,
          invoice_number,
          payment_method,
          created_at,
          updated_at
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!user,
  });
};

export const usePaymentForBooking = (bookingId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payment", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          id,
          booking_id,
          amount,
          currency,
          status,
          razorpay_order_id,
          razorpay_payment_id,
          created_at
        `)
        .eq("booking_id", bookingId)
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      return data as Payment | null;
    },
    enabled: !!user && !!bookingId,
  });
};

// Declare Razorpay types for TypeScript
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async (
  order: PaymentOrder,
  userDetails: { name?: string; email?: string; phone?: string },
  onSuccess: (response: RazorpayResponse) => void,
  onDismiss?: () => void
): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    throw new Error("Failed to load Razorpay SDK");
  }

  const options: RazorpayOptions = {
    key: order.key_id,
    amount: Math.round(order.amount * 100), // in paise
    currency: order.currency,
    name: "Endless Path",
    description: `Payment for ${order.service_name}`,
    order_id: order.order_id,
    handler: onSuccess,
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.phone,
    },
    theme: {
      color: "#6366f1", // Primary color
    },
    modal: {
      ondismiss: onDismiss,
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
