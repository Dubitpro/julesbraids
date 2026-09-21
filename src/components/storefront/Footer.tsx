import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24 text-center md:text-left">
        
        {/* Brand */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <Link href="/" className="flex items-center gap-3 mb-5 hover:opacity-85 transition-opacity">
            <img 
              src="/logo.jpg" 
              alt="JulesBraids & Hairs" 
              className="h-10 w-10 object-cover rounded-full ring-1 ring-champagne/40" 
            />
            <span className="font-serif text-lg uppercase tracking-wider text-white">
              JulesBraids &amp; Hairs
            </span>
          </Link>
          <p className="text-[11px] text-gray-400 leading-loose max-w-xs tracking-wider mb-2">
            Wigs, Hairs &amp; Accessories. Premium luxury hair collections tailored for absolute elegance.
          </p>
          <p className="text-[11px] text-champagne tracking-widest font-mono">
            Tel: 08094712566
          </p>
        </div>

        {/* Shop Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-8 text-champagne">Shop</h3>
          <ul className="space-y-4 text-[11px] tracking-wider">
            <li><Link href="/shop/wigs" className="hover:text-champagne transition-colors">Wigs</Link></li>
            <li><Link href="/shop/bundles" className="hover:text-champagne transition-colors">Bundles</Link></li>
            <li><Link href="/shop/closures" className="hover:text-champagne transition-colors">Closures</Link></li>
            <li><Link href="/shop" className="hover:text-champagne transition-colors">All Collections</Link></li>
          </ul>
        </div>

        {/* Client Care */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-8 text-champagne">Client Care</h3>
          <ul className="space-y-4 text-[11px] tracking-wider">
            <li><Link href="/contact" className="hover:text-champagne transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-champagne transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/faq" className="hover:text-champagne transition-colors">FAQ</Link></li>
            <li><Link href="/care-guide" className="hover:text-champagne transition-colors">Care Guide</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-8 text-champagne">Newsletter</h3>
          <p className="text-[11px] text-gray-400 mb-6 tracking-wider leading-loose">Subscribe to receive exclusive access.</p>
          <form className="flex border-b border-gray-700 pb-2 w-full max-w-xs focus-within:border-champagne transition-colors">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-transparent border-none w-full text-[11px] tracking-wider text-white placeholder:text-gray-600 focus:outline-none focus:ring-0"
            />
            <button type="submit" className="text-[10px] font-medium uppercase tracking-[0.2em] hover:text-champagne transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-500 tracking-[0.1em] uppercase">
        <p>&copy; {new Date().getFullYear()} JulesBraids &amp; Hairs. All rights reserved.</p>
        <div className="flex space-x-8 mt-6 md:mt-0">
          <Link href="/privacy" className="hover:text-champagne transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-champagne transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
