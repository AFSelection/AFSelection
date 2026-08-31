import React, { useState, useEffect } from 'react';
import { Zap, Clock } from 'lucide-react';

export default function PriceDropShowcaseSection({ listings = [], onSelectListing }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 18, seconds: 36 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 18, seconds: 36 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dbOffers = (listings || [])
    .filter((item) => Boolean(item.isOffer) && item.oldPrice && Number(item.oldPrice) > Number(item.price))
    .map((item) => {
      const discountPct = Math.round(((Number(item.oldPrice) - Number(item.price)) / Number(item.oldPrice)) * 100);
      return {
        id: item.id,
        title: item.title,
        category: item.category,
        oldPrice: item.oldPrice,
        newPrice: item.price,
        currency: item.currency || 'USD',
        discount: `-${discountPct}%`,
        image: item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        location: item.location,
        sectionId: item.sectionId,
        rawItem: item
      };
    });

  // If no items are on discount, hide the section completely
  if (dbOffers.length === 0) {
    return null;
  }

  const priceDropItems = dbOffers;

  return (
    <section className="price-drop-container">
      <div className="price-drop-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="zap-badge-icon">
            <Zap size={20} style={{ display: 'block' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: '#111317', lineHeight: '1.05' }}>
              BAJARON DE PRECIO
            </h2>
          </div>
        </div>

        {/* Ultra-Rounded Luxury Countdown Timer Pill */}
        <div className="countdown-timer-pill">
          <Clock size={15} className="timer-clock-icon" />
          <span className="timer-lbl">OPORTUNIDAD POR</span>
          <div className="timer-boxes">
            <span className="t-box">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="t-sep">:</span>
            <span className="t-box">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="t-sep">:</span>
            <span className="t-box">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className="price-drop-grid">
        {priceDropItems.map((item) => (
          <div
            key={item.id}
            className="price-drop-card"
            onClick={() => onSelectListing({
              ...item.rawItem,
              price: item.newPrice,
              subtitle: `Oportunidad con ${item.discount} de rebaja directa.`
            })}
          >
            <div className="pd-card-img">
              <img src={item.image} alt={item.title} />
              <span className="pd-discount-pill">{item.discount}</span>
            </div>

            <div className="pd-card-body">
              <span className="pd-loc-text">{item.location}</span>
              <h3 className="pd-title-text">{item.title}</h3>

              <div className="pd-price-row">
                <span className="pd-old-price">{item.currency} {Number(item.oldPrice).toLocaleString('es-AR')}</span>
                <div className="pd-new-price">{item.currency} {Number(item.newPrice).toLocaleString('es-AR')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
