import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Gem, Lock } from 'lucide-react';

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
    <footer className="w-full bg-[#14061F] text-[#F3ECE1] font-sans border-t border-[#3A1B54]">
      
      {/* Top Value Proposition Highlights */}
      <div className="border-b border-[#2D1244] py-10 bg-[#1A0829]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 group">
            <div className="w-12 h-12 rounded-full bg-[#290F3E] border border-[#B58E58]/40 flex items-center justify-center text-[#E5C794] shadow-md group-hover:border-[#E5C794] group-hover:scale-105 transition-all duration-300 shrink-0">
              <Truck size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5EFE6]">Insured Free Shipping</h4>
              <p className="text-xs text-[#C5B39A] font-serif font-light mt-0.5">Complimentary delivery across India</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 group">
            <div className="w-12 h-12 rounded-full bg-[#290F3E] border border-[#B58E58]/40 flex items-center justify-center text-[#E5C794] shadow-md group-hover:border-[#E5C794] group-hover:scale-105 transition-all duration-300 shrink-0">
              <ShieldCheck size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5EFE6]">Certified Authenticity</h4>
              <p className="text-xs text-[#C5B39A] font-serif font-light mt-0.5">Hallmarked conflict-free materials</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 group">
            <div className="w-12 h-12 rounded-full bg-[#290F3E] border border-[#B58E58]/40 flex items-center justify-center text-[#E5C794] shadow-md group-hover:border-[#E5C794] group-hover:scale-105 transition-all duration-300 shrink-0">
              <RefreshCw size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5EFE6]">Hassle-Free Returns</h4>
              <p className="text-xs text-[#C5B39A] font-serif font-light mt-0.5">7-day doorstep replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 group">
            <div className="w-12 h-12 rounded-full bg-[#290F3E] border border-[#B58E58]/40 flex items-center justify-center text-[#E5C794] shadow-md group-hover:border-[#E5C794] group-hover:scale-105 transition-all duration-300 shrink-0">
              <Gem size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5EFE6]">Artisanal Ateliers</h4>
              <p className="text-xs text-[#C5B39A] font-serif font-light mt-0.5">Crafted by master goldsmiths</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[#240A35] via-[#14061F] to-[#240A35] py-14 border-b border-[#2D1244]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5 text-center lg:text-left">
            <div className="w-14 h-14 rounded-full bg-[#290F3E] border border-[#B58E58]/40 flex items-center justify-center text-[#E5C794] shrink-0 hidden sm:flex shadow-md">
              <Mail size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-light tracking-wide text-[#F5EFE6] mb-1">
                Join Velouraz <span className="italic font-normal text-[#E5C794]">Privé</span>
              </h3>
              <p className="text-xs sm:text-sm font-serif font-light text-[#C5B39A]/90">
                Receive private invitations to new world collections, limited releases & VIP previews.
              </p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Velouraz Privé!"); }} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              required
              placeholder="Enter your email address" 
              className="bg-white/5 border border-[#B58E58]/40 px-6 py-3.5 text-white text-xs sm:text-sm w-full lg:w-[360px] placeholder:text-[#C5B39A]/60 focus:outline-none focus:border-[#E5C794] rounded-full transition-all"
            />
            <button type="submit" className="bg-gradient-to-r from-[#B58E58] to-[#D4A359] text-[#14061F] px-8 py-3.5 text-xs tracking-[0.25em] font-bold uppercase hover:from-white hover:to-white hover:text-[#14061F] transition-all duration-300 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg">
              SUBSCRIBE <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="pt-16 pb-12 px-6 lg:px-12 bg-[#14061F]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/" className="inline-block">
                <img src="/img/logo.png" alt="Velouraz Jewellery" className="h-12 lg:h-14 object-contain brightness-0 invert" />
              </Link>
              <p className="text-[#C5B39A] font-serif text-sm sm:text-base leading-relaxed max-w-sm font-light">
                Curated high jewellery inspired by global heritage, crafted for the modern aesthetic with uncompromised artistry.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-[#B58E58]/30 flex items-center justify-center text-[#E5C794] hover:text-[#14061F] hover:bg-[#B58E58] hover:border-[#B58E58] transition-all duration-300 shadow-sm"><Instagram size={17} /></a>
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-[#B58E58]/30 flex items-center justify-center text-[#E5C794] hover:text-[#14061F] hover:bg-[#B58E58] hover:border-[#B58E58] transition-all duration-300 shadow-sm"><Facebook size={17} /></a>
                <a href="#" aria-label="Youtube" className="w-10 h-10 rounded-full bg-white/5 border border-[#B58E58]/30 flex items-center justify-center text-[#E5C794] hover:text-[#14061F] hover:bg-[#B58E58] hover:border-[#B58E58] transition-all duration-300 shadow-sm"><Youtube size={19} /></a>
              </div>
            </div>

            {/* Links Columns - 4 Grid Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {sections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h4 className="text-xs tracking-[0.25em] font-bold text-[#E5C794] uppercase font-sans mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          to={link.href} 
                          className="text-xs sm:text-sm text-[#C5B39A] hover:text-white transition-colors duration-300 font-serif tracking-wide"
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
          <div className="pt-8 border-t border-[#2D1244] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-xs text-[#C5B39A]/70 font-sans">
                © {currentYear} Velouraz Jewellery. All Rights Reserved.
              </p>
              <p className="text-xs text-[#C5B39A]/70 font-sans">
                Design by <a href="https://letskillify.com" target="_blank" rel="noopener noreferrer" className="font-bold text-[#E5C794] hover:underline">Letskillify</a>
              </p>
            </div>

            {/* Payment & Security Badges */}
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-[#1A0829] border border-[#B58E58]/30 px-3.5 py-1.5 rounded-full text-xs font-serif text-[#E5C794] flex items-center gap-1.5">
                <Lock size={12} className="text-[#E5C794]" /> 256-Bit SSL Encryption
              </span>
              <span className="bg-[#1A0829] border border-[#B58E58]/30 px-3.5 py-1.5 rounded-full text-xs font-serif text-[#E5C794]">
                💳 Razorpay Secured
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

