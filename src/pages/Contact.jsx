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
              <p className="text-[14px] tracking-[0.4em] font-bold uppercase text-[#7B6D63] mb-3">{item.label}</p>
              <p className="text-xl md:text-2xl font-serif text-[#2A2623] mb-2">{item.value}</p>
              <p className="text-[13px] text-[#7B6D63] font-light">{item.sub}</p>
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
                <p className="text-[15px] text-[#7B6D63] mb-12 font-light">Fill in the details below and our concierge will reach out to you.</p>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#F8F4EF]/50 border-b border-[#D8CBBE] px-1 py-4 text-[15px] text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all placeholder:text-[#7B6D63]/30" 
                        placeholder="E.g. Sophia Anderson" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#F8F4EF]/50 border-b border-[#D8CBBE] px-1 py-4 text-[15px] text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all placeholder:text-[#7B6D63]/30" 
                        placeholder="sophia@example.com" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Inquiry Type</label>
                    <div className="relative">
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-[#F8F4EF]/50 border-b border-[#D8CBBE] py-4 text-[15px] text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all appearance-none cursor-pointer"
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
                    <label className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#2A2623] ml-1">Your Message</label>
                    <textarea 
                      rows="4" 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#F8F4EF]/50 border-b border-[#D8CBBE] py-4 text-[15px] text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all resize-none placeholder:text-[#7B6D63]/30" 
                      placeholder="Share your thoughts with us..."
                    />
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="relative group w-full sm:w-auto bg-[#2A2623] text-white px-12 py-5 rounded-full overflow-hidden shadow-xl"
                  >
                    <span className="relative z-10 text-[14px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                      {submitted ? 'Inquiry Sent' : 'Submit Message'}
                      <Send size={14} className={submitted ? 'animate-bounce' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300'} />
                    </span>
                    <div className="absolute inset-0 bg-[#7A0E2E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.19, 1, 0.22, 1]" />
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
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#2A2623]">Concierge Hours</h3>
              </div>
              <div className="space-y-4 font-serif">
                {[
                  { day: 'Mon — Fri', time: '10:00 — 19:00' },
                  { day: 'Saturday', time: '10:00 — 17:00' },
                  { day: 'Sunday', time: 'By Appointment' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[15px] pb-3 border-b border-[#D8CBBE]/10 last:border-0 last:pb-0">
                    <span className="text-[#7B6D63]">{item.day}</span>
                    <span className="text-[#2A2623] font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Reach Card */}
            <div className="bg-[#2A2623] rounded-[40px] p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[60px] group-hover:bg-[#7A0E2E]/20 transition-colors duration-1000" />
               
               <Award size={32} className="text-[#fff] mb-8 relative z-10" />
               <h3 className="text-2xl font-serif mb-4 relative z-10">Global Presence</h3>
               <p className="text-[14px] text-white/60 mb-8 font-light leading-relaxed relative z-10">
                 Though we are rooted in <span className="text-white font-medium italic">Mumbai</span>, our heart beats for patrons across the globe. We facilitate international inquiries via our dedicated concierge.
               </p>
               <div className="flex gap-4 relative z-10">
                  {[
                    { icon: Instagram, href: '#' },
                    { icon: MessageCircle, href: '#' },
                    { icon: Mail, href: '#' }
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.href} 
                      className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#D4A853] hover:border-[#D4A853] transition-all duration-300"
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
               </div>
            </div>

            {/* Quick Support Tag */}
            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-center gap-6 p-6 rounded-[30px] bg-white border border-[#D8CBBE]/30 cursor-pointer"
            >
               <Globe size={24} className="text-[#7A0E2E]" strokeWidth={1} />
               <div>
                  <p className="text-[14px] font-bold uppercase tracking-widest text-[#7B6D63]">Chat With Us</p>
                  <p className="text-[15px] font-serif text-[#2A2623]">Instant support via WhatsApp</p>
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