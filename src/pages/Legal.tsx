import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const legalPages: Record<string, string> = {
  terms: "Terms of Use",
  privacy: "Privacy Policy",
  copyright: "Copyright Policy",
  seller: "Seller Policy",
  payment: "Payment Terms",
  incubator: "Incubator Agreement",
};

export default function Legal() {
  const { page } = useParams<{ page: string }>();
  const title = legalPages[page || ""] || "Legal";

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl text-primary-foreground font-bold">{title}</h1>
          <div className="mt-8 p-8 border border-astragard-charcoal/20 rounded-lg">
            <p className="text-primary-foreground/50 font-body">
              Content pending legal review. This page will be updated with the full {title.toLowerCase()} prior to platform launch.
            </p>
            <p className="text-primary-foreground/30 font-ui text-sm mt-6">
              Last updated: April 2026
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
