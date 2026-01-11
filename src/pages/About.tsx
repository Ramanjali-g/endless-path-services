import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CheckCircle2, Target, Eye, Users, Lightbulb } from "lucide-react";

const objectives = [
  "Provide multiple services through a single mobile application",
  "Generate employment for youth, skilled, and unskilled workers",
  "Support local businesses and service providers",
  "Promote digital services in line with Government initiatives",
  "Bridge the gap between service providers and consumers",
  "Offer quick, reliable, and affordable services especially during emergencies",
];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "Every decision we make is guided by our mission to create employment and serve communities.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We prioritize local businesses and workers, strengthening the economic fabric of communities.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear pricing, verified providers, and honest communication in all our dealings.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuously improving our platform to better serve users and create new opportunities.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Empowering Communities Through Digital Innovation
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Endless Path bridges the gap between service providers and consumers by offering quick, reliable, and affordable services, especially during emergencies.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                badge="Our Story"
                title="Four Young Entrepreneurs, One Vision"
                align="left"
              />
              <p className="text-muted-foreground text-lg leading-relaxed mt-6 mb-4">
                Endless Path is a multi-service mobile application initiated by four young entrepreneurs who recognized the untapped potential in connecting local service providers with consumers who need them.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Our platform provides essential services through a single digital interface while generating large-scale employment opportunities for local people across various sectors.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                From emergency repairs to daily essentials, from skilled technicians to daily wage workers—we're building an ecosystem that benefits everyone.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-12">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                What Sets Us Apart
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Single Platform</h4>
                    <p className="text-muted-foreground text-sm">All services accessible through one app</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Local Focus</h4>
                    <p className="text-muted-foreground text-sm">Empowering local service providers</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Emergency Ready</h4>
                    <p className="text-muted-foreground text-sm">24/7 availability for urgent needs</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Employment First</h4>
                    <p className="text-muted-foreground text-sm">Creating jobs at every level</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <SectionHeader
            badge="Our Goals"
            title="Objectives of the Project"
            description="Clear goals driving our mission to transform service delivery and employment generation."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {objectives.map((objective, index) => (
              <div key={index} className="card-elevated p-6 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground font-medium">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="Our Values"
            title="What We Believe In"
            description="The principles that guide every decision we make."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
