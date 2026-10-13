import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopRibbon from "../components/home/TopRibbon.jsx";
import HeroShowcase from "../components/home/HeroShowcase.jsx";
import CategoryOverview from "../components/home/CategoryOverview.jsx";
import FeaturedBestsellers from "../components/home/FeaturedBestsellers.jsx";
import FansShowcase from "../components/home/FansShowcase.jsx";
import WaterHeaters from "../components/home/WaterHeaters.jsx";
import KitchenGrid from "../components/home/KitchenGrid.jsx";
import HomeAppliances from "../components/home/HomeAppliances.jsx";
import SmartLights from "../components/home/SmartLights.jsx";
import ValuePillars from "../components/home/ValuePillars.jsx";
import OrderForm from "../components/home/OrderForm.jsx";

// Home page = the reference design (code.html), section for section.
export default function Home() {
  const { hash } = useLocation();

  // Header/footer links like /#fans-showcase: React Router doesn't scroll to hashes by itself.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView();
  }, [hash]);

  return (
    <div className="flex flex-col w-full">
      {/* <TopRibbon /> */}
      <HeroShowcase />
      <CategoryOverview />
      <FeaturedBestsellers />
      <FansShowcase />
      <WaterHeaters />
      <KitchenGrid />
      <HomeAppliances />
      <SmartLights />
      <ValuePillars />
      <OrderForm />
    </div>
  );
}
