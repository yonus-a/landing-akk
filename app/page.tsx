import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { WorkflowSection } from "@/components/WorkflowSection";
import { GlobalDeliverySection } from "@/components/GlobalDeliverySection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { CostEstimatorForm } from "@/components/CostEstimatorForm";
import { GlobalHubsSection } from "@/components/GlobalHubsSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-zinc-900 selection:text-white transition-colors duration-300">
      {/* Sticky Architectural Header */}
      <Navbar />

      {/* Main Corporate Landing Flow */}
      <main className="flex-1 w-full bg-white dark:bg-zinc-950">
        {/* Step 3: Enhanced 3D Scrollytelling Hero */}
        <Hero />

        {/* Step 4: Modular Corporate Sections */}
        <ServicesSection />
        <WorkflowSection />

        {/* Interactive 3D Global Reach to Final Handover Scene */}
        <GlobalDeliverySection />

        <WhyUsSection />
        {/* <CostEstimatorForm /> */}
        <GlobalHubsSection />
        <FaqSection />
      </main>

      {/* High-Contrast Architectural Corporate Footer */}
      <Footer />
    </div>
  );
}
