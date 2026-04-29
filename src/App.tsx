import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IntroLoader } from "@/components/IntroLoader";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorksBrands from "./pages/HowItWorksBrands";
import HowItWorksCreatives from "./pages/HowItWorksCreatives";
import Incubator from "./pages/Incubator";
import Marketplace from "./pages/Marketplace";
import Omnificense from "./pages/Omnificense";
import Collaborations from "./pages/Collaborations";
import DragonsVault from "./pages/DragonsVault";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("astragard_intro_seen"));
  const handleIntroComplete = () => {
    sessionStorage.setItem("astragard_intro_seen", "true");
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showIntro && <IntroLoader onComplete={handleIntroComplete} />}
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works/brands" element={<HowItWorksBrands />} />
              <Route path="/how-it-works/creatives" element={<HowItWorksCreatives />} />
              <Route path="/incubator" element={<Incubator />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/omnificense" element={<Omnificense />} />
              <Route path="/collaborations" element={<Collaborations />} />
              <Route path="/dragons-vault" element={<DragonsVault />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal/:page" element={<Legal />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
