import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface HairOffering {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image: string;
  href: string;
  actionText: string;
}

const HAIR_OFFERINGS: HairOffering[] = [
  {
    id: "human-hair",
    number: "01",
    title: "Human Hair",
    subtitle: "100% Raw Virgin Donors",
    description:
      "Unprocessed, single-donor raw Vietnamese & Burmese hair bundles, frontals, and closures. Naturally thick from root to tip with full intact cuticles.",
    tag: "Raw & Virgin",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200&auto=format&fit=crop",
    href: "/shop?category=BUNDLE",
    actionText: "Shop Human Hair",
  },
  {
    id: "braided-wigs",
    number: "02",
    title: "Braided Wigs",
    subtitle: "Artisan Hand-Crafted Lace",
    description:
      "Featherlight, natural-parting braided wigs including knotless, micro-twists, and cornrows built on ultra-thin Swiss HD lace that dissolves seamlessly.",
    tag: "Glueless & HD Melt",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1200&auto=format&fit=crop",
    href: "/shop?category=WIG",
    actionText: "Explore Braided Wigs",
  },
  {
    id: "hair-extensions",
    number: "03",
    title: "Hair Extensions",
    subtitle: "Volume, Length & Seamless Density",
    description:
      "Double-drawn machine wefts, seamless clip-ins, tape-ins, and I-tips crafted to blend effortlessly with your natural hair texture.",
    tag: "Instant Glam",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop",
    href: "/shop?category=BUNDLE",
    actionText: "Browse Extensions",
  },
  {
    id: "hair-accessories",
    number: "04",
    title: "Hair Accessories",
    subtitle: "Luxury Care & Styling Essentials",
    description:
      "Pure mulberry silk bonnets, velvet edge melting bands, gold parting combs, luxury claw clips, and heatless curling ribbons.",
    tag: "Essential Care",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1200&auto=format&fit=crop",
    href: "/shop?category=ACCESSORY",
    actionText: "Shop Accessories",
  },
  {
    id: "hair-products",
    number: "05",
    title: "Hair Products",
    subtitle: "Nourishing Formulas & Lace Glazes",
    description:
      "Salon-formulated edge control glazes, botanical scalp serums, humidity-resistant lace melt sprays, and raw batana & argan hydrating oils.",
    tag: "Healthy Haircare",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1200&auto=format&fit=crop",
    href: "/shop",
    actionText: "Discover Products",
  },
  {
    id: "braiding-services",
    number: "06",
    title: "Braiding Services",
    subtitle: "Bespoke Styling & Precision Artistry",
    description:
      "Master salon appointments for knotless braids, goddess braids, stitch cornrows, custom wig installations, and protective hair styling.",
    tag: "Salon & Bespoke",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1200&auto=format&fit=crop",
    href: "/shop",
    actionText: "Book / Inquire Now",
  },
];

export function HairOfferingsSection() {
  return (
    <section className="w-full py-20 sm:py-28 px-6 bg-[#FAFAF8] border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/25 text-[#9E7B34] text-[11px] font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Our Signature Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-black uppercase tracking-tight mb-4">
            Types of Hair We Offer
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
            From 100% single-donor virgin human hair and artisan braided wigs to premium extensions, accessories, nourishing products, and master braiding artistry.
          </p>
        </div>

        {/* 6-Grid Offering Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {HAIR_OFFERINGS.map((offering) => (
            <div
              key={offering.id}
              className="group relative flex flex-col bg-white border border-black/5 hover:border-[#C5A059]/40 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <Image
                  src={offering.image}
                  alt={offering.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Floating Top Badge & Number */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="font-serif text-xs font-bold text-white tracking-widest px-2.5 py-1 bg-black/60 backdrop-blur rounded-sm border border-white/20">
                    {offering.number}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white px-2.5 py-1 bg-[#C5A059] shadow-sm rounded-sm">
                    {offering.tag}
                  </span>
                </div>

                {/* Title Overlay in Image Bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-serif uppercase tracking-wide drop-shadow-sm">
                    {offering.title}
                  </h3>
                  <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#E5D5A5]">
                    {offering.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6">
                  {offering.description}
                </p>

                {/* Action Link */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={offering.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-black group-hover:text-[#9E7B34] transition-colors"
                  >
                    <span>{offering.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    JulesBraids
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
