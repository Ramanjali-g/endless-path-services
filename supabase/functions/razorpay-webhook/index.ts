import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

// Webhook does not need CORS as it's called from Razorpay servers
serve(async (req) => {
  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the raw body for signature verification
    const rawBody = await req.text();
    
    // Get Razorpay webhook signature from header
    const webhookSignature = req.headers.get("X-Razorpay-Signature");
    if (!webhookSignature) {
      console.error("Missing webhook signature");
      return new Response(
        JSON.stringify({ error: "Missing signature" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get webhook secret (this should be configured in Razorpay dashboard)
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    if (!webhookSecret) {
      // If no webhook secret configured, use the key secret
      const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
      if (!razorpayKeySecret) {
        console.error("No webhook or key secret configured");
        return new Response(
          JSON.stringify({ error: "Service not configured" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") || Deno.env.get("RAZORPAY_KEY_SECRET")!;
    
    // Verify webhook signature
    const expectedSignature = createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== webhookSignature) {
      console.error("Webhook signature verification failed");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`Processing Razorpay webhook event: ${event}`);

    // Initialize admin Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Handle different event types
    switch (event) {
      case "payment.captured":
      case "payment.authorized": {
        const paymentEntity = payload.payload.payment.entity;
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;

        // For captured payments, we need to generate signature ourselves
        // since webhook provides verification via the signature header
        const { data: verified, error: verifyError } = await supabaseAdmin.rpc(
          "verify_payment",
          {
            _razorpay_order_id: orderId,
            _razorpay_payment_id: paymentId,
            _razorpay_signature: `webhook_verified_${Date.now()}`, // Mark as webhook verified
          }
        );

        if (verifyError) {
          console.error("Failed to verify payment via webhook:", verifyError);
          // Don't return error - acknowledge receipt to Razorpay
        } else {
          console.log(`Payment ${paymentId} for order ${orderId} verified via webhook`);
        }
        break;
      }

      case "payment.failed": {
        const paymentEntity = payload.payload.payment.entity;
        const orderId = paymentEntity.order_id;
        const reason = paymentEntity.error_description || "Payment failed";

        const { error: failError } = await supabaseAdmin.rpc(
          "fail_payment",
          {
            _razorpay_order_id: orderId,
            _reason: reason,
          }
        );

        if (failError) {
          console.error("Failed to mark payment as failed:", failError);
        } else {
          console.log(`Payment for order ${orderId} marked as failed: ${reason}`);
        }
        break;
      }

      case "order.paid": {
        // Order has been fully paid
        const orderEntity = payload.payload.order.entity;
        console.log(`Order ${orderEntity.id} has been paid`);
        // The payment.captured event should have already handled this
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    // Always return 200 to acknowledge receipt
    // Razorpay will retry if we return error status
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 200 to prevent retries for parsing errors
    return new Response(
      JSON.stringify({ received: true, error: "Processing error" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
});