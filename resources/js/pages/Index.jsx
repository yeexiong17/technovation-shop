import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategorySection } from "@/components/home/CategorySection";
import { PromoSection } from "@/components/home/PromoSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import Layout from "@/Layout";

const Index = ({ featuredProducts = [], categories = [] }) => {
  return (
    <Layout>
      <main>
        <HeroSection />
        <FeaturedProducts products={featuredProducts} />
        <CategorySection categories={categories} />
        <PromoSection />
        <NewsletterSection />
      </main>
    </Layout>
  );
};

export default Index;
