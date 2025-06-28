import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/wallet/wallet-provider";
import Home from "@/pages/home";
import AdminPanel from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-moon text-6xl text-[var(--gold)] mb-4 animate-pulse"></i>
          <div className="text-white text-xl">Loading Nightfall Casino...</div>
        </div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminPanel} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <div className="dark">
            <Toaster />
            <Router />
          </div>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
