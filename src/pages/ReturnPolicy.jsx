import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  RefreshCcw, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  Sparkles, 
  Search, 
  CreditCard, 
  Truck, 
  Tag, 
  PackageX, 
  Lock, 
  Scale, 
  Mail, 
  Phone, 
  MapPin, 
  Globe 
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const ReturnPolicy = () => {
  const fader = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    { name: 'Return Policy', href: '/return-policy', active: true }
  ];

  return (
    <div className="min-h-screen bg-[#FDFAF5] text-[#2A2623] font-sans overflow-hidden">
      
      {/* Premium Breadcrumb */}
      <Breadcrumb 
        title="Return & Refund Policy"
        subtitle="At VelourAZ, we want you to love your jewellery. Detailed guidelines for returns, exchanges, and refunds."
        bgImage="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1600"
        links={breadcrumbLinks}
      />

      <div className="max-w-4xl mx-auto py-16 px-6 relative z-10">
        <motion.div {...fader} className="space-y-16">
          
          {/* Intro Notice Banner */}
          <div className="p-8 bg-white/70 rounded-3xl border border-[#D8CBBE]/40 shadow-sm space-y-3">
            <p className="text-[#7B6D63] text-base sm:text-lg leading-relaxed font-light">
              At VelourAZ, we want you to love your jewellery. If you receive a product that is damaged, defective or incorrect, please contact us and we will be happy to assist you in accordance with this policy and applicable law.
            </p>
          </div>

          <div className="space-y-16 text-[#7B6D63] leading-relaxed tracking-wide text-base sm:text-lg font-light">
            
            {/* 1. Eligibility for Returns */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <CheckCircle size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">1. Eligibility for Returns</h2>
              </div>
              <p>You may request a return or exchange within 5 days if:</p>
              <ul className="grid sm:grid-cols-2 gap-3 pt-1">
                {[
                  "You received a damaged product.",
                  "You received a defective product.",
                  "You received a product different from the one ordered.",
                  "The product received has a manufacturing defect."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start bg-white/50 p-3.5 rounded-xl border border-[#D8CBBE]/20 hover:border-[#2e0e43]/30 transition-all">
                    <span className="text-[#2e0e43] font-bold mt-0.5">•</span>
                    <span className="text-[#2A2623] font-medium text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-medium text-[#2A2623] pt-2">For eligible returns, the product must generally be:</p>
              <ul className="space-y-3 pt-1">
                {[
                  "Unworn and unused.",
                  "In its original condition.",
                  "Returned with the original packaging, tags and accessories, where applicable.",
                  "A video showing the defect of the product.",
                  "Accompanied by the original order details."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start bg-white/50 p-3.5 rounded-xl border border-[#D8CBBE]/20 hover:border-[#2e0e43]/30 transition-all">
                    <span className="text-[#2e0e43] font-bold mt-0.5">•</span>
                    <span className="text-[#2A2623] font-medium text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-2 italic font-serif text-[#2e0e43]">
                Certain products may have specific return conditions mentioned on their individual product pages.
              </p>
            </section>

            {/* 2. Return Request Period */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Clock size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">2. Return Request Period</h2>
              </div>
              <div className="space-y-4">
                <p>Please contact VelourAZ within [48 hours / 3 days] of delivery if you receive a damaged, defective or incorrect product.</p>
                <p className="font-medium text-[#2A2623]">To raise a return request, contact:</p>
                <div className="bg-white/60 p-4 rounded-xl border border-[#D8CBBE]/30 space-y-1 text-sm sm:text-base">
                  <p><strong className="text-[#2A2623]">Email:</strong> [customer service email]</p>
                  <p><strong className="text-[#2A2623]">WhatsApp/Phone:</strong> [business number]</p>
                </div>
                <p className="font-medium text-[#2A2623]">Please provide your:</p>
                <ul className="grid sm:grid-cols-2 gap-3 pt-1">
                  {[
                    "Order number",
                    "Name and contact details",
                    "Reason for return",
                    "Clear photographs and video of the product",
                    "Photographs of the packaging",
                    "Unboxing video, where available"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start bg-white/50 p-3.5 rounded-xl border border-[#D8CBBE]/20 hover:border-[#2e0e43]/30 transition-all">
                      <span className="text-[#2e0e43] font-bold mt-0.5">•</span>
                      <span className="text-[#2A2623] font-medium text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2">We may request additional information or photographs to assess the issue.</p>
              </div>
            </section>

            {/* 3. Damaged Products */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">3. Damaged Products</h2>
              </div>
              <div className="space-y-4">
                <p>If your package appears damaged at the time of delivery, please photograph the package before opening it.</p>
                <p>If the jewellery is damaged inside the package, please contact us as soon as possible and provide photographs/videos showing the condition of the package and product.</p>
                <p>Once the claim is reviewed and approved, VelourAZ may offer a replacement, exchange or refund, depending on product availability and the circumstances of the case.</p>
              </div>
            </section>

            {/* 4. Incorrect Product */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <RefreshCcw size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">4. Incorrect Product</h2>
              </div>
              <div className="space-y-4">
                <p>If you receive a product that is different from what you ordered, please contact us within the return-request period.</p>
                <p className="font-medium text-[#2A2623]">After verification, VelourAZ will arrange an appropriate resolution, which may include:</p>
                <ul className="space-y-3 pt-1">
                  {[
                    "Replacement with the correct product;",
                    "Exchange; or",
                    "Refund, where applicable."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start bg-white/50 p-3.5 rounded-xl border border-[#D8CBBE]/20 hover:border-[#2e0e43]/30 transition-all">
                      <span className="text-[#2e0e43] font-bold mt-0.5">•</span>
                      <span className="text-[#2A2623] font-medium text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 6. Non-Returnable Situations */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Ban size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">6. Non-Returnable Situations</h2>
              </div>
              <p className="font-medium text-[#2A2623]">Returns may not be accepted where the product has:</p>
              <ul className="space-y-3 pt-1">
                {[
                  "Been worn or used.",
                  "Been damaged after delivery.",
                  "Been altered or repaired by a third party.",
                  "Been exposed to chemicals, perfume, water, cosmetics or other substances resulting in damage.",
                  "Been scratched or otherwise damaged through misuse.",
                  "Been returned without the original packaging where such packaging is required for the return.",
                  "Been customised or personalised specifically for the customer, subject to applicable law."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start bg-white/50 p-3.5 rounded-xl border border-[#D8CBBE]/20 hover:border-[#2e0e43]/30 transition-all">
                    <span className="text-[#2e0e43] font-bold mt-0.5">•</span>
                    <span className="text-[#2A2623] font-medium text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-2 italic font-serif text-[#2e0e43]">
                Natural variations in gemstones, pearls, beads, colour, texture or shape are not necessarily considered defects.
              </p>
            </section>

            {/* 7. Jewellery Care and Normal Wear */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Sparkles size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">7. Jewellery Care and Normal Wear</h2>
              </div>
              <div className="space-y-4">
                <p>Sterling silver may naturally tarnish or oxidise over time.</p>
                <p>Gold-plated or PVD-finished jewellery may experience gradual wear depending on usage, friction, chemicals, moisture and individual care.</p>
                <p>Such normal changes caused by use are generally not considered manufacturing defects.</p>
                <p>Customers should follow the jewellery-care instructions provided by VelourAZ.</p>
              </div>
            </section>

            {/* 8. Return Inspection */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Search size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">8. Return Inspection</h2>
              </div>
              <div className="space-y-4">
                <p>All returned products may be inspected before a refund, replacement or exchange is approved.</p>
                <p>VelourAZ reserves the right to reject a return where the product does not meet the applicable return conditions, subject to applicable law.</p>
              </div>
            </section>

            {/* 9. Refunds */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <CreditCard size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">9. Refunds</h2>
              </div>
              <div className="space-y-4">
                <p>Once a return is approved, the refund will be processed through the original payment method wherever reasonably possible.</p>
                <p>The processing time may depend on the payment gateway, bank or financial institution.</p>
                <p>VelourAZ will communicate the applicable refund status to the customer.</p>
              </div>
            </section>

            {/* 10. Shipping Charges */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Truck size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">10. Shipping Charges</h2>
              </div>
              <div className="space-y-4">
                <p className="font-medium text-[#2A2623]">Where a return is accepted because the product was:</p>
                <ul className="space-y-3 pt-1">
                  {[
                    "Damaged during delivery;",
                    "Defective; or",
                    "Incorrectly supplied by VelourAZ,"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start bg-white/50 p-3.5 rounded-xl border border-[#D8CBBE]/20 hover:border-[#2e0e43]/30 transition-all">
                      <span className="text-[#2e0e43] font-bold mt-0.5">•</span>
                      <span className="text-[#2A2623] font-medium text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <p>VelourAZ will determine the appropriate return-shipping arrangement in accordance with applicable law and the circumstances of the case.</p>
                <p>For other permitted returns, shipping charges may be non-refundable where legally permissible.</p>
              </div>
            </section>

            {/* 12. Sale and Promotional Products */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Tag size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">12. Sale and Promotional Products</h2>
              </div>
              <div className="space-y-4">
                <p>Products purchased during sales, promotional campaigns or special offers cannot be returned.</p>
              </div>
            </section>

            {/* 13. Lost or Damaged Returns */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <PackageX size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">13. Lost or Damaged Returns</h2>
              </div>
              <div className="space-y-4">
                <p>Customers are responsible for ensuring that approved return shipments are securely packaged.</p>
                <p>Where VelourAZ provides a return pickup, the customer should hand over the correct product in its original condition and packaging.</p>
                <p>If a customer independently ships an approved return, they should retain the shipping receipt and tracking information.</p>
              </div>
            </section>

            {/* 14. Fraudulent or Abusive Return Requests */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Lock size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">14. Fraudulent or Abusive Return Requests</h2>
              </div>
              <div className="space-y-4">
                <p>VelourAZ reserves the right to investigate suspected fraudulent or abusive return activity.</p>
                <p>This may include repeated claims involving damaged products, returning products other than those purchased, tampering with products, or other misuse of the return process.</p>
                <p>Any action taken will be subject to applicable law.</p>
              </div>
            </section>

            {/* 15. Consumer Rights */}
            <section className="space-y-6 group">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Scale size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">15. Consumer Rights</h2>
              </div>
              <div className="space-y-4">
                <p>Nothing in this Refund & Return Policy is intended to exclude or restrict any rights or remedies available to consumers under applicable Indian law.</p>
                <p>Where applicable law provides a consumer with a mandatory right to return, refund, replacement or other remedy, those rights will continue to apply.</p>
              </div>
            </section>

            {/* 16. Contact Us */}
            <section className="space-y-8 group pt-4">
              <div className="flex items-center gap-4 text-[#2e0e43]">
                <div className="w-12 h-12 rounded-2xl bg-[#2e0e43]/5 flex items-center justify-center shadow-sm group-hover:bg-[#2e0e43] group-hover:text-white transition-all duration-500 shrink-0">
                  <Mail size={22} />
                </div>
                <h2 className="text-[#2A2623] text-xl sm:text-2xl font-serif font-bold tracking-tight">16. Contact Us</h2>
              </div>
              <p>
                For return, exchange or refund assistance, please contact:
              </p>

              <div className="bg-white rounded-3xl p-8 border border-[#D8CBBE]/30 shadow-sm space-y-4 max-w-xl">
                <h3 className="text-[#2A2623] font-serif font-bold text-xl border-b border-[#D8CBBE]/20 pb-3">VelourAZ</h3>
                <div className="space-y-3 text-sm sm:text-base">
                  <p className="flex items-center gap-3"><Mail size={16} className="text-[#2e0e43] shrink-0" /><strong className="text-[#2A2623]">Email:</strong> [your official customer-service email]</p>
                  <p className="flex items-center gap-3"><Phone size={16} className="text-[#2e0e43] shrink-0" /><strong className="text-[#2A2623]">Phone/WhatsApp:</strong> [business number]</p>
                  <p className="flex items-start gap-3"><MapPin size={16} className="text-[#2e0e43] shrink-0 mt-1" /><strong className="text-[#2A2623] shrink-0">Business Address:</strong> [registered/business address]</p>
                  <p className="flex items-center gap-3"><Globe size={16} className="text-[#2e0e43] shrink-0" /><strong className="text-[#2A2623]">Website:</strong> velouraz.in</p>
                </div>
              </div>
            </section>

          </div>

          <div className="mt-24 pt-12 border-t border-[#D8CBBE]/30 text-center">
            <p className="text-sm sm:text-base tracking-[0.4em] uppercase text-[#7B6D63]/40 font-bold">© 2026 VELOURAZ. Artisans of Luxury.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
