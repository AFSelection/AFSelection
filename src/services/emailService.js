export async function sendLeadNotificationEmail(lead) {
  if (!lead) return;

  try {
    const typeLabels = {
      sell: 'PUBLICACIÓN / VENTA DIRECTA',
      buy: 'CONSULTA DE COMPRA DE PRODUCTO',
      contact: 'MENSAJE DIRECTO DE CONTACTO',
      inquiry: 'CONSULTA VÍA MODAL / WHATSAPP'
    };

    const label = typeLabels[lead.type] || 'NUEVO LEAD DE CLIENTE';
    const timestamp = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const targetEmail = 'agustinfidalgoselect@gmail.com';
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'e2583a57-4260-4ae9-aaf3-f59d4c17b9a5';

    // Provider 1: FormSubmit AJAX Service (Direct email delivery to agustinfidalgoselect@gmail.com)
    const sendFormSubmit = async () => {
      try {
        await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `[AF SELECT] ${label} - ${lead.name || 'Cliente'}`,
            _replyto: lead.email || targetEmail,
            _captcha: 'false',
            _template: 'table',
            Nombre_Cliente: lead.name || 'No especificado',
            Email_Contacto: lead.email || 'No especificado',
            Telefono_WhatsApp: lead.phone || 'No especificado',
            Tipo_Solicitud: label,
            Referencia_Producto: lead.listingId || lead.id || '-',
            Detalles_y_Mensaje: lead.notes || lead.message || 'Sin observaciones',
            Fecha_Registro: timestamp
          })
        });
      } catch (err) {
        console.error('Error enviando email via FormSubmit:', err);
      }
    };

    // Provider 2: Web3Forms API Service
    const sendWeb3Forms = async () => {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[AF SELECT] ${label} - ${lead.name || 'Cliente'}`,
            from_name: `${lead.name || 'Cliente'} (AF Select Web)`,
            reply_to: lead.email || targetEmail,
            nombre_cliente: lead.name || 'No especificado',
            email_cliente: lead.email || 'No especificado',
            telefono_whatsapp: lead.phone || 'No especificado',
            tipo_solicitud: label,
            id_referencia: lead.listingId || lead.id || '-',
            detalles_observaciones: lead.notes || lead.message || 'Sin observaciones',
            fecha_registro: timestamp
          })
        });
      } catch (err) {
        console.error('Error enviando email via Web3Forms:', err);
      }
    };

    // Send via both providers concurrently for maximum reliability
    await Promise.allSettled([sendFormSubmit(), sendWeb3Forms()]);
  } catch (err) {
    console.error('Error general en dispatch de notificación por email:', err);
  }
}

