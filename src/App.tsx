import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public Pages
import Splash from "./pages/Splash";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Employment from "./pages/Employment";
import GovernmentBenefits from "./pages/GovernmentBenefits";
import Compliance from "./pages/Compliance";
import SocialImpact from "./pages/SocialImpact";
import Declaration from "./pages/Declaration";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Pages
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import BrowseServices from "./pages/dashboard/BrowseServices";
import BookService from "./pages/dashboard/BookService";
import MyBookings from "./pages/dashboard/MyBookings";

// Provider Pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ServiceRequests from "./pages/provider/ServiceRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Splash */}
            <Route path="/" element={<Splash />} />
            
            {/* Public Routes */}
            <Route path="/home" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/employment" element={<Employment />} />
            <Route path="/government-benefits" element={<GovernmentBenefits />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/social-impact" element={<SocialImpact />} />
            <Route path="/declaration" element={<Declaration />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Customer Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/services" element={<ProtectedRoute><BrowseServices /></ProtectedRoute>} />
            <Route path="/dashboard/book/:serviceId" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
            <Route path="/dashboard/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

            {/* Provider Dashboard Routes */}
            <Route path="/provider/dashboard" element={<ProtectedRoute requiredRole="provider"><ProviderDashboard /></ProtectedRoute>} />
            <Route path="/provider/requests" element={<ProtectedRoute requiredRole="provider"><ServiceRequests /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
