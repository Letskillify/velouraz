import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "SHOP",
      links: [
        { name: "Collections", href: "/shop" },
        { name: "World Edit", href: "/world-edit" },
        { name: "The Edit", href: "/the-edit" },
        { name: "Exclusive Offers", href: "/offers" }
      ]
    },
    {
      title: "CUSTOMER CARE",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Shipping & Delivery", href: "/shipping-policy" },
        { name: "Returns & Exchanges", href: "/return-policy" },
        { name: "FAQs", href: "/faqs" }
      ]
    },
    {
      title: "ABOUT",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Craftsmanship", href: "/craftsmanship" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Care Guide", href: "/care-guide" }
      ]
    },
    {
      title: "POLICIES",
      links: [
        { name: "Terms & Conditions", href: "/terms-and-conditions" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Refund Policy", href: "/refund-policy" },
        { name: "Shipping Policy", href: "/shipping-policy" }
      ]
    }
  ];

  return (
    <footer className="w-full">
      {/* Newsletter Section */}
      <div className="bg-[#7A0E2E] py-12">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
               </svg>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1">
                  <div className="w-4 h-4 border border-white/40 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                  </div>
               </div>
            </div>
            <div className="text-white">
              <h3 className="text-xl lg:text-2xl font-serif mb-1">Be the first to know</h3>
              <p className="text-[16px] tracking-[0.05em] font-light text-white/70">
                Exclusive offers, new arrivals & style updates straight to your inbox.
              </p>
            </div>
          </div>
          <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-0">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-transparent border border-white/20 px-6 py-4 text-white text-sm w-full lg:w-[350px] placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button className="bg-white text-[#7A0E2E] px-10 py-4 text-[16px] tracking-[0.2em] font-bold uppercase hover:bg-white/90 transition-colors">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-[#F8F4EF] pt-20 pb-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-6">
                <Link to="/" className="inline-block">
                  <img src="/img/logo.png" alt="Velouraz" className="h-12 lg:h-16 object-contain brightness-0" />
                </Link>
                <p className="text-[#7B6D63] font-serif text-[18px] lg:text-[20px] leading-relaxed max-w-sm">
                  Curated jewellery inspired by cultures around the world, crafted for you.
                </p>
              </div>
              
              {/* Social Icons */}
              <div className="flex items-center gap-8 pt-4">
                <a href="#" className="text-[#2A2623] hover:text-[#7A0E2E] transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-[#2A2623] hover:text-[#7A0E2E] transition-colors"><Facebook size={24} /></a>
                <a href="#" className="text-[#2A2623] hover:text-[#7A0E2E] transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.377-.293 1.194-.332 1.357-.052.211-.173.256-.4.147-1.492-.695-2.425-2.876-2.425-4.627 0-3.769 2.737-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.373 0 0-.599 2.282-.744 2.84-.27.839-1.002 2.115-1.492 2.91 1.12.345 2.308.531 3.539.531 6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                  </svg>
                </a>
                <a href="#" className="text-[#2A2623] hover:text-[#7A0E2E] transition-colors"><Youtube size={26} /></a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
              {sections.map((section) => (
                <div key={section.title} className="space-y-8">
                  <h4 className="text-[16px] md:text-[16px] tracking-[0.2em] font-bold text-[#7A0E2E] uppercase">
                    {section.title}
                  </h4>
                  <ul className="space-y-5">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          to={link.href} 
                          className="text-[16px] lg:text-[18px] text-[#2A2623] hover:text-[#7A0E2E] transition-colors font-serif"
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

          {/* Bottom Copyright */}
          <div className="pt-10 border-t border-[#D8CBBE]/30 text-center">
            <p className="text-[16px] lg:text-[16px] font-serif text-[#7B6D63]">
              © {currentYear} Velouraz. All Rights Reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
