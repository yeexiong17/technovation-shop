import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-rule pb-4 mb-12 animate-reveal">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Est. 2026
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Technology & Innovation
          </span>
        </div>

        {/* Main headline */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4">
          <div className="lg:col-span-8">
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight animate-reveal">
              The Future
              <br />
              <span className="italic font-normal">is now</span>
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end animate-reveal-delay-1">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Curated technology for those who appreciate craft, precision, and timeless design.
            </p>
            <Link to="/products">
              <Button size="lg" className="group w-fit">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured image grid */}
        <div className="grid grid-cols-12 gap-4 mt-16">
          <div className="col-span-12 md:col-span-7 aspect-[4/3] overflow-hidden animate-reveal-delay-2">
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80"
              alt="Premium laptop on minimal desk"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="col-span-6 md:col-span-5 aspect-square overflow-hidden animate-reveal-delay-3">
            <img
              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"
              alt="Minimalist headphones"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="col-span-6 md:col-span-4 aspect-[3/4] overflow-hidden animate-reveal-delay-3">
            <img
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80"
              alt="Smart watch"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="hidden md:flex col-span-8 items-center justify-center border border-border p-12">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                New Arrival
              </p>
              <p className="font-display text-2xl italic">
                Quantum Series
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

