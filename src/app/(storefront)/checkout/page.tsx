import { CheckoutForm } from "@/src/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/src/components/checkout/CheckoutSummary";

export default function CheckoutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        
        {/* Simplified Header for Checkout focus */}
        <div className="mb-12 border-b border-taupe/20 pb-8 text-center lg:text-left">
           <h1 className="text-2xl font-serif text-obsidian tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 relative">
            <CheckoutSummary />
          </div>

        </div>
      </div>
    </div>
  );
}
