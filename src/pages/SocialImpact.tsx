import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  Briefcase,
  Store,
  Wallet,
  Users,
  Heart,
  Lightbulb,
} from "lucide-react";

const impacts = [
  {
    icon: Briefcase,
    title: "Self-Employment Opportunities",
    description: "Enabling individuals to start their own service businesses with minimal investment, fostering entrepreneurship at the grassroots level.",
  },
  {
    icon: Store,
    title: "Local Vendor Empowerment",
    description: "Connecting local shops and service providers with a wider customer base, increasing their visibility and revenue potential.",
  },
  {
    icon: Wallet,
    title: "Affordable Services for Citizens",
    description: "Making quality services accessible to all income groups through competitive pricing and transparent transactions.",
  },
  {
    icon: Users,
    title: "Inclusive Growth",
    description: "Creating opportunities for both skilled professionals and unskilled workers, ensuring no one is left behind in the digital economy.",
  },
  {
    icon: Heart,
    title: "Community Development",
    description: "Strengthening social bonds by keeping services local and fostering trust-based relationships between providers and consumers.",
  },
  {
    icon: Lightbulb,
    title: "Digital Literacy",
    description: "Training service providers in digital tools and platforms, preparing them for the future of work.",
  },
];

const SocialImpact = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/20">
        <div className="container-custom">
          <SectionHeader
            badge="Social Impact"
            title="Making a Difference, One Service at a Time"
            description="Beyond business, Endless Path is committed to creating positive social change in the communities we serve."
          />
        </div>
      </section>

      {/* Impact Cards */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {impacts.map((impact, index) => (
              <div key={index} className="card-elevated p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                  <impact.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">
                  {impact.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {impact.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Our Vision for the Future
            </h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed mb-8">
              We envision a future where every individual has access to quality services and every service provider has the opportunity to earn a dignified livelihood. Through technology and community, we're building that future today.
            </p>
            <div className="grid sm:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">2025</div>
                <p className="text-primary-foreground/80">Expand to 10 Districts</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">1000+</div>
                <p className="text-primary-foreground/80">Service Providers</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50K+</div>
                <p className="text-primary-foreground/80">Citizens Served</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SocialImpact;
