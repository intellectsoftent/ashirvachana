import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { OrderProvider } from "@/context/OrderContext";
import { UserProvider } from "@/context/UserContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Idols from "./pages/Idols";
import IdolDetail from "./pages/IdolDetail";
import Cart from "./pages/Cart";
import Poojas from "./pages/Poojas";
import PoojaDetail from "./pages/PoojaDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CancellationPolicy from "./pages/CancellationPolicy";
import NotFound from "./pages/NotFound";
import FloatingSocials from "./components/FloatingSocials";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <UserProvider>
        <OrderProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FloatingSocials />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/idols" element={<Idols />} />
              <Route path="/idols/:id" element={<IdolDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/poojas" element={<Poojas />} />
              <Route path="/poojas/:id" element={<PoojaDetail />} />
              <Route path="/blog" element={<Blogs />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/cancellation-policy" element={<CancellationPolicy />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
        </OrderProvider>
        </UserProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
