import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Sparkles, Heart } from 'lucide-react';

const SANS = "'Montserrat', sans-serif";
const BG_IMAGE = "https://res.cloudinary.com/dcjn4y284/image/upload/v1787679684/ujhefifwhe_c6eb7h.png";

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
    <section className="relative w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] py-20 sm:py-28 lg:py-36 flex items-center justify-center overflow-hidden bg-[#14061F] text-white">
      {/* Background Image - Full width, no zoom, no overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={BG_IMAGE}
          alt="Velouraz Newsletter"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 sm:px-10 lg:px-16" style={{ fontFamily: SANS }}>
        <div className="flex justify-start">

          {/* Glassmorphic Newsletter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="p-6 sm:p-8 rounded-2xl bg-[#14061F]/85 backdrop-blur-xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-5 relative overflow-hidden">

              <div className="space-y-1.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C8A97A] to-[#E5C794] text-[#14061F] flex items-center justify-center shadow-lg mb-2">
                  <Mail size={20} strokeWidth={2} />
                </div>
                <h3 className="text-lg sm:text-xl font-light text-[#FAF7F2]">
                  Join the Circle
                </h3>
                <p className="text-xs text-[#C5B39A] font-light">
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
                    className="p-5 rounded-xl bg-[#C8A97A]/15 border border-[#C8A97A]/40 text-center space-y-2"
                  >
                    <CheckCircle2 size={32} className="mx-auto text-[#E5C794]" />
                    <h4 className="text-base font-medium text-[#FAF7F2]">Welcome to Velouraz Privé!</h4>
                    <p className="text-xs text-[#D8CBBE]">
                      Thank you for joining. Check your inbox soon for your exclusive welcome invitation.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-3.5"
                  >
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 pl-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-[#C5B39A]/70 text-xs sm:text-sm focus:outline-none focus:border-[#E5C794] focus:ring-1 focus:ring-[#E5C794] transition-all shadow-inner"
                      />
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C8A97A]" />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8A97A] via-[#D4A359] to-[#E5C794] text-[#14061F] font-bold text-xs tracking-[0.18em] uppercase hover:brightness-110 active:scale-[0.99] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-[#14061F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          SUBSCRIBE TO PRIVÉ
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-[#A6998A] text-center font-light">
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
