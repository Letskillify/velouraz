import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Sparkles, Heart } from 'lucide-react';

const SANS = "'Montserrat', sans-serif";
const BG_IMAGE = "https://res.cloudinary.com/dcjn4y284/image/upload/v1787501695/ChatGPT_Image_Aug_23_2026_09_05_18_PM_yskzcm.png";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 800);
  };

  return (
    <section className="relative min-h-[700px] sm:min-h-[780px] lg:min-h-[880px] py-28 sm:py-36 lg:py-48 flex items-center justify-center overflow-hidden bg-[#14061F] text-white">
      {/* Background Image - Shifted to Top to prevent top edge cropping */}
      <div className="absolute inset-0 z-0">
        <img
          src={BG_IMAGE}
          alt="Velouraz Happy Customers & Events"
          className="w-full h-full object-cover object-top filter opacity-100 brightness-100 contrast-[1.02] transition-transform duration-[10000ms] hover:scale-105"
        />
        {/* Minimal Soft Vignette Gradient to keep background 100% clear & colorful */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14061F]/45 via-[#14061F]/20 to-[#14061F]/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#14061F]/30 via-transparent to-[#14061F]/40" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16" style={{ fontFamily: SANS }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Glassmorphic Headline Box for legibility over bright background */}
         

          {/* Right Column: Glassmorphic Newsletter Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="p-8 sm:p-10 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden">

              {/* Decorative subtle gold glow inside card */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C8A97A]/20 rounded-full filter blur-3xl pointer-events-none" />

              <div className="space-y-2 text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#C8A97A] to-[#E5C794] text-[#14061F] flex items-center justify-center shadow-lg">
                  <Mail size={22} strokeWidth={2} />
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-[#FAF7F2]">
                  Join the Circle
                </h3>
                <p className="text-xs sm:text-sm text-[#C5B39A] font-light">
                  Get updates straight to your inbox. No spam, ever.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isSubscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 rounded-xl bg-[#C8A97A]/15 border border-[#C8A97A]/40 text-center space-y-2"
                  >
                    <CheckCircle2 size={36} className="mx-auto text-[#E5C794]" />
                    <h4 className="text-lg font-medium text-[#FAF7F2]">Welcome to Velouraz Privé!</h4>
                    <p className="text-xs text-[#D8CBBE]">
                      Thank you for joining. Check your inbox soon for your exclusive welcome invitation.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-5 py-4 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-[#C5B39A]/70 text-sm focus:outline-none focus:border-[#E5C794] focus:ring-1 focus:ring-[#E5C794] transition-all shadow-inner"
                      />
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A97A]" />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C8A97A] via-[#D4A359] to-[#E5C794] text-[#14061F] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase hover:brightness-110 active:scale-[0.99] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-[#14061F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          SUBSCRIBE TO PRIVÉ
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-[#A6998A] text-center font-light">
                      By subscribing, you agree to our Terms & Privacy Policy.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;
