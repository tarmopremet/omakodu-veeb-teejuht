import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TrackingProvider } from "./components/TrackingProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { OfflineDetector } from "./components/OfflineDetector";
import { MobileOptimization } from "./components/MobileOptimization";
import { SecurityHeader } from "./components/SecurityHeader";
import { HealthIndicator } from "./hooks/useHealthCheck";
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import Tartu from "./pages/Tartu";
import Parnu from "./pages/Parnu";
import Rakvere from "./pages/Rakvere";
import Saku from "./pages/Saku";
import BookingPage from "./pages/BookingPage";
import RentalDetail from "./pages/RentalDetail";
import RentalProducts from "./pages/RentalProducts";
import CategoryProducts from "./pages/CategoryProducts";
import SalesProducts from "./pages/SalesProducts";
import { AuthPage } from "./pages/AuthPage";
import { AdminPage } from "./pages/AdminPage";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { UserDashboard } from "./components/UserDashboard";
import NotFound from "./pages/NotFound";
import TekstiilipesuriRent from "./pages/TekstiilipesuriRent";
import AurupesuriRent from "./pages/AurupesuriRent";
import AknapesurobotiRent from "./pages/AknapesurobotiRent";
import TolmuimejaRent from "./pages/TolmuimejaRent";
import AknapesuriRent from "./pages/AknapesuriRent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <SecurityHeader />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TrackingProvider>
          <MobileOptimization>
            <TooltipProvider>
              <OfflineDetector />
              <HealthIndicator />
              <Toaster />
              <Sonner />
              <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/tallinn" element={<Index />} />
            <Route path="/tallinn/*" element={<Index />} />
            <Route path="/et/tallinn" element={<Index />} />
            <Route path="/tartu" element={<Tartu />} />
            <Route path="/parnu" element={<Parnu />} />
            <Route path="/rakvere" element={<Rakvere />} />
            <Route path="/saku" element={<Saku />} />
            <Route path="/renditooted" element={<RentalProducts />} />
            <Route path="/renditooted/tekstiilipesurid" element={<TekstiilipesuriRent />} />
            <Route path="/renditooted/aurupesurid" element={<AurupesuriRent />} />
            <Route path="/renditooted/aknapesurobotid" element={<AknapesurobotiRent />} />
            <Route path="/renditooted/aknapesurid" element={<AknapesuriRent />} />
            <Route path="/renditooted/tolmuimejad" element={<TolmuimejaRent />} />
            <Route path="/renditooted/:category" element={<CategoryProducts />} />
            <Route path="/myygitooted" element={<SalesProducts />} />
            <Route path="/et/broneeri/:city" element={<BookingPage />} />
            <Route path="/et/rendi/:slug" element={<RentalDetail />} />
            <Route path="/tekstiilipesuri-rent" element={<TekstiilipesuriRent />} />
            <Route path="/aurupesuri-rent" element={<AurupesuriRent />} />
            <Route path="/aknapesuroboti-rent" element={<AknapesurobotiRent />} />
            <Route path="/tolmuimeja-rent" element={<TolmuimejaRent />} />
            <Route path="/aknapesuri-rent" element={<AknapesuriRent />} />
            <Route path="/kasutajatingimused" element={<TermsAndConditions />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </MobileOptimization>
        </TrackingProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
