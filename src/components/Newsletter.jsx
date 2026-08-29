import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Sparkles, Heart } from 'lucide-react';

const SANS = "'Montserrat', sans-serif";
const BG_IMAGE = "https://res.cloudinary.com/dcjn4y284/image/upload/v1788008294/velouraz_end_tjyeye.png";

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
    <section className="relative w-full min-h-[420px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[600px] py-12 sm:py-16 lg:py-20 flex items-center justify-center overflow-hidden bg-[#14061F] text-white">
      {/* Background Image - Full width, no cropping left/right */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#14061F]">
        <img
          src={BG_IMAGE}
          alt="Velouraz Newsletter"
          className="w-full h-full object-contain object-center"
        />
      </div>

      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 sm:px-10 lg:px-16 flex justify-center sm:justify-start" style={{ fontFamily: SANS }}>
        {/* Ultra-Premium High-Visibility Glassmorphic Newsletter Card */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative"
        >
          {/* Ambient Outer Gold Glow Aura */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#E5C794]/40 via-[#F3E5AB]/30 to-[#C8A97A]/40 blur-2xl opacity-80 pointer-events-none" />

          <div className="relative p-7 sm:p-9 rounded-2xl bg-[#0D0414]/94 backdrop-blur-3xl border border-[#E5C794]/60 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(229,199,148,0.25)] space-y-6 overflow-hidden group">

            {/* Top Glowing Metallic Gold Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C8A97A] via-[#FFF3D6] to-[#C8A97A] shadow-[0_0_12px_#E5C794]" />

            {/* Card Header */}
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5C794]/15 border border-[#E5C794]/50 shadow-sm">
                <Sparkles size={14} className="text-[#F3E5AB]" />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#F3E5AB]">
                  VELOURAZ PRIVÉ
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white">
                Join the <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#FFF8E7] to-[#E5C794]">Inner Circle</span>
              </h3>
              <p className="text-sm text-[#E2D6C5] font-normal leading-relaxed">
                Receive private invitations, preview new collections, and unlock VIP privileges.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-[#C8A97A]/30 to-[#0D0414]/95 border border-[#E5C794]/70 text-center space-y-3 shadow-xl"
                >
                  <div className="w-14 h-14 rounded-full bg-[#E5C794]/25 border border-[#E5C794] flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={30} className="text-[#F3E5AB]" />
                  </div>
                  <h4 className="text-lg font-semibold text-white tracking-wide">
                    Welcome to Velouraz Privé
                  </h4>
                  <p className="text-sm text-[#E2D6C5] font-normal leading-relaxed">
                    You are officially on the guest list. Check your inbox soon for your exclusive welcome invitation.
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
                      className="w-full px-4 py-3.5 pl-11 rounded-xl bg-[#040108]/90 border border-[#E5C794]/60 text-white placeholder:text-[#C8B8A6] text-sm focus:outline-none focus:border-[#F3E5AB] focus:ring-2 focus:ring-[#E5C794]/50 transition-all shadow-inner font-normal"
                    />
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F3E5AB]" />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4A96A] via-[#F8E7C4] to-[#C8A97A] text-[#0D0414] font-extrabold text-xs sm:text-sm tracking-[0.22em] uppercase hover:brightness-110 active:scale-[0.99] transition-all duration-300 shadow-[0_4px_25px_rgba(229,199,148,0.45)] hover:shadow-[0_6px_30px_rgba(243,229,171,0.65)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#0D0414] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        SUBSCRIBE TO PRIVÉ
                        <ArrowRight size={16} className="text-[#0D0414] stroke-[2.5]" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[#C8B8A6] text-center font-normal tracking-wide">
                    By subscribing, you agree to our Terms & Privacy Policy.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
