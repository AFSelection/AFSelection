import React, { useState } from 'react';
import { X, Send, MessageCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { submitLead } from '../services/storage';
import { getWhatsAppUrl } from '../utils/whatsapp';

export default function InquiryModal({ item, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!item) return null;

  const formatPrice = (val) => {
    if (!val) return '';
    return `${item.currency || 'USD'} ${Number(val).toLocaleString('es-AR')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Por favor completa tu nombre y número de teléfono / WhatsApp (*)');
      return;
    }

    setIsSubmitting(true);

    const priceText = item.price ? ` (${formatPrice(item.price)})` : '';
    const noteText = `CONSULTA DESDE FICHA DE PRODUCTO:\nUnidad: ${item.title}${priceText}\nCategoría/Sección: ${item.category || item.sectionId}\n${formData.message ? 'Mensaje: ' + formData.message : ''}`;

    const newLead = {
      id: `inquiry-${Date.now()}`,
      listingId: item.id,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      notes: noteText,
      status: 'Pending',
      type: 'inquiry'
    };

    try {
      // 1. Save lead to Supabase CRM & send Web3Forms email notification to Agustín
      await submitLead(newLead);
    } catch (err) {
      console.error('Error recording lead to CRM:', err);
    }

    // 2. Build personalized WhatsApp message
    const productUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/producto/${item.id}`
      : `https://afselect.com.ar/producto/${item.id}`;

    let whatsappText = `Hola Agustín! Mi nombre es *${formData.name.trim()}* (Tel: ${formData.phone.trim()}).\n`;
    if (formData.email.trim()) {
      whatsappText += `Email: ${formData.email.trim()}\n`;
    }
    whatsappText += `\nMe interesa esta publicación:\n*${item.title}*${priceText}\nLink: ${productUrl}`;
    if (formData.message.trim()) {
      whatsappText += `\n\nComentario: "${formData.message.trim()}"`;
    }

    const whatsappUrl = getWhatsAppUrl(whatsappText);

    setIsSubmitting(false);
    setIsSubmitted(true);

    // 3. Open WhatsApp in new window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="inquiry-modal-backdrop" onClick={onClose}>
      <div className="inquiry-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        <div className="inquiry-modal-header">
          <div className="inquiry-badge">
            <ShieldCheck size={14} />
            <span>AF SELECT CONCIERGE</span>
          </div>
          <h2 className="inquiry-title">Consultar por esta Unidad</h2>
          <p className="inquiry-subtitle">
            Ingresá tus datos para notificar a Agustín Fidalgo y derivarte directamente a su WhatsApp.
          </p>

          {/* Product Summary Card Preview */}
          <div className="inquiry-item-preview">
            {item.images?.[0] && (
              <img src={item.images[0]} alt={item.title} className="inquiry-item-img" />
            )}
            <div className="inquiry-item-info">
              <span className="inquiry-item-cat">{item.category || item.sectionId}</span>
              <h4 className="inquiry-item-name">{item.title}</h4>
              <span className="inquiry-item-price">{formatPrice(item.price)}</span>
            </div>
          </div>
        </div>

        {isSubmitted ? (
          <div className="inquiry-success-block">
            <CheckCircle size={44} className="inquiry-success-icon" />
            <h3>¡Consulta Registrada!</h3>
            <p>
              Tus datos fueron guardados en nuestro CRM y se envió una notificación a Agustín Fidalgo. 
              Si la pestaña de WhatsApp no se abrió automáticamente, podés hacer clic abajo:
            </p>
            <button className="btn-pill btn-pill-dark" onClick={onClose} style={{ marginTop: '16px' }}>
              <span>Cerrar</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="inquiry-form">
            <div className="form-group">
              <label className="input-label">Nombre y Apellido *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej: Matías Rossi"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                className="input-field"
                placeholder="Ej: +54 9 381 555-1234"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Correo Electrónico (Opcional)</label>
              <input
                type="email"
                className="input-field"
                placeholder="Ej: cliente@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Consulta / Comentario Adicional (Opcional)</label>
              <textarea
                className="input-field"
                rows={2}
                placeholder="Ej: ¿Aceptan permutas? ¿Disponibilidad para ver la unidad?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn-submit-inquiry"
              disabled={isSubmitting}
            >
              <MessageCircle size={18} />
              <span>{isSubmitting ? 'PROCESANDO...' : 'CONTINUAR A WHATSAPP CON MENSAJE PERSONALIZADO'}</span>
            </button>

            <span className="inquiry-footer-note">
              🔒 Notifica automáticamente a Agustín en el CRM y por email aunque no envíes el mensaje en WhatsApp.
            </span>
          </form>
        )}
      </div>
    </div>
  );
}
