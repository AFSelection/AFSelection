import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Send, CheckCircle, Car, Home, ShieldCheck, FileText, User } from 'lucide-react';
import { submitLead } from '../services/storage';

export default function SellFormPage({ onBack }) {
  const [step, setStep] = useState(1);
  const [assetType, setAssetType] = useState('autos'); // 'autos' | 'propiedades'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    // Auto specific
    brandModel: '',
    year: '',
    kilometers: '',
    // Real Estate specific
    propertyType: 'Casa', // Casa, Departamento, Terreno, Oficina
    location: '',
    surface: '',
    rooms: '',
    // General
    priceExpectation: '',
    mediaLinks: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleNext = (e) => {
    e.preventDefault();
    // Validation for Step 2
    if (step === 2) {
      if (assetType === 'autos' && (!formData.brandModel || !formData.year || !formData.kilometers)) {
        alert('Por favor completa los campos requeridos (*)');
        return;
      }
      if (assetType === 'propiedades' && (!formData.location)) {
        alert('Por favor completa la ubicación requerida (*)');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Por favor completa todos los datos de contacto requeridos (*)');
      return;
    }

    // Create a detailed message combining asset data
    let descriptionText = '';
    if (assetType === 'autos') {
      descriptionText = `SOLICITUD VENTA AUTO:\nVehículo: ${formData.brandModel}\nAño: ${formData.year}\nKM: ${formData.kilometers}\n`;
    } else {
      descriptionText = `SOLICITUD VENTA PROPIEDAD:\nTipo: ${formData.propertyType}\nUbicación: ${formData.location}\nSuperficie: ${formData.surface} m²\nAmbientes: ${formData.rooms}\n`;
    }
    descriptionText += `Expectativa de Precio: USD ${formData.priceExpectation}\nLinks a Fotos/Videos: ${formData.mediaLinks}\nComentarios: ${formData.message}`;

    try {
      const newLead = {
        id: `sell-${Date.now()}`,
        listingId: null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: descriptionText,
        status: 'Pending',
        type: 'sell'
      };

      await submitLead(newLead);
      setIsSubmitted(true);
    } catch (error) {
      alert('Hubo un error al enviar tu solicitud de publicación. Por favor intentá nuevamente.');
    }
  };

  return (
    <div className="product-detail-container" style={{ marginTop: '90px' }}>
      
      {/* Top Back Navigation */}
      <div className="detail-navigation-bar" style={{ marginBottom: '32px' }}>
        <button className="btn-back-text" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>VOLVER AL INICIO</span>
        </button>
      </div>

      {isSubmitted ? (
        <div className="sell-success-container" style={{ maxWidth: '680px', margin: '40px auto' }}>
          <CheckCircle size={48} className="success-icon" />
          <h2>¡Solicitud Recibida!</h2>
          <p>
            Los detalles de tu publicación tentativa fueron registrados. 
            Agustín Fidalgo o un asesor se comunicarán con vos a la brevedad para coordinar los siguientes pasos.
          </p>
          <button className="btn-pill btn-pill-dark" onClick={onBack} style={{ marginTop: '24px' }}>
            <span>Volver al Inicio</span>
          </button>
        </div>
      ) : (
        <div className="step-sell-split-layout">
          
          {/* Left Column: Progress Guide (40% width) */}
          <div className="step-guide-sidebar">
            <span className="concierge-tag">PUBLICACIÓN DIRECTA</span>
            <h2 className="step-guide-title">Ofrecé tu Vehículo o Propiedad</h2>
            <p className="step-guide-subtitle">
              Completá los pasos para enviarnos la información técnica. Evaluaremos los datos para publicarlo en la plataforma.
            </p>

            {/* Stepper progress list */}
            <div className="stepper-vertical-list">
              <div className={`stepper-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                <div className="step-number-bubble">
                  {step > 1 ? <CheckCircle size={16} /> : '1'}
                </div>
                <div className="step-text-content">
                  <span className="step-label">PASO 1</span>
                  <span className="step-name">Seleccionar Activo</span>
                </div>
              </div>

              <div className={`stepper-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                <div className="step-number-bubble">
                  {step > 2 ? <CheckCircle size={16} /> : '2'}
                </div>
                <div className="step-text-content">
                  <span className="step-label">PASO 2</span>
                  <span className="step-name">Ficha Técnica</span>
                </div>
              </div>

              <div className={`stepper-item ${step === 3 ? 'active' : ''}`}>
                <div className="step-number-bubble">3</div>
                <div className="step-text-content">
                  <span className="step-label">PASO 3</span>
                  <span className="step-name">Datos de Contacto</span>
                </div>
              </div>
            </div>

            <div className="stepper-compliance-box">
              <ShieldCheck size={18} />
              <p>Revisión 100% confidencial antes de cualquier publicación formal.</p>
            </div>
          </div>

          {/* Right Column: Step Form Content (60% width) */}
          <div className="step-form-card">
            
            {/* Step 1: Choose asset type */}
            {step === 1 && (
              <div className="step-animation-container">
                <h3 className="form-step-heading">
                  <Car size={18} />
                  <span>¿Qué tipo de activo deseás vender?</span>
                </h3>
                <p className="form-step-subheading">Seleccioná una categoría para habilitar su ficha técnica correspondiente.</p>
                
                <div className="asset-type-wizard-grid">
                  <div
                    className={`wizard-type-card ${assetType === 'autos' ? 'selected' : ''}`}
                    onClick={() => setAssetType('autos')}
                  >
                    <div className="icon-circle">
                      <Car size={32} />
                    </div>
                    <h4>Vehículo Automotor</h4>
                    <p>Camionetas, autos particulares, deportivos o utilitarios.</p>
                  </div>

                  <div
                    className={`wizard-type-card ${assetType === 'propiedades' ? 'selected' : ''}`}
                    onClick={() => setAssetType('propiedades')}
                  >
                    <div className="icon-circle">
                      <Home size={32} />
                    </div>
                    <h4>Propiedad Inmueble</h4>
                    <p>Casas, departamentos, terrenos, lotes o locales.</p>
                  </div>
                </div>

                <div className="wizard-actions-row">
                  <span /> {/* Spacer */}
                  <button className="btn-wizard-next" onClick={handleNext}>
                    <span>Siguiente</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Technical Specifications */}
            {step === 2 && (
              <div className="step-animation-container">
                <h3 className="form-step-heading">
                  <FileText size={18} />
                  <span>Detalles de la Unidad ({assetType === 'autos' ? 'Auto' : 'Propiedad'})</span>
                </h3>
                <p className="form-step-subheading">Ingresá los datos técnicos más importantes del activo.</p>

                {assetType === 'autos' ? (
                  <div className="wizard-form-fields-grid">
                    <div className="form-input-group span-2">
                      <label>Marca, Modelo y Versión *</label>
                      <input
                        type="text"
                        placeholder="Ej: Toyota Hilux SRX 2.8 TDI"
                        required
                        value={formData.brandModel}
                        onChange={(e) => setFormData({ ...formData, brandModel: e.target.value })}
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Año de Fabricación *</label>
                      <input
                        type="number"
                        placeholder="Ej: 2022"
                        required
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Kilometraje *</label>
                      <input
                        type="number"
                        placeholder="Ej: 45000"
                        required
                        value={formData.kilometers}
                        onChange={(e) => setFormData({ ...formData, kilometers: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="wizard-form-fields-grid">
                    <div className="form-input-group">
                      <label>Tipo de Unidad</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      >
                        <option value="Casa">Casa</option>
                        <option value="Departamento">Departamento</option>
                        <option value="Terreno">Lote / Terreno</option>
                        <option value="Oficina">Oficina / Local</option>
                      </select>
                    </div>
                    <div className="form-input-group">
                      <label>Ubicación / Barrio *</label>
                      <input
                        type="text"
                        placeholder="Ej: Yerba Buena, Tucumán"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Superficie Total (m²)</label>
                      <input
                        type="number"
                        placeholder="Ej: 360"
                        value={formData.surface}
                        onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Cantidad de Ambientes</label>
                      <input
                        type="number"
                        placeholder="Ej: 3"
                        value={formData.rooms}
                        onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="wizard-form-fields-grid" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                  <div className="form-input-group">
                    <label>Valor Esperado de Venta (USD)</label>
                    <input
                      type="text"
                      placeholder="Ej: 38000"
                      value={formData.priceExpectation}
                      onChange={(e) => setFormData({ ...formData, priceExpectation: e.target.value })}
                    />
                  </div>
                  <div className="form-input-group">
                    <label>Enlace a fotos/videos (Drive/WeTransfer)</label>
                    <input
                      type="text"
                      placeholder="Ej: https://drive.google.com/..."
                      value={formData.mediaLinks}
                      onChange={(e) => setFormData({ ...formData, mediaLinks: e.target.value })}
                    />
                  </div>
                </div>

                <div className="wizard-actions-row">
                  <button type="button" className="btn-wizard-back" onClick={handleBack}>
                    Atrás
                  </button>
                  <button type="button" className="btn-wizard-next" onClick={handleNext}>
                    <span>Siguiente</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Comments */}
            {step === 3 && (
              <div className="step-animation-container">
                <h3 className="form-step-heading">
                  <User size={18} />
                  <span>Datos de Contacto del Propietario</span>
                </h3>
                <p className="form-step-subheading">Indicanos tus datos para coordinar la tasación y revisión física.</p>

                <div className="wizard-form-fields-grid">
                  <div className="form-input-group">
                    <label>Nombre y Apellido *</label>
                    <input
                      type="text"
                      placeholder="Ingresá tu nombre"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-input-group">
                    <label>Correo Electrónico *</label>
                    <input
                      type="email"
                      placeholder="Ej: nombre@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-input-group span-2">
                    <label>Teléfono de WhatsApp / Contacto *</label>
                    <input
                      type="tel"
                      placeholder="Ej: +54 9 381 555 4433"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-input-group span-2">
                    <label>Comentarios adicionales (Estado general, detalles, deudas, etc.)</label>
                    <textarea
                      placeholder="Ingresá observaciones sobre el estado, equipamiento o plazos..."
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                </div>

                <div className="wizard-actions-row">
                  <button type="button" className="btn-wizard-back" onClick={handleBack}>
                    Atrás
                  </button>
                  <button type="button" className="btn-submit-wizard" onClick={handleSubmit}>
                    <span>Enviar Solicitud</span>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
