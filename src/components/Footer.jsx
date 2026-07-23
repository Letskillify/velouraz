import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Gem, Heart, Lock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "SHOP & COLLECTIONS",
      links: [
        { name: "All Collections", href: "/shop" },
        { name: "The World Edit", href: "/world-edit" },
        { name: "The Journal & News", href: "/blog" },
        { name: "Featured Bestsellers", href: "/shop?sort=bestsellers" }
      ]
    },
    {
      title: "CUSTOMER CARE",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Track Orders", href: "/orders" },
        { name: "Shopping Bag", href: "/cart" },
        { name: "My Wishlist", href: "/wishlist" }
      ]
    },
    {
      title: "OUR HOUSE",
      links: [
        { name: "Our Heritage Story", href: "/about" },
        { name: "Blog", href: "/journal" },
        { name: "My Account", href: "/account" },
      ]
    },
    {
      title: "LEGAL POLICIES",
      links: [
        { name: "Terms & Conditions", href: "/terms-and-conditions" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Return & Refund Policy", href: "/return-policy" }
      ]
    }
  ];

  return (
    <footer className="w-full bg-[#FAF7F2] text-[#2A2623] font-sans border-t border-[#EFE8DC]">
      
      {/* Top Value Proposition Highlights - Soft Gold & Warm Cream */}
      <div className="border-b border-[#EFE8DC] py-10 bg-[#FFFDF9]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D7] flex items-center justify-center text-[#7A0E2E] shadow-sm group-hover:border-[#B58E58] group-hover:scale-105 transition-all">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#2A2623]">Insured Free Shipping</h4>
              <p className="text-sm text-[#7B6D63] font-light mt-0.5">Complimentary delivery across India</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D7] flex items-center justify-center text-[#7A0E2E] shadow-sm group-hover:border-[#B58E58] group-hover:scale-105 transition-all">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#2A2623]">Certified Authenticity</h4>
              <p className="text-sm text-[#7B6D63] font-light mt-0.5">Hallmarked conflict-free materials</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D7] flex items-center justify-center text-[#7A0E2E] shadow-sm group-hover:border-[#B58E58] group-hover:scale-105 transition-all">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#2A2623]">Hassle-Free Returns</h4>
              <p className="text-sm text-[#7B6D63] font-light mt-0.5">7-day doorstep replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D7] flex items-center justify-center text-[#7A0E2E] shadow-sm group-hover:border-[#B58E58] group-hover:scale-105 transition-all">
              <Gem size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#2A2623]">Artisanal Ateliers</h4>
              <p className="text-sm text-[#7B6D63] font-light mt-0.5">Crafted by master goldsmiths</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section - Burgundy Light Luxe */}
      <div className="bg-[#7A0E2E] py-12 text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5 text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0 hidden sm:flex">
              <Mail size={26} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-light tracking-wide mb-1">
                Be the first to know
              </h3>
              <p className="text-sm font-light text-white/80">
                Receive private invitations to new world collections, limited releases & VIP previews.
              </p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Velouraz Privé!"); }} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              required
              placeholder="Enter your email address" 
              className="bg-white/10 border border-white/30 px-6 py-3.5 text-white text-sm w-full lg:w-[360px] placeholder:text-white/60 focus:outline-none focus:border-white rounded-xl transition-all"
            />
            <button type="submit" className="bg-[#FAF7F2] text-[#7A0E2E] px-8 py-3.5 text-sm tracking-[0.2em] font-bold uppercase hover:bg-white transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md">
              SUBSCRIBE <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="pt-16 pb-12 px-6 lg:px-12 bg-[#FAF7F2]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/" className="inline-block">
                <img src="/img/logo.png" alt="Velouraz Jewellery" className="h-12 lg:h-14 object-contain brightness-0" />
              </Link>
              <p className="text-[#7B6D63] font-serif text-base leading-relaxed max-w-sm font-light">
                Curated high jewellery inspired by global heritage, crafted for the modern aesthetic with uncompromised artistry.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="w-11 h-11 rounded-2xl bg-[#FFFDF9] border border-[#EBE3D7] flex items-center justify-center text-[#2A2623] hover:text-white hover:bg-[#7A0E2E] hover:border-[#7A0E2E] transition-all shadow-sm"><Instagram size={18} /></a>
                <a href="#" className="w-11 h-11 rounded-2xl bg-[#FFFDF9] border border-[#EBE3D7] flex items-center justify-center text-[#2A2623] hover:text-white hover:bg-[#7A0E2E] hover:border-[#7A0E2E] transition-all shadow-sm"><Facebook size={18} /></a>
                <a href="#" className="w-11 h-11 rounded-2xl bg-[#FFFDF9] border border-[#EBE3D7] flex items-center justify-center text-[#2A2623] hover:text-white hover:bg-[#7A0E2E] hover:border-[#7A0E2E] transition-all shadow-sm"><Youtube size={20} /></a>
              </div>
            </div>

            {/* Links Columns - 4 Grid Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {sections.map((section) => (
                <div key={section.title} className="space-y-5">
                  <h4 className="text-sm tracking-[0.2em] font-bold text-[#7A0E2E] uppercase font-sans">
                    {section.title}
                  </h4>
                  <ul className="space-y-3.5">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          to={link.href} 
                          className="text-sm text-[#2A2623]/85 hover:text-[#7A0E2E] transition-colors font-medium"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Bar & Copyright */}
          <div className="pt-8 border-t border-[#EBE3D7] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-sm text-[#7B6D63] font-medium font-sans">
                © {currentYear} Velouraz Jewellery. All Rights Reserved.
              </p>
              <p className="text-sm text-[#7B6D63] font-medium font-sans">
                Design by <a href="https://letskillify.com" target="_blank" rel="noopener noreferrer" className="font-bold text-[#7A0E2E] hover:underline">Letskillify</a>
              </p>
            </div>

            {/* Payment & Security Badges */}
            <div className="flex items-center gap-3 text-xs text-[#7B6D63]">
              <span className="bg-[#FFFDF9] border border-[#EBE3D7] px-3.5 py-1.5 rounded-xl text-sm font-medium text-[#2A2623]">🔒 256-Bit SSL Encryption</span>
              <span className="bg-[#FFFDF9] border border-[#EBE3D7] px-3.5 py-1.5 rounded-xl text-sm font-medium text-[#2A2623]">💳 Razorpay Secured</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
