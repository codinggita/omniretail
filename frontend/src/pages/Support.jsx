import React, { useState } from 'react';

const Support = () => {
  const [formType, setFormType] = useState('general');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "How does the AI negotiation work?",
      a: "Our OmniBot uses real-time inventory data and your set margin thresholds to negotiate prices with customers automatically. It ensures you never sell below your minimum acceptable price while maximizing conversion."
    },
    {
      q: "Can I cancel a negotiation session?",
      a: "Yes, as a retailer, you can reject any active negotiation from your dashboard. Customers can also leave a session at any time, which will mark it as ended."
    },
    {
      q: "How do I sync my physical store inventory?",
      a: "You can use our API keys in the Settings portal to connect your existing POS system, or use the Bulk Import feature in the Inventory page to upload CSV/Excel files."
    },
    {
      q: "Is there a limit on API requests?",
      a: "Standard accounts have a limit of 10,000 requests per month. For higher volume, please contact our enterprise sales team."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">Help & Support</h2>
        <p className="text-zinc-400 text-lg max-w-2xl">Need help with your store? Browse our FAQs or get in touch with our technical team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary-container border border-primary-container/30">
              <span className="material-symbols-outlined text-3xl">contact_support</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Send us a message</h3>
              <p className="text-zinc-500">We typically respond within 24 hours.</p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
              <span className="material-symbols-outlined text-emerald-500 text-5xl mb-4">check_circle</span>
              <h4 className="text-xl font-bold text-emerald-400 mb-2">Ticket Submitted!</h4>
              <p className="text-emerald-200/60">Your support ticket has been created. Reference ID: #OR-{Math.floor(Math.random() * 10000)}</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 text-emerald-400 font-bold text-xs uppercase tracking-widest hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Subject Type</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="negotiation">AI Negotiation Logic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Urgency</label>
                  <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-blue-500/50">
                    <option>Normal</option>
                    <option>Medium</option>
                    <option className="text-red-400">High (Critical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  required
                  rows="5"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-blue-500/50 resize-none"
                  placeholder="Describe your issue in detail..."
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className="material-symbols-outlined text-[18px]">attach_file</span>
                  <span className="text-xs font-medium cursor-pointer hover:text-zinc-300">Attach screenshot</span>
                </div>
                <button 
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: FAQs & Info */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Quick Contacts */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 grid grid-cols-2 gap-4">
            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-zinc-500">mail</span>
              <span className="text-xs font-bold text-white">Email</span>
              <span className="text-[10px] text-zinc-500">support@omniretail.com</span>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-zinc-500">call</span>
              <span className="text-xs font-bold text-white">Phone</span>
              <span className="text-[10px] text-zinc-500">+91 1800-OMNI-SUPPORT</span>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-zinc-500">quiz</span>
              Common Questions
            </h3>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <h4 className="text-sm font-bold text-zinc-300 group-hover:text-blue-400 transition-colors mb-2 flex items-start gap-2">
                    <span className="text-blue-500/50 mt-0.5">Q.</span>
                    {faq.q}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-3 rounded-xl border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">
              View Knowledge Base
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
