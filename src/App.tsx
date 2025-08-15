import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import Tartu from "./pages/Tartu";
import Parnu from "./pages/Parnu";
import Rakvere from "./pages/Rakvere";
import Saku from "./pages/Saku";
import BookingPage from "./pages/BookingPage";
import RentalDetail from "./pages/RentalDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/tallinn" element={<Index />} />
          <Route path="/tartu" element={<Tartu />} />
          <Route path="/parnu" element={<Parnu />} />
          <Route path="/rakvere" element={<Rakvere />} />
          <Route path="/saku" element={<Saku />} />
          <Route path="/et/broneeri/:city" element={<BookingPage />} />
          <Route path="/et/rendi/:slug" element={<RentalDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
