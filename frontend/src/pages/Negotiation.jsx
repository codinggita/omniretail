import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNegotiationById, sendNegotiationMessage, acceptNegotiation, rejectNegotiation } from '../api/negotiationsApi';

const Negotiation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [negotiation, setNegotiation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerInput, setOfferInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const load = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getNegotiationById(id);
      setNegotiation(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [negotiation?.messages]);

  const handleSend = async () => {
    const offer = parseFloat(offerInput);
    if (!offerInput || isNaN(offer)) return;
    setSending(true);
    try {
      const updated = await sendNegotiationMessage(
        id,
        `My offer is ₹${offer.toLocaleString('en-IN')}.`,
        offer
      );
      setNegotiation(updated);
      setOfferInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleAccept = async () => {
    try {
      const updated = await acceptNegotiation(id);
      setNegotiation(updated);
    } catch (e) { console.error(e); }
  };

  const handleReject = async () => {
    try {
      await rejectNegotiation(id);
      navigate('/');
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-2rem)]">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] animate-spin">progress_activity</span>
          <p className="font-inter text-sm">Loading negotiation...</p>
        </div>
      </div>
    );
  }

  if (!negotiation) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-2rem)]">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px]">error</span>
          <p className="font-inter text-sm">Negotiation not found.</p>
          <button onClick={() => navigate('/')} className="text-primary-container font-inter text-sm font-semibold">← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const isActive = negotiation.status === 'active';
  const isAccepted = negotiation.status === 'accepted';

  return (
    <div className="flex items-center justify-center h-[calc(100vh-2rem)] w-full">
      <div className="w-full max-w-5xl bg-[#201f22] rounded-xl border border-[#414751] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[85vh]">

        {/* Left Panel */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#414751] bg-[#131315] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-manrope text-[24px] font-semibold text-[#e5e1e4]">
              {isActive ? 'Active Session' : isAccepted ? '✅ Deal Accepted' : '❌ Session Ended'}
            </h3>
            {isActive && (
              <div className="flex items-center gap-2 bg-[#93000a]/20 text-[#ffb4ab] px-3 py-1 rounded-full border border-[#ffb4ab]/30">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                <span className="font-inter text-[12px] font-semibold tracking-widest uppercase">Live</span>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-[#414751] overflow-hidden bg-[#1c1b1d]">
            <img alt={negotiation.productName} className="w-full h-48 object-cover" src={negotiation.productImage} />
            <div className="p-4 flex flex-col gap-2">
              <p className="font-inter text-[14px] text-[#c1c7d3] uppercase tracking-wider">{negotiation.productSku}</p>
              <h4 className="font-manrope text-[24px] font-semibold text-[#e5e1e4]">{negotiation.productName}</h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-inter text-[14px] text-[#8b919d] line-through">₹{negotiation.basePrice?.toLocaleString('en-IN')}</span>
                <span className="font-manrope text-[24px] font-semibold text-[#a4c9ff]">₹{negotiation.currentOffer?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-inter text-[14px] text-[#c1c7d3]">Min. Acceptable</span>
              <span className="font-inter text-[14px] text-[#e5e1e4]">₹{negotiation.minAcceptablePrice?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-inter text-[14px] text-[#c1c7d3]">Rounds Used</span>
              <span className="font-inter text-[14px] text-[#e5e1e4]">{negotiation.roundsUsed} / {negotiation.roundsTotal}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-inter text-[14px] text-[#c1c7d3]">Customer</span>
              <span className="font-inter text-[14px] text-[#e5e1e4]">{negotiation.customerName}</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Chat */}
        <div className="w-full md:w-2/3 flex flex-col bg-[#1c1b1d]">
          <div className="flex items-center justify-between p-4 border-b border-[#414751] bg-[#201f22]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#60a5fa]/20 flex items-center justify-center text-[#a4c9ff] border border-[#a4c9ff]/30">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div>
                <h4 className="font-inter text-[16px] font-semibold text-[#e5e1e4]">OmniBot Negotiator</h4>
                <p className="font-inter text-[14px] text-[#00a572] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00a572]" /> {isActive ? 'Online' : 'Session Ended'}
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/')} className="text-[#c1c7d3] hover:text-[#e5e1e4] transition-colors p-2 rounded-lg hover:bg-[#353437] outline-none">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
            {negotiation.messages.map((msg, i) => (
              msg.sender === 'bot' ? (
                <div key={i} className="flex items-start gap-3 w-max max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-[#60a5fa]/20 flex-shrink-0 flex items-center justify-center text-[#a4c9ff] mt-1 border border-[#a4c9ff]/30">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                  <div className="bg-[#201f22] border border-[#414751] rounded-2xl rounded-tl-sm p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <p className="font-inter text-[15px] text-[#e5e1e4]">{msg.content}</p>
                    {msg.offer && (
                      <div className="mt-3 p-3 bg-[#131315] rounded-lg border border-[#414751] flex items-center justify-between">
                        <span className="font-inter text-[13px] text-[#c1c7d3]">Offer</span>
                        <span className="font-manrope text-[20px] font-semibold text-[#a4c9ff]">₹{msg.offer?.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <span className="font-inter text-[11px] text-[#c1c7d3] mt-2 block">
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-3 w-max max-w-[80%] self-end flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#353437] flex-shrink-0 flex items-center justify-center text-[#e5e1e4] mt-1 border border-[#414751]">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <div className="bg-[#131315] border border-[#414751] rounded-2xl rounded-tr-sm p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <p className="font-inter text-[15px] text-[#e5e1e4]">{msg.content}</p>
                    <span className="font-inter text-[11px] text-[#c1c7d3] mt-2 block text-right">
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-[#414751] bg-[#201f22]/80 backdrop-blur-md">
            {isActive ? (
              <>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b919d] font-inter text-sm">₹</span>
                    <input
                      type="number"
                      className="w-full bg-[#131315] border border-[#414751] rounded-lg pl-8 pr-4 py-2.5 font-inter text-sm text-[#e5e1e4] focus:outline-none focus:border-[#a4c9ff] focus:ring-1 focus:ring-[#a4c9ff] transition-colors"
                      placeholder={`Your offer (min ₹${negotiation.minAcceptablePrice?.toLocaleString('en-IN')})`}
                      value={offerInput}
                      onChange={(e) => setOfferInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={sending || !offerInput}
                    className="bg-[#a4c9ff]/20 border border-[#a4c9ff]/40 text-[#a4c9ff] px-4 rounded-lg hover:bg-[#a4c9ff]/30 transition-colors disabled:opacity-50 outline-none"
                  >
                    <span className="material-symbols-outlined">{sending ? 'hourglass_empty' : 'send'}</span>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleReject} className="flex-1 bg-[#353437] hover:bg-[#39393b] text-[#ffb4ab] font-inter text-[14px] font-semibold py-2.5 px-4 rounded-lg border border-[#ffb4ab]/30 transition-colors flex items-center justify-center gap-2 outline-none">
                    <span className="material-symbols-outlined">close</span>
                    Reject & Leave
                  </button>
                  <button onClick={handleAccept} className="flex-1 bg-[#00a572] hover:bg-[#4edea3] text-[#00311f] font-inter text-[14px] font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,165,114,0.3)] outline-none">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
                    Accept Current Offer
                  </button>
                </div>
              </>
            ) : (
              <div className={`text-center py-4 rounded-lg font-inter text-sm font-semibold ${isAccepted ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/30' : 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'}`}>
                {isAccepted ? '✅ Deal sealed! Order being processed.' : '❌ Negotiation ended.'}
                <button onClick={() => navigate('/')} className="ml-3 underline text-xs opacity-70">← Dashboard</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Negotiation;
