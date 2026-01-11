import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  TrendingDown,
  Building2,
  Globe,
  Briefcase,
  Receipt,
  GraduationCap,
  Scale,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Reduction in Unemployment",
    description: "Creating direct and indirect jobs across multiple sectors, reducing the unemployment burden on the government.",
  },
  {
    icon: Building2,
    title: "Strengthening Local Economy",
    description: "Supporting local businesses and vendors, keeping money circulating within the community.",
  },
  {
    icon: Globe,
    title: "Support for Digital India",
    description: "Aligned with Digital India & Startup India initiatives, promoting digital adoption among citizens.",
  },
  {
    icon: Briefcase,
    title: "Reduced Workload on Departments",
    description: "Efficient service delivery reduces the burden on government departments and public services.",
  },
  {
    icon: Receipt,
    title: "Increased GST & Tax Revenue",
    description: "Formalizing the service sector leads to increased tax compliance and revenue generation.",
  },
  {
    icon: GraduationCap,
    title: "Skill Development & Youth Empowerment",
    description: "Training and employment opportunities for youth, building a skilled workforce.",
  },
  {
    icon: Scale,
    title: "Balanced Rural & Urban Development",
    description: "Services available across rural and urban areas, promoting equitable growth.",
  },
  {
    icon: Users,
    title: "Community Development",
    description: "Strengthening social fabric through local employment and service accessibility.",
  },
];

const GovernmentBenefits = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/20">
        <div className="container-custom">
          <SectionHeader
            badge="Government Benefits"
            title="Contributing to National Development"
            description="Endless Path aligns with government initiatives to create employment, boost the economy, and promote digital services across India."
          />
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-elevated p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alignment Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                badge="Aligned with National Goals"
                title="Supporting Government Initiatives"
                align="left"
              />
              <p className="text-muted-foreground text-lg leading-relaxed mt-6 mb-6">
                Our platform directly supports key government programs aimed at digital transformation and employment generation.
              </p>
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-1">Digital India</h4>
                  <p className="text-muted-foreground text-sm">
                    Promoting digital services and cashless transactions
                  </p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-1">Startup India</h4>
                  <p className="text-muted-foreground text-sm">
                    Entrepreneurship-driven innovation and job creation
                  </p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-1">Skill India</h4>
                  <p className="text-muted-foreground text-sm">
                    Training and empowering the workforce
                  </p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-1">Make in India</h4>
                  <p className="text-muted-foreground text-sm">
                    Promoting local services and businesses
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 lg:p-12 text-primary-foreground">
              <h3 className="font-display text-2xl font-bold mb-6">Economic Impact</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold mb-1">₹1 Cr+</div>
                  <p className="text-primary-foreground/80">Projected annual revenue</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">300+</div>
                  <p className="text-primary-foreground/80">Jobs created</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">50+</div>
                  <p className="text-primary-foreground/80">Local businesses supported</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">10,000+</div>
                  <p className="text-primary-foreground/80">Citizens served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GovernmentBenefits;
