import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FileCheck } from "lucide-react";

const Declaration = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/20">
        <div className="container-custom">
          <SectionHeader
            badge="Declaration"
            title="Official Declaration"
            description="A formal statement regarding the authenticity of information provided by Endless Path."
          />
        </div>
      </section>

      {/* Declaration Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="card-elevated p-8 sm:p-12">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileCheck className="w-10 h-10 text-primary" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  DECLARATION
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We hereby declare that the information provided in this document and on our platform is true and accurate to the best of our knowledge and belief.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  All data, statistics, and claims made regarding our services, employment generation, and social impact are based on our operational records and genuine projections.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  This document has been prepared for official submission purposes to relevant government authorities, potential partners, and stakeholders.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  We commit to maintaining transparency in all our operations and will promptly update any information that may change over time.
                </p>

                <div className="border-t border-border pt-8 mt-8">
                  <p className="text-foreground font-semibold mb-2">Submitted by:</p>
                  <p className="text-primary font-display text-xl font-bold mb-1">ENDLESS PATH</p>
                  <p className="text-muted-foreground">(Startup Team)</p>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Place: India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Declaration;
