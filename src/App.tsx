import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
import LeadsPage from "./pages/LeadsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <MobileNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
