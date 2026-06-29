module.exports = {
    // Config Embed Panel
    panel_title: "🎫 Soporte & Tickets Qvis",
    panel_description: "¿Necesitas ayuda con algún proyecto, reporte o consulta?\nAbre un ticket de soporte interactivo presionando el botón de abajo y seleccionando la categoría correspondiente.\n\n**Categorías disponibles:**\n🛠️ **Soporte Técnico**: Dudas o problemas con el software.\n🚨 **Reportes**: Reportar comportamientos inadecuados.\n💸 **Compras / Donaciones**: Consultas de pagos, ventajas o tiers.\n📝 **Postulaciones**: Aplica para formar parte de nuestro equipo.",
    panel_footer: "Sistema de Tickets Qvis • Rápido y Organizado",
    btn_create_ticket: "Crear Ticket",
    setup_success: "✅ ¡Sistema de tickets multi-categoría de **Qvis** configurado exitosamente!\n- Canal del panel: {channel}\n- Canal de logs: {logs}",
    setup_error: "❌ Hubo un error al enviar el panel al canal {channel}.",

    // Category Selector
    select_category_placeholder: "Selecciona una categoría de soporte",
    cat_tech_label: "Soporte Técnico",
    cat_tech_desc: "Dudas de software o problemas de compilación",
    cat_reports_label: "Reportes de Usuarios",
    cat_reports_desc: "Reportar comportamiento inadecuado o abuso",
    cat_purchases_label: "Compras / Donaciones",
    cat_purchases_desc: "Dudas de pagos, donaciones o ventajas",
    cat_apps_label: "Aplicaciones / Postulaciones",
    cat_apps_desc: "Postularse para el equipo de soporte",
    select_prompt: "Por favor, selecciona la categoría adecuada para tu ticket:",

    // Modal
    modal_title: "Formulario de Ticket - Qvis",
    modal_subject_label: "Asunto del Ticket",
    modal_subject_placeholder: "Ej: Error de compilación, dudas de hosting...",
    modal_desc_label: "Detalles / Descripción",
    modal_desc_placeholder: "Describe tu consulta o problema detalladamente para ayudarte mejor.",
    modal_config_error: "❌ Error de configuración.",
    ticket_created_success: "✅ Tu ticket ha sido creado en {channel}",
    ticket_created_log: "🎫 Ticket Creado",
    log_creator: "Creador",
    log_channel: "Canal",
    log_category: "Categoría",
    log_subject: "Asunto",

    // Ticket Channel Embed & Buttons
    ticket_welcome: "¡Hola {member}! El equipo de soporte asignado te atenderá pronto.",
    btn_close: "Cerrar",
    btn_claim: "Reclamar",
    ticket_footer: "Sistema de Tickets Qvis • Usa los botones para administrar.",

    // Support Actions
    only_staff_claim: "❌ Solo los miembros del equipo de soporte pueden reclamar este ticket.",
    ticket_claimed_title: "🙋‍♂️ Ticket Reclamado",
    ticket_claimed_desc: "El miembro de soporte **{agent}** atenderá esta solicitud en exclusiva de ahora en adelante.",
    ticket_claimed_log: "🙋‍♂️ Ticket Reclamado",
    log_agent: "Agente",

    ticket_closed_title: "🔒 Ticket Cerrado",
    ticket_closed_desc: "Este ticket ha sido cerrado por **{user}**.\nPuedes transcribir los mensajes o eliminar el canal permanentemente usando los botones inferiores.",
    btn_transcript: "Transcripción",
    btn_delete: "Eliminar",
    ticket_closed_log: "🔒 Ticket Cerrado",
    log_closed_by: "Cerrado por",

    deleting_channel: "🧹 Generando encuesta de valoración y eliminando canal en 5 segundos...",
    no_logs_direct_feedback: "Encuesta de feedback enviada por DM.",
    transcribing_ticket: "📁 Generando transcripción HTML del ticket...",
    transcript_sent: "✅ La transcripción HTML ha sido enviada exitosamente.",

    // Command Utils
    only_in_ticket: "❌ Este comando solo puede ser utilizado dentro de un canal de ticket.",
    user_added: "✅ **{user}** ha sido añadido al ticket.",
    user_removed: "🗑️ **{user}** ha sido removido del ticket.",
    cmd_error_add: "❌ No se pudo añadir al usuario al canal. Revisa los permisos del bot.",
    cmd_error_remove: "❌ No se pudo remover al usuario del canal.",

    // Feedback System
    feedback_title: "⭐ Valora nuestro soporte en Qvis",
    feedback_desc: "Tu ticket en **{guild}** ha finalizado.\nPor favor, califica la ayuda recibida usando los botones de abajo.",
    feedback_thanks_title: "🙏 ¡Muchas gracias!",
    feedback_thanks_desc: "Has calificado la atención con {rating}.\nTu opinión nos ayuda a mejorar.",
    log_feedback_title: "⭐ Valoración de Soporte",
    log_rating: "Puntuación",
    log_evaluated_agent: "Agente evaluado",
    none_assigned: "Ninguno asignado",

    // Errors
    system_not_configured: "❌ El sistema de tickets no está configurado en este servidor.",
    error_creating_ticket: "❌ Ocurrió un error al crear el canal de tu ticket."
};
