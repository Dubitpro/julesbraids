import { Header } from "@/src/components/storefront/Header";
import { Footer } from "@/src/components/storefront/Footer";
import { CartDrawer } from "@/src/components/cart/CartDrawer";
import { AuthProvider } from "@/src/lib/context/AuthContext";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
