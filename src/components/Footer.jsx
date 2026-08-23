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
        { name: "Featured Bestsellers", href: "/shop" }
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
        { name: "Our Story & Heritage", href: "/about" },
        { name: "Atelier Journal", href: "/blog" },
        { name: "My Account", href: "/account" },
        { name: "Contact Us", href: "/contact" }
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
      

      {/* Newsletter Section */}
      

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
                <a href="https://www.instagram.com/_velouraz_?igsh=cWt5bDBjZHZuZG9h&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-[#B58E58]/30 flex items-center justify-center text-[#E5C794] hover:text-[#14061F] hover:bg-[#B58E58] hover:border-[#B58E58] transition-all duration-300 shadow-sm"><Instagram size={17} /></a>
                <a href="https://www.facebook.com/share/1Bg4DRSKhd/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-[#B58E58]/30 flex items-center justify-center text-[#E5C794] hover:text-[#14061F] hover:bg-[#B58E58] hover:border-[#B58E58] transition-all duration-300 shadow-sm"><Facebook size={17} /></a>
                <a href="https://pin.it/1J19Fel5b" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="w-10 h-10 rounded-full bg-white/5 border border-[#B58E58]/30 flex items-center justify-center text-[#E5C794] hover:text-[#14061F] hover:bg-[#B58E58] hover:border-[#B58E58] transition-all duration-300 shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.606 0 12.017 0z"/></svg>
                </a>
                <a href="https://www.threads.com/@_velouraz_?invite=0" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="w-10 h-10 rounded-full bg-white/5 border border-[#B58E58]/30 flex items-center justify-center text-[#E5C794] hover:text-[#14061F] hover:bg-[#B58E58] hover:border-[#B58E58] transition-all duration-300 shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.026-6.377-1.222-8.31-3.554C2.008 18.2 1 15.176 1 11.45 1 4.887 5.864.07 12.277 0c3.554 0 6.643 1.404 8.696 3.953l-2.073 1.748c-1.636-2.033-4.088-3.155-6.914-3.155-5.26 0-9.25 3.92-9.25 9.404 0 3.208.825 5.703 2.385 7.217 1.482 1.439 3.655 2.18 6.46 2.204 4.092.035 7.152-1.282 8.358-3.606.666-1.284.88-2.879.636-4.743-.377-2.875-2.613-4.748-5.69-4.748-2.64 0-4.526 1.464-4.834 3.737-.024.183.05.352.193.456.14.103.328.125.487.054 1.344-.593 2.76-.328 3.633.303.654.472.981 1.2.923 2.05-.084 1.233-1.077 2.116-2.358 2.1-1.042-.013-1.898-.755-1.996-1.728l.006-.062c.162-1.666 1.49-2.906 3.253-3.045 1.547-.122 3.018.423 3.864 1.428.618.734.922 1.667.857 2.628-.152 2.23-1.83 3.99-4.073 4.275-2.793.355-5.234-.582-6.527-2.506C5.034 14.88 5 13.06 5 11.45c0-4.143 3.003-7.5 7.234-7.5 2.327 0 4.412.982 5.72 2.696l1.96-1.872C20.198 2.532 17.518 1.25 12.234 1.25 6.786 1.25 2.25 5.567 2.25 11.45c0 3.44.912 6.19 2.637 8.168 1.68 1.928 4.094 2.926 7.292 2.95h.007c3.923 0 7.261-1.686 9.076-4.595.632-1.013.974-2.191 1.018-3.5.093-2.774-.78-5.112-2.525-6.761-1.583-1.496-3.774-2.278-6.335-2.26-4.168.03-7.218 2.873-7.53 7.025-.262 3.493 2.117 6.47 5.58 6.993 2.05.31 4.143-.162 5.741-1.294l1.32 1.76c-2.072 1.47-4.78 2.083-7.442 1.681-4.526-.684-7.636-4.577-7.294-9.15.408-5.43 4.383-9.15 9.876-9.19 3.298-.023 6.128.986 8.19 2.93 2.247 2.12 3.371 5.12 3.25 8.68-.057 1.68-.498 3.193-1.31 4.494C20.521 21.84 16.545 24 12.186 24z"/></svg>
                </a>
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

