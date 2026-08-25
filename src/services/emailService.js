export async function sendLeadNotificationEmail(lead) {
  try {
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || '12cd5bc5-f4d7-4398-98f7-041f06ccbfd1';
    if (!accessKey) {
      console.warn('VITE_WEB3FORMS_KEY no configurada. Saltando envío de email.');
      return;
    }

    const typeLabels = {
      sell: 'PUBLICACIÓN / VENTA DIRECTA',
      buy: 'CONSULTA DE COMPRA',
      contact: 'MENSAJE DIRECTO DE CONTACTO',
      inquiry: 'CONSULTA VÍA WHATSAPP DE PRODUCTO'
    };

    const label = typeLabels[lead.type] || 'NUEVO LEAD DE CLIENTE';
    const timestamp = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[AF SELECT] ${label} - ${lead.name || 'Cliente'}`,
        from_name: `${lead.name || 'Cliente'} (AF Select Web)`,
        reply_to: lead.email || 'agustinfidalgoselect@gmail.com',
        nombre_cliente: lead.name || 'No especificado',
        email_cliente: lead.email || 'No especificado',
        telefono_whatsapp: lead.phone || 'No especificado',
        tipo_solicitud: label,
        id_referencia: lead.listingId || lead.id || '-',
        detalles_observaciones: lead.notes || lead.message || 'Sin observaciones',
        fecha_registro: timestamp
      })
    });

    const data = await response.json();
    if (!data.success) {
      console.warn('Web3Forms returned non-success:', data);
    }
  } catch (err) {
    console.error('Error enviando notificación por email con Web3Forms:', err);
  }
}
