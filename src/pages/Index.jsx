import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategorySection } from "@/components/home/CategorySection";
import { PromoSection } from "@/components/home/PromoSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
      <PromoSection />
      <NewsletterSection />
    </main>
  );
};

export default Index;

