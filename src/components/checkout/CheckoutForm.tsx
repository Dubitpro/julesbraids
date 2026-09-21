"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormValues } from "@/src/lib/validation/checkout";
import { useCartStore } from "@/src/lib/store/cart";
import { Lock } from "lucide-react";

export function CheckoutForm() {
  const { items } = useCartStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "United States",
    }
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;
    
    console.log("Checkout Data:", data);
    console.log("Cart Items:", items);
    
    // Phase 4: Mocking Paystack Initialization
    alert("Proceeding to Paystack Payment (Mocked). Check console for payload.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      
      {/* Contact Section */}
      <section>
        <h2 className="text-xl font-serif text-obsidian tracking-tight mb-4">Contact</h2>
        <div>
          <input
            type="email"
            placeholder="Email address"
            {...register("email")}
            className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-inset focus:ring-champagne sm:text-sm bg-transparent"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </section>

      {/* Delivery Section */}
      <section>
        <h2 className="text-xl font-serif text-obsidian tracking-tight mb-4">Delivery</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          <div className="sm:col-span-2">
            <select
              {...register("country")}
              className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Nigeria">Nigeria</option>
            </select>
            {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="First name"
              {...register("firstName")}
              className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Last name"
              {...register("lastName")}
              className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              {...register("apartment")}
              className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="City"
              {...register("city")}
              className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
            />
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="State"
                {...register("state")}
                className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
              />
              {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="ZIP code"
                {...register("postalCode")}
                className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
              />
              {errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode.message}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <input
              type="tel"
              placeholder="Phone"
              {...register("phone")}
              className="block w-full rounded-sm border-0 py-3 px-4 text-obsidian ring-1 ring-inset ring-taupe/30 placeholder:text-taupe focus:ring-2 focus:ring-champagne sm:text-sm bg-transparent"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className="w-full flex items-center justify-center py-4 bg-obsidian text-white text-sm font-medium tracking-widest uppercase hover:bg-champagne transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Lock className="h-4 w-4 mr-2" />
        {isSubmitting ? "Processing..." : "Continue to Payment"}
      </button>
      
      <p className="text-center text-xs text-taupe flex items-center justify-center gap-1">
        <Lock className="h-3 w-3" /> Secure Checkout
      </p>

    </form>
  );
}
