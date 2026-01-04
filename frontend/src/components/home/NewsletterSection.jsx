import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to TechNovation", {
        description: "You'll receive our latest updates soon.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-background/60 mb-4">
            Stay Informed
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">
            Join the Newsletter
          </h2>
          <p className="text-background/70 mb-10">
            Be the first to know about new arrivals, exclusive offers, and tech insights.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background/10 border-background/20 text-background placeholder:text-background/50"
              required
            />
            <Button 
              type="submit" 
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

