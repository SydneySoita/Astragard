import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function SupportModule() {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl">Support</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
          <CardContent className="p-5">
            <BookOpen className="h-5 w-5 text-secondary mb-3" />
            <div className="font-heading">Creative Guide</div>
            <p className="text-xs text-primary-foreground/60 mt-1 font-body">How to make the most of your Astragard space.</p>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
          <CardContent className="p-5">
            <Mail className="h-5 w-5 text-secondary mb-3" />
            <div className="font-heading">Contact us</div>
            <p className="text-xs text-primary-foreground/60 mt-1 mb-3 font-body">Direct line to the Astragard team.</p>
            <Link to="/contact"><Button size="sm" variant="outline">Reach out</Button></Link>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
          <CardContent className="p-5">
            <LifeBuoy className="h-5 w-5 text-secondary mb-3" />
            <div className="font-heading">Discovery call</div>
            <p className="text-xs text-primary-foreground/60 mt-1 mb-3 font-body">Talk through your work with our team.</p>
            <Link to="/contact"><Button size="sm" className="gradient-bg text-primary-foreground">Book</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
