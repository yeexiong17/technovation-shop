import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export function PromoSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column - Text */}
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Limited Time
            </p>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight mb-6">
              Save up to
              <br />
              <span className="italic">40% off</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
              Exceptional quality meets unbeatable value. Explore our seasonal collection with exclusive pricing.
            </p>
            <Link href="/products" className="w-fit">
              <Button size="lg" className="group">
                Shop the Sale
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Right column - Visual */}
          <div className="aspect-square bg-card flex items-center justify-center relative overflow-hidden">
            <span className="font-display text-[12rem] md:text-[16rem] text-foreground/5 select-none">
              40
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Percent Off
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-16">
          {[
            { label: "Free Shipping", value: "Orders $100+" },
            { label: "Warranty", value: "2 Years" },
            { label: "Support", value: "24/7" },
            { label: "Returns", value: "30 Days" },
          ].map((feature) => (
            <div key={feature.label} className="bg-background p-6 md:p-8 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {feature.label}
              </p>
              <p className="font-display text-xl">
                {feature.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

