import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/src/lib/products-store";
import { ProductCard } from "@/src/components/product/ProductCard";
import { HeroVideoClient } from "@/src/components/hero/HeroVideoClient";

export default async function Homepage() {
  const products = await getAllProducts({ status: "PUBLISHED" });
  const featured = products.filter((p) => p.isFeatured || p.isNewArrival || p.isBestSeller).slice(0, 3);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 3);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center overflow-hidden bg-black">
        {/* Full Hero Autoplay Background Video (Mobile & Desktop) */}
        <div className="absolute inset-0">
          <HeroVideoClient />
        </div>

        {/* Content Container - Centered on Mobile, Left-aligned on Desktop */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-20">
          <div className="max-w-2xl text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white uppercase tracking-wider mb-3 leading-tight">
              PREMIUM HAIR. TIMELESS BEAUTY.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif text-gray-200 tracking-[0.1em] mb-6 font-light">
              Hair That Makes an Entrance.
            </p>
            <p className="text-sm md:text-base text-gray-200 tracking-wide font-light max-w-xl mb-10 leading-relaxed">
              Discover luxurious human hair crafted for women who appreciate exceptional quality, effortless beauty, and a look that commands attention.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-white text-black px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors duration-300 shadow-md"
              >
                Shop Luxury Hair
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center border border-white/60 bg-black/40 backdrop-blur text-white px-8 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-300"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Strip (Live from Admin catalog) */}
      <section className="w-full py-24 px-6 bg-warm-white flex flex-col items-center">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-champagne mb-2 block">
            Curated Highlights
          </span>
          <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-tight text-obsidian mb-4">
            Featured Hair Pieces
          </h2>
          <p className="text-sm text-taupe leading-relaxed">
            Hand-selected virgin raw hair wigs and bundles currently available in our boutique inventory.
          </p>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.basePrice,
                compareAtPrice: product.compareAtPrice,
                images: product.images,
                isNewArrival: product.isNewArrival,
                isBestSeller: product.isBestSeller,
                hairTexture: product.hairTexture,
                productType: product.productType,
              }}
            />
          ))}
        </div>

        <div className="mt-14">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-obsidian text-white px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-charcoal transition"
          >
            Explore All Hair Products
          </Link>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="w-full py-24 px-6 bg-white flex flex-col items-center text-center">
        <h2 className="text-xs font-medium text-gray-500 tracking-[0.3em] uppercase mb-4">
          Why Choose Us
        </h2>
        <h3 className="text-3xl md:text-5xl font-serif uppercase tracking-wide mb-8 text-black">
          The Julesbraids Standard
        </h3>
        <p className="text-sm text-gray-600 leading-loose max-w-2xl mx-auto mb-12">
          We pride ourselves on offering only the finest virgin human hair. Our meticulous sourcing process ensures that every bundle, closure, and wig meets the highest standards of quality. No chemical processing, no synthetic blends—just pure, natural beauty that lasts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gray-50">
              <span className="text-2xl">🌱</span>
            </div>
            <h4 className="text-lg font-serif uppercase tracking-wider mb-3">Ethically Sourced</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              We maintain direct relationships with temples and single donors across South East Asia, ensuring fair trade and premium raw quality.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gray-50">
              <span className="text-2xl">✨</span>
            </div>
            <h4 className="text-lg font-serif uppercase tracking-wider mb-3">Unprocessed Cuticle Hair</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cuticles are intact and unidirectional, preventing tangling and matting. Can be bleached to #613 blonde and heat styled with ease.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gray-50">
              <span className="text-2xl">⏳</span>
            </div>
            <h4 className="text-lg font-serif uppercase tracking-wider mb-3">2+ Years Longevity</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              With proper conditioning and maintenance, our hair extensions and lace wigs maintain their vitality and luster for multiple years.
            </p>
          </div>
        </div>
      </section>

      {/* Alternating Showcase 1: Text on Left, Picture on Right */}
      <section className="w-full flex flex-col lg:flex-row bg-white border-t border-gray-100">
        {/* Short Text Description (Left on desktop) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center p-10 sm:p-14 lg:p-24 text-center lg:text-left order-2 lg:order-1 bg-white">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-champagne mb-3">
            Pure Raw Collection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-wide mb-6 text-black leading-tight">
            Raw Vietnamese Hair
          </h2>
          <p className="text-sm text-gray-600 leading-loose max-w-md mb-8 font-light">
            Our premier raw collection features natural single-donor Vietnamese hair. Thick from weft to ends with supreme silkiness, natural luster, and intact unidirectional cuticles that withstand bleaching and heat styling.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/shop?category=WIG"
              className="inline-flex items-center justify-center bg-black text-white px-9 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-champagne hover:text-black transition-colors duration-300"
            >
              Shop Wigs
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center border border-black/20 text-black px-8 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:border-black transition-colors duration-300"
            >
              View Lookbook
            </Link>
          </div>
        </div>

        {/* Picture (Right on desktop) */}
        <div className="w-full lg:w-1/2 relative aspect-[4/5] lg:aspect-auto lg:h-[85vh] bg-gray-100 overflow-hidden group order-1 lg:order-2">
          <Image
            src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=2000&auto=format&fit=crop"
            alt="Raw Vietnamese Hair Collection"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Alternating Showcase 2: Picture on Left, Text on Right */}
      <section className="w-full flex flex-col lg:flex-row bg-gray-50 border-t border-gray-100">
        {/* Picture (Left on desktop) */}
        <div className="w-full lg:w-1/2 relative aspect-[4/5] lg:aspect-auto lg:h-[85vh] bg-gray-100 overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=2574&auto=format&fit=crop"
            alt="Mastercrafted Braids and Swiss HD Lace"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Short Text Description (Right on desktop) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center p-10 sm:p-14 lg:p-24 text-center lg:text-left bg-gray-50">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-champagne mb-3">
            Artisan Craftsmanship
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-wide mb-6 text-black leading-tight">
            HD Melt Lace &amp; Braids
          </h2>
          <p className="text-sm text-gray-600 leading-loose max-w-md mb-8 font-light">
            Engineered with ultra-fine Swiss HD lace and artisan hand-tied hairline knots that dissolve imperceptibly into every skin tone. Effortless parting, zero demarcation line, and unmatched natural realism.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/shop?category=BUNDLE"
              className="inline-flex items-center justify-center bg-black text-white px-9 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-champagne hover:text-black transition-colors duration-300"
            >
              Shop Bundles
            </Link>
            <Link
              href="/shop?category=CLOSURE"
              className="inline-flex items-center justify-center border border-black/20 text-black px-8 py-4 text-[11px] font-medium tracking-[0.2em] uppercase hover:border-black transition-colors duration-300"
            >
              Shop Closures
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 bg-white text-center">
        <h2 className="text-3xl font-serif uppercase tracking-wide mb-12 text-black">
          Loved by Thousands
        </h2>
        <div className="flex justify-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">Over 10,000+ Five Star Reviews</p>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-serif italic">
          &ldquo;The best hair I&apos;ve ever purchased. It blends seamlessly and lasts for over two years. Pure luxury.&rdquo;
        </p>
      </section>
    </div>
  );
}
