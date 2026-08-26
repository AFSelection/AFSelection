import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { submitLead } from '../services/storage';
import { getWhatsAppUrl } from '../utils/whatsapp';

export default function ContactPage({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjectType: 'compra', // compra | venta | inversiones | general
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    setIsSubmitting(true);

    const subjectLabels = {
      compra: 'Asesoramiento para Compra',
      venta: 'Publicación / Venta de Activo',
      inversiones: 'Desarrollos & Inversiones',
      general: 'Consulta General'
    };

    const notesText = `CONSULTA DESDE SECCIÓN CONTACTO:\nTipo: ${subjectLabels[formData.subjectType] || 'General'}\nMensaje: ${formData.message}`;

    const newLead = {
      id: `contact-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      notes: notesText,
      status: 'Pending',
      type: 'contact'
    };

    try {
      await submitLead(newLead);
      setIsSubmitted(true);
    } catch (err) {
      alert('Ocurrió un error al enviar el formulario. Por favor intentá nuevamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWtpUrl = getWhatsAppUrl('Hola Agustín, quisiera realizar una consulta directa desde la sección de contacto de AF Select.');

  return (
    <div className="product-detail-container contact-page-container">
      
      {/* Top Back Button */}
      <div className="detail-navigation-bar" style={{ marginBottom: '32px' }}>
        <button className="btn-back-text" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>VOLVER AL INICIO</span>
        </button>
      </div>

      {isSubmitted ? (
        <div className="sell-success-container" style={{ maxWidth: '680px', margin: '40px auto' }}>
          <CheckCircle size={48} className="success-icon" />
          <h2>¡Mensaje Enviado con Éxito!</h2>
          <p>
            Tu consulta fue registrada en nuestro CRM y se notificó inmediatamente por mail a Agustín Fidalgo. 
            Nos pondremos en contacto con vos a la brevedad.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
            <button className="btn-pill btn-pill-dark" onClick={onBack}>
              <span>Volver al Inicio</span>
            </button>
            <a href={directWtpUrl} target="_blank" rel="noopener noreferrer" className="btn-pill" style={{ background: '#25D366', color: '#FFF', borderColor: '#25D366' }}>
              <MessageSquare size={16} />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="contact-page-grid">
          
          {/* Left Column: Direct Info & Executive Profile */}
          <div className="contact-info-card">
            <div className="concierge-tag">AF SELECT • OFICINA & CONCIERGE</div>
            <h1 className="contact-main-title">Contacto Directo</h1>
            <p className="contact-description">
              Atención personalizada para la adquisición, intermediación y gestión de activos de alta gama.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="contact-icon-bubble">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="contact-item-label">LÍNEA DIRECTA & WHATSAPP</span>
                  <a href="https://wa.me/5493813590196" target="_blank" rel="noopener noreferrer" className="contact-item-value">
                    +54 9 381 359-0196
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-bubble">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="contact-item-label">CORREO ELECTRÓNICO</span>
                  <a href="mailto:agustinfidalgoselect@gmail.com" className="contact-item-value">
                    agustinfidalgoselect@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-bubble">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="contact-item-label">UBICACIÓN</span>
                  <span className="contact-item-value">Tucumán, Argentina</span>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-bubble">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="contact-item-label">HORARIOS DE ATENCIÓN</span>
                  <span className="contact-item-value">Lunes a Sábados 09:00 - 20:00 hs</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="contact-wtp-callout">
              <h4>¿Preferís chatear directamente?</h4>
              <p>Iniciá una conversación directa con Agustín Fidalgo en un clic.</p>
              <a href={directWtpUrl} target="_blank" rel="noopener noreferrer" className="btn-wtp-direct-contact">
                <MessageSquare size={16} />
                <span>INICIAR CHAT DE WHATSAPP</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-card">
            <h3 className="form-card-title">ENVIAR UN MENSAJE</h3>
            <p className="form-card-subtitle">
              Completá el formulario. Tu solicitud se guardará en nuestro CRM y le enviará un aviso inmediato por correo a Agustín.
            </p>

            <form onSubmit={handleSubmit} className="contact-editorial-form">
              <div className="form-group">
                <label className="input-label">Nombre Completo *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Tu nombre y apellido"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Correo Electrónico *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="ejemplo@correo.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+54 9 381 ..."
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Tipo de Consulta</label>
                <select
                  className="input-field select-field"
                  value={formData.subjectType}
                  onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                >
                  <option value="compra">Asesoramiento para Compra de Vehículo o Propiedad</option>
                  <option value="venta">Publicación / Venta Directa de mi Activo</option>
                  <option value="inversiones">Inversiones & Desarrollo</option>
                  <option value="general">Otra Consulta General</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Mensaje / Detalle de la Consulta *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Escribí aquí los detalles de tu consulta..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-submit-contact-form" disabled={isSubmitting}>
                <span>{isSubmitting ? 'ENVIANDO...' : 'ENVIAR CONSULTA AL CRM & MAIL'}</span>
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
