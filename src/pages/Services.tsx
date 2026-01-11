import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import {
  Wrench,
  Car,
  Fuel,
  Zap,
  Cpu,
  Smartphone,
  Laptop,
  SprayCanIcon,
  Droplets,
  ShoppingBag,
  Printer,
  FileText,
  Truck,
  Navigation,
  UserCheck,
  UtensilsCrossed,
  Building2,
  PartyPopper,
  Users,
  Hammer,
  Package,
  GraduationCap,
  BookOpen,
  Tractor,
  Leaf,
  Recycle,
  Trash2,
  Plus,
} from "lucide-react";

const serviceCategories = [
  {
    id: "emergency",
    title: "Emergency Services",
    description: "24/7 immediate assistance when you need it most",
    services: [
      { icon: Wrench, title: "Bike & Car Repair", description: "Quick roadside assistance for vehicle breakdowns" },
      { icon: Car, title: "Tyre Puncture Services", description: "Fast puncture repair and tyre replacement" },
      { icon: Fuel, title: "Fuel Assistance", description: "Emergency fuel delivery to your location" },
    ],
  },
  {
    id: "technical",
    title: "Technical & Utility Services",
    description: "Expert technicians for all your repair needs",
    services: [
      { icon: Cpu, title: "Electronics Repair", description: "TV, AC, refrigerator, and appliance repairs" },
      { icon: Zap, title: "Electrical Works", description: "Wiring, installations, and electrical repairs" },
      { icon: Smartphone, title: "Mobile Repair", description: "Screen replacement, software fixes, and more" },
      { icon: Laptop, title: "Laptop Repair", description: "Hardware and software troubleshooting" },
    ],
  },
  {
    id: "home",
    title: "Home & Daily Need Services",
    description: "Making everyday life easier for you",
    services: [
      { icon: SprayCanIcon, title: "Home Cleaning", description: "Professional deep cleaning services" },
      { icon: Droplets, title: "Water Can Delivery", description: "Fresh drinking water delivered to your door" },
      { icon: ShoppingBag, title: "Grocery Delivery", description: "Delivery from local kirana stores" },
    ],
  },
  {
    id: "printing",
    title: "Printing & Business Support",
    description: "Professional printing for all occasions",
    services: [
      { icon: Printer, title: "DTP Services", description: "Design and desktop publishing" },
      { icon: FileText, title: "Visiting Cards", description: "Professional business card printing" },
      { icon: FileText, title: "Pamphlets & Printing", description: "All types of printing services" },
    ],
  },
  {
    id: "transport",
    title: "Transport & Travel Services",
    description: "Reliable transportation solutions",
    services: [
      { icon: Truck, title: "Cab Sharing", description: "Affordable shared cab services" },
      { icon: Navigation, title: "Travel Car Services", description: "Comfortable travel for any distance" },
      { icon: UserCheck, title: "Driver Services", description: "Professional drivers on demand" },
    ],
  },
  {
    id: "food",
    title: "Food Services",
    description: "Delicious meals delivered fresh",
    services: [
      { icon: UtensilsCrossed, title: "Daily Lunch Box", description: "Home-cooked meals delivered daily" },
      { icon: UtensilsCrossed, title: "Parcel Services", description: "Food parcels from local kitchens" },
    ],
  },
  {
    id: "realestate",
    title: "Real Estate & Event Services",
    description: "Professional services for major life events",
    services: [
      { icon: Building2, title: "Real Estate Services", description: "Property buying, selling, and renting" },
      { icon: PartyPopper, title: "Event Management", description: "Complete event planning and execution" },
    ],
  },
  {
    id: "manpower",
    title: "Manpower & Construction Support",
    description: "Skilled and unskilled labor for any project",
    services: [
      { icon: Users, title: "Daily Wage Manpower", description: "Reliable workers for daily needs" },
      { icon: Hammer, title: "Construction Support", description: "Skilled construction workers" },
      { icon: Package, title: "Building Material Supply", description: "Quality construction materials" },
    ],
  },
  {
    id: "education",
    title: "Education & Training",
    description: "Learn and grow with expert guidance",
    services: [
      { icon: GraduationCap, title: "Tuition Services", description: "Quality tutoring for all subjects" },
      { icon: BookOpen, title: "Skill Development", description: "Training and skill enhancement programs" },
    ],
  },
  {
    id: "agriculture",
    title: "Agriculture Support",
    description: "Supporting farmers with essential services",
    services: [
      { icon: Users, title: "Farm Labour Booking", description: "Skilled agricultural workers on demand" },
      { icon: Tractor, title: "Tractor & Equipment Rental", description: "Modern farming equipment" },
      { icon: Leaf, title: "Fertilizer & Seed Delivery", description: "Quality farming inputs delivered" },
    ],
  },
  {
    id: "waste",
    title: "Waste Management",
    description: "Eco-friendly waste disposal solutions",
    services: [
      { icon: Recycle, title: "Scrap Pickup", description: "Convenient scrap collection service" },
      { icon: Trash2, title: "E-Waste Collection", description: "Responsible e-waste recycling" },
    ],
  },
  {
    id: "open",
    title: "Open Platform",
    description: "Join our growing community of service providers",
    services: [
      { icon: Plus, title: "Register Your Business", description: "Other businesses and individuals can register and offer services through our app" },
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/20">
        <div className="container-custom">
          <SectionHeader
            badge="Our Services"
            title="Everything You Need, One Platform"
            description="From emergency repairs to daily essentials, education to agriculture—we connect you with verified local service providers for every need."
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom space-y-16">
          {serviceCategories.map((category) => (
            <div key={category.id} id={category.id}>
              <div className="mb-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {category.title}
                </h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.services.map((service, index) => (
                  <ServiceCard
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
