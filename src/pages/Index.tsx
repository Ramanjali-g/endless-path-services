import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { StatCounter } from "@/components/ui/StatCounter";
import { Layout } from "@/components/layout/Layout";
import {
  Wrench,
  Car,
  Zap,
  Home,
  Truck,
  UtensilsCrossed,
  Building2,
  Users,
  GraduationCap,
  Tractor,
  Recycle,
  ArrowRight,
  CheckCircle2,
  Target,
  Globe,
  Shield,
} from "lucide-react";

const featuredServices = [
  {
    icon: Wrench,
    title: "Emergency Services",
    description: "24/7 bike repair, car repair, tyre puncture services, and fuel assistance.",
  },
  {
    icon: Zap,
    title: "Technical Services",
    description: "Electronics repair, electrical works, mobile and laptop repairs.",
  },
  {
    icon: Home,
    title: "Home Services",
    description: "Home cleaning, water delivery, grocery delivery from local stores.",
  },
  {
    icon: Truck,
    title: "Transport Services",
    description: "Cab sharing, traveling car services, and professional drivers.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food Services",
    description: "Daily lunch box and parcel services from local kitchens.",
  },
  {
    icon: Users,
    title: "Manpower Support",
    description: "Daily wage workers, construction support, and building materials.",
  },
];

const benefits = [
  "Quick & reliable service delivery",
  "Affordable pricing for all",
  "Verified service providers",
  "Local employment generation",
  "Support for small businesses",
  "Digital India aligned",
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground/90 text-sm font-medium mb-6 animate-fade-up">
              🚀 Empowering Communities Through Digital Services
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-up stagger-1">
              ENDLESS PATH
            </h1>

            <p className="text-xl sm:text-2xl text-primary-foreground/80 font-medium mb-4 animate-fade-up stagger-2">
              A Multi-Service Digital Platform for Employment Generation & Public Service Delivery
            </p>

            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-fade-up stagger-3">
              Connecting service providers and consumers through quick, reliable, and affordable services—especially during emergencies. Built by young entrepreneurs to empower local communities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-4">
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="warm" size="xl">
                <Link to="/contact">Join as Service Provider</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatCounter value={100} suffix="+" label="Direct Employment" />
            <StatCounter value={200} suffix="+" label="Indirect Employment" />
            <StatCounter value={20} suffix="+" label="Service Categories" />
            <StatCounter value={1000} suffix="+" label="Happy Customers" />
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-slide-in-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                About Endless Path
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Bridging Services with Employment Opportunities
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Endless Path is a multi-service mobile application initiated by four young entrepreneurs to provide essential services through a single digital platform while generating large-scale employment opportunities for local people.
              </p>
              <ul className="space-y-3 mb-8">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="default" size="lg">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
              <div className="space-y-4">
                <div className="card-elevated p-6 bg-primary text-primary-foreground">
                  <Target className="w-8 h-8 mb-3" />
                  <h4 className="font-display font-semibold mb-1">Our Mission</h4>
                  <p className="text-sm text-primary-foreground/80">
                    Empower communities through digital services
                  </p>
                </div>
                <div className="card-elevated p-6">
                  <Globe className="w-8 h-8 mb-3 text-primary" />
                  <h4 className="font-display font-semibold mb-1">Digital India</h4>
                  <p className="text-sm text-muted-foreground">
                    Aligned with government initiatives
                  </p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="card-elevated p-6">
                  <Users className="w-8 h-8 mb-3 text-primary" />
                  <h4 className="font-display font-semibold mb-1">Youth First</h4>
                  <p className="text-sm text-muted-foreground">
                    Employment for skilled & unskilled workers
                  </p>
                </div>
                <div className="card-elevated p-6 bg-secondary text-secondary-foreground">
                  <Shield className="w-8 h-8 mb-3" />
                  <h4 className="font-display font-semibold mb-1">Reliable</h4>
                  <p className="text-sm text-secondary-foreground/80">
                    Verified providers & quality service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="Our Services"
            title="Everything You Need, One Platform"
            description="From emergency repairs to daily essentials, we've got you covered with verified local service providers."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/services">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Whether you're looking for services or want to offer your skills, Endless Path is your gateway to opportunity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/services">Find a Service</Link>
            </Button>
            <Button asChild variant="warm" size="xl">
              <Link to="/contact">Register as Provider</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
