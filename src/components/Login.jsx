import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Gem } from "lucide-react";
import { motion } from "framer-motion";

const SERIF = "'Cormorant Garamond', Georgia, serif";
const GOLD = '#C8A97A';
const CRIMSON = '#7A0E2E';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const from = location.state?.from || "/";
      const buyNowItem = location.state?.buyNowItem;
      if (buyNowItem) {
        navigate(from, { state: { buyNowItem } });
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-[#7A0E2E] selection:text-white">
      
      {/* Left Panel — Brand Visual */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden items-end" style={{ background: '#0A0705' }}>
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200"
          alt="Luxury Jewelry"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,7,5,0.95) 0%, rgba(10,7,5,0.3) 50%, rgba(10,7,5,0.6) 100%)' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 p-14 pb-16 w-full"
        >
          <Link to="/" className="inline-block mb-12">
            <img src="/img/logo.png" alt="Velouraz" className="h-10" style={{ filter: 'invert(1)' }} />
          </Link>
          
          <h2 
            className="text-5xl xl:text-6xl font-light text-white mb-6 leading-[1.1]"
            style={{ fontFamily: SERIF }}
          >
            Welcome to the<br />
            <em className="not-italic font-semibold" style={{ color: GOLD }}>House of Velouraz</em>
          </h2>
          
          <p className="text-white/45 text-[16px] max-w-md leading-relaxed mb-10" style={{ fontFamily: SERIF }}>
            Where every piece of jewellery tells a story of timeless craftsmanship, inspired by cultures across the world.
          </p>

          <div className="flex items-center gap-8">
            {['Handcrafted', 'Certified', 'Worldwide'].map((tag, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full" style={{ background: GOLD }} />
                <span className="text-[16px] tracking-[0.25em] uppercase font-bold text-white/40">{tag}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#FDFAF5] px-6 sm:px-12 py-12 relative">
        {/* Subtle decorative element */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#7A0E2E]/[0.03] rounded-full blur-[100px] pointer-events-none" />
        
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden mb-10">
          <img src="/img/logo.png" alt="Velouraz" className="h-9" style={{ filter: 'brightness(0)' }} />
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
              <span className="text-[16px] tracking-[0.35em] font-bold uppercase" style={{ color: '#7B6D63' }}>Welcome Back</span>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-light text-[#2A2623] mb-3"
              style={{ fontFamily: SERIF }}
            >
              Sign <span className="italic" style={{ color: CRIMSON }}>In</span>
            </h1>
            <p className="text-[16px] text-[#7B6D63]" style={{ fontFamily: SERIF }}>
              Access your account and curated collections.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[16px]"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[16px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B6D63]/30 group-focus-within:text-[#7A0E2E] transition-colors" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#D8CBBE]/50 rounded-xl focus:border-[#7A0E2E] outline-none transition-all text-[16px] text-[#2A2623] placeholder:text-[#7B6D63]/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[16px] font-bold uppercase tracking-[0.2em] text-[#2A2623]">Password</label>
                <button type="button" className="text-[16px] font-bold text-[#7A0E2E]/60 hover:text-[#7A0E2E] transition-colors uppercase tracking-wider">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B6D63]/30 group-focus-within:text-[#7A0E2E] transition-colors" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-[#D8CBBE]/50 rounded-xl focus:border-[#7A0E2E] outline-none transition-all text-[16px] text-[#2A2623] placeholder:text-[#7B6D63]/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B6D63]/40 hover:text-[#7A0E2E] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 rounded-xl text-white font-bold text-[16px] tracking-[0.3em] uppercase transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-3 shadow-lg"
              style={{ background: '#2A2623' }}
              onMouseEnter={(e) => e.currentTarget.style.background = CRIMSON}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2A2623'}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#D8CBBE]/40" />
            <span className="text-[16px] tracking-[0.2em] uppercase font-bold text-[#7B6D63]/40">or</span>
            <div className="flex-1 h-px bg-[#D8CBBE]/40" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-[16px] text-[#7B6D63]" style={{ fontFamily: SERIF }}>
            New to Velouraz?{" "}
            <Link to="/signup" state={location.state} className="text-[#7A0E2E] font-semibold hover:text-[#2A2623] transition-colors border-b border-[#7A0E2E]/20 hover:border-[#2A2623] pb-px">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
