import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CheckCircle2 } from "lucide-react";

const requirements = [
  {
    category: "Infrastructure",
    items: ["Laptop and computer systems", "Reliable internet connection", "Office space for operations"],
  },
  {
    category: "Business Registration",
    items: ["Company/LLP/Proprietorship registration", "PAN and TAN registration", "Bank account in business name"],
  },
  {
    category: "Startup Certification",
    items: ["DPIIT Startup India recognition", "Startup India certificate", "Innovation documentation"],
  },
  {
    category: "Tax & Financial",
    items: ["GST registration", "Income tax filings", "Financial audits and compliance"],
  },
  {
    category: "Sector-Specific Licenses",
    items: ["Food safety license (FSSAI)", "Trade license from local authority", "Labour license for workers"],
  },
  {
    category: "Additional Permits",
    items: ["Shop and establishment registration", "Professional tax registration", "Insurance coverage"],
  },
];

const Compliance = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/20">
        <div className="container-custom">
          <SectionHeader
            badge="Compliance & Requirements"
            title="Operating with Full Legal Compliance"
            description="Endless Path maintains all necessary registrations, licenses, and certifications to operate as a legitimate startup platform."
          />
        </div>
      </section>

      {/* Requirements Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req, index) => (
              <div key={index} className="card-elevated p-6">
                <h3 className="font-display font-semibold text-lg text-foreground mb-4 pb-4 border-b border-border">
                  {req.category}
                </h3>
                <ul className="space-y-3">
                  {req.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Commitment to Transparency
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              We believe in operating with complete transparency and adherence to all regulatory requirements. Our compliance ensures trust with both our service providers and customers.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>Fully Compliant Startup</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Compliance;
