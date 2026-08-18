import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronDown, Instagram, Send, Clock, MessageCircle, Globe, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.19, 1, 0.22, 1] }
  };

  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    { name: 'Contact', href: '/contact', active: true }
  ];

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#2A2623] overflow-hidden">
      
      {/* Premium Breadcrumb */}
      <Breadcrumb 
        title="Get in Touch"
        subtitle="We'd love to hear from you. Reach out for inquiries, collaborations, or just to share your Velouraz story."
        bgImage="https://images.unsplash.com/photo-1594913785162-e6785311bc51?auto=format&fit=crop&q=80&w=1600"
        links={breadcrumbLinks}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 md:py-32">
        
        {/* Contact Info Grid - Luxury Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24 md:mb-32">
          {[
            { 
              icon: Mail, 
              label: "Email Us", 
              value: "info@velouraz.in",
              sub: "Response within 24 hours"
            },
            { 
              icon: Phone, 
              label: "Call Us", 
              value: "+91 91547 38781",
              sub: "Mon-Sat, 10am - 7pm IST"
            },
            { 
              icon: MapPin, 
              label: "Location", 
              value: "Mumbai, India",
              sub: "Handcrafted in the heart"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="bg-white rounded-[40px] p-10 border border-[#D8CBBE]/30 hover:border-[#D4A853]/40 hover:shadow-2xl transition-all duration-700 group text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#F8F4EF] flex items-center justify-center mb-8 mx-auto group-hover:bg-[#2A2623] group-hover:text-white transition-all duration-500">
                <item.icon size={24} strokeWidth={1} />
              </div>
              <p className="text-[16px] tracking-[0.4em] font-bold uppercase text-[#7B6D63] mb-3">{item.label}</p>
              <p className="text-xl md:text-2xl font-serif text-[#2A2623] mb-2">{item.value}</p>
              <p className="text-[16px] text-[#7B6D63] font-light">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Form + Sidebar Split */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Contact Form - Refined Design */}
          <motion.div 
            {...fadeUp}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[50px] p-8 md:p-16 border border-[#D8CBBE]/30 shadow-sm relative overflow-hidden">
              {/* Subtle background detail */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8F4EF] rounded-bl-[100%] opacity-50" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-serif text-[#2A2623] mb-4">Send a message</h2>
                <p className="text-[16px] text-[#7B6D63] mb-12 font-light">Fill in the details below and our concierge will reach out to you.</p>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[16px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#F8F4EF]/50 border-b border-[#D8CBBE] px-1 py-4 text-[16px] text-[#2A2623] outline-none focus:border-[#2e0e43] transition-all placeholder:text-[#7B6D63]/30" 
                        placeholder="E.g. Sophia Anderson" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#F8F4EF]/50 border-b border-[#D8CBBE] px-1 py-4 text-[16px] text-[#2A2623] outline-none focus:border-[#2e0e43] transition-all placeholder:text-[#7B6D63]/30" 
                        placeholder="sophia@example.com" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[16px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Inquiry Type</label>
                    <div className="relative">
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-[#F8F4EF]/50 border-b border-[#D8CBBE] py-4 text-[16px] text-[#2A2623] outline-none focus:border-[#2e0e43] transition-all appearance-none cursor-pointer"
                      >
                        <option>General Inquiry</option>
                        <option>Order Support</option>
                        <option>Wholesale / Collaboration</option>
                        <option>Product Sourcing</option>
                        <option>Press Inquiry</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7B6D63] pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[16px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Your Message</label>
                    <textarea 
                      rows="4" 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#F8F4EF]/50 border-b border-[#D8CBBE] py-4 text-[16px] text-[#2A2623] outline-none focus:border-[#2e0e43] transition-all resize-none placeholder:text-[#7B6D63]/30" 
                      placeholder="Share your thoughts with us..."
                    />
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="relative group w-full sm:w-auto bg-[#2A2623] text-white px-12 py-5 rounded-full overflow-hidden shadow-xl"
                  >
                    <span className="relative z-10 text-[16px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                      {submitted ? 'Inquiry Sent' : 'Submit Message'}
                      <Send size={14} className={submitted ? 'animate-bounce' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300'} />
                    </span>
                    <div className="absolute inset-0 bg-[#2e0e43] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.19, 1, 0.22, 1]" />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Visual & Info */}
          <motion.div 
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Studio Hours */}
            <div className="bg-white rounded-[40px] p-10 border border-[#D8CBBE]/30">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#F8F4EF] flex items-center justify-center">
                  <Clock size={20} className="text-[#D4A853]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-bold uppercase tracking-widest text-[#2A2623]">Concierge Hours</h3>
              </div>
              <div className="space-y-4 font-serif">
                {[
                  { day: 'Mon — Fri', time: '10:00 — 19:00' },
                  { day: 'Saturday', time: '10:00 — 17:00' },
                  { day: 'Sunday', time: 'By Appointment' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[16px] pb-3 border-b border-[#D8CBBE]/10 last:border-0 last:pb-0">
                    <span className="text-[#7B6D63]">{item.day}</span>
                    <span className="text-[#2A2623] font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Reach Card */}
            <div className="bg-[#2A2623] rounded-[40px] p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[60px] group-hover:bg-[#2e0e43]/20 transition-colors duration-1000" />
               
               <Award size={32} className="text-[#fff] mb-8 relative z-10" />
               <h3 className="text-2xl font-serif mb-4 relative z-10">Global Presence</h3>
               <p className="text-[16px] text-white/60 mb-8 font-light leading-relaxed relative z-10">
                 Though we are rooted in <span className="text-white font-medium italic">Mumbai</span>, our heart beats for patrons across the globe. We facilitate international inquiries via our dedicated concierge.
               </p>
               <div className="flex flex-wrap gap-3 relative z-10">
                  <a 
                    href="https://www.instagram.com/_velouraz_?igsh=cWt5bDBjZHZuZG9h&utm_source=qr" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#D4A853] hover:border-[#D4A853] hover:text-[#2A2623] transition-all duration-300 text-white"
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href="https://www.facebook.com/share/1Bg4DRSKhd/?mibextid=wwXIfr" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#D4A853] hover:border-[#D4A853] hover:text-[#2A2623] transition-all duration-300 text-white"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a 
                    href="https://pin.it/1J19Fel5b" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Pinterest"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#D4A853] hover:border-[#D4A853] hover:text-[#2A2623] transition-all duration-300 text-white"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.606 0 12.017 0z"/></svg>
                  </a>
                  <a 
                    href="https://www.threads.com/@_velouraz_?invite=0" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Threads"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#D4A853] hover:border-[#D4A853] hover:text-[#2A2623] transition-all duration-300 text-white"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.026-6.377-1.222-8.31-3.554C2.008 18.2 1 15.176 1 11.45 1 4.887 5.864.07 12.277 0c3.554 0 6.643 1.404 8.696 3.953l-2.073 1.748c-1.636-2.033-4.088-3.155-6.914-3.155-5.26 0-9.25 3.92-9.25 9.404 0 3.208.825 5.703 2.385 7.217 1.482 1.439 3.655 2.18 6.46 2.204 4.092.035 7.152-1.282 8.358-3.606.666-1.284.88-2.879.636-4.743-.377-2.875-2.613-4.748-5.69-4.748-2.64 0-4.526 1.464-4.834 3.737-.024.183.05.352.193.456.14.103.328.125.487.054 1.344-.593 2.76-.328 3.633.303.654.472.981 1.2.923 2.05-.084 1.233-1.077 2.116-2.358 2.1-1.042-.013-1.898-.755-1.996-1.728l.006-.062c.162-1.666 1.49-2.906 3.253-3.045 1.547-.122 3.018.423 3.864 1.428.618.734.922 1.667.857 2.628-.152 2.23-1.83 3.99-4.073 4.275-2.793.355-5.234-.582-6.527-2.506C5.034 14.88 5 13.06 5 11.45c0-4.143 3.003-7.5 7.234-7.5 2.327 0 4.412.982 5.72 2.696l1.96-1.872C20.198 2.532 17.518 1.25 12.234 1.25 6.786 1.25 2.25 5.567 2.25 11.45c0 3.44.912 6.19 2.637 8.168 1.68 1.928 4.094 2.926 7.292 2.95h.007c3.923 0 7.261-1.686 9.076-4.595.632-1.013.974-2.191 1.018-3.5.093-2.774-.78-5.112-2.525-6.761-1.583-1.496-3.774-2.278-6.335-2.26-4.168.03-7.218 2.873-7.53 7.025-.262 3.493 2.117 6.47 5.58 6.993 2.05.31 4.143-.162 5.741-1.294l1.32 1.76c-2.072 1.47-4.78 2.083-7.442 1.681-4.526-.684-7.636-4.577-7.294-9.15.408-5.43 4.383-9.15 9.876-9.19 3.298-.023 6.128.986 8.19 2.93 2.247 2.12 3.371 5.12 3.25 8.68-.057 1.68-.498 3.193-1.31 4.494C20.521 21.84 16.545 24 12.186 24z"/></svg>
                  </a>
               </div>
            </div>

            {/* Quick Support Tag */}
            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-center gap-6 p-6 rounded-[30px] bg-white border border-[#D8CBBE]/30 cursor-pointer"
            >
               <Globe size={24} className="text-[#2e0e43]" strokeWidth={1} />
               <div>
                  <p className="text-[16px] font-bold uppercase tracking-widest text-[#7B6D63]">Chat With Us</p>
                  <p className="text-[16px] font-serif text-[#2A2623]">Instant support via WhatsApp</p>
               </div>
               <MessageCircle size={18} className="ml-auto text-[#D8CBBE]" />
            </motion.div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Contact;