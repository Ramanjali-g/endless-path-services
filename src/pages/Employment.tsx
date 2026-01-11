import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCounter } from "@/components/ui/StatCounter";
import {
  Wrench,
  Zap,
  Car,
  Printer,
  Hammer,
  Leaf,
  SprayCanIcon,
  GraduationCap,
  Users,
  Briefcase,
  TrendingUp,
  Building,
} from "lucide-react";

const jobCategories = [
  { icon: Wrench, title: "Mechanics & Technicians", description: "Vehicle repair, appliance repair specialists" },
  { icon: Zap, title: "Electricians & Electronics Staff", description: "Electrical works, electronics repair experts" },
  { icon: Car, title: "Drivers & Delivery Personnel", description: "Professional drivers, delivery executives" },
  { icon: Printer, title: "Printing & DTP Operators", description: "Design and printing professionals" },
  { icon: Hammer, title: "Construction & Daily Wage Workers", description: "Skilled and unskilled construction labor" },
  { icon: Leaf, title: "Farm Labourers", description: "Agricultural workers, farming specialists" },
  { icon: SprayCanIcon, title: "Cleaning Staff", description: "Home and commercial cleaning professionals" },
  { icon: GraduationCap, title: "Tutors & Trainers", description: "Education and skill development experts" },
];

const Employment = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/20">
        <div className="container-custom">
          <SectionHeader
            badge="Employment Generation"
            title="Creating Opportunities for Everyone"
            description="Endless Path facilitates both direct and indirect employment across multiple sectors, empowering skilled and unskilled workers alike."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">100+</div>
              <p className="text-primary-foreground/80 font-medium">Direct Employment</p>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">200+</div>
              <p className="text-primary-foreground/80 font-medium">Indirect Employment</p>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">15+</div>
              <p className="text-primary-foreground/80 font-medium">Job Categories</p>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">50+</div>
              <p className="text-primary-foreground/80 font-medium">Partner Businesses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="Job Categories"
            title="Diverse Employment Opportunities"
            description="We create jobs across various sectors, from technical specialists to daily wage workers."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {jobCategories.map((category, index) => (
              <div key={index} className="card-elevated p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <category.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{category.title}</h3>
                <p className="text-muted-foreground text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                badge="Our Impact"
                title="Building a Stronger Economy"
                align="left"
              />
              <p className="text-muted-foreground text-lg leading-relaxed mt-6 mb-6">
                By connecting local service providers with consumers, we're not just creating jobs—we're building sustainable livelihoods and strengthening community economies.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Inclusive Employment</h4>
                    <p className="text-muted-foreground text-sm">
                      Opportunities for both skilled professionals and unskilled workers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Self-Employment</h4>
                    <p className="text-muted-foreground text-sm">
                      Platform for individuals to start their own service businesses
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Income Growth</h4>
                    <p className="text-muted-foreground text-sm">
                      Consistent work opportunities leading to stable income
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Local Business Support</h4>
                    <p className="text-muted-foreground text-sm">
                      Boosting local vendors and small businesses
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 lg:p-12 text-primary-foreground">
              <h3 className="font-display text-2xl font-bold mb-6">Join Our Growing Network</h3>
              <p className="text-primary-foreground/80 mb-8">
                Whether you're a skilled technician, a local vendor, or looking for daily work—there's a place for you at Endless Path.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Flexible working hours</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Consistent work opportunities</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Training and skill development</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Digital platform support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Employment;
