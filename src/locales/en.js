module.exports = {
    // Config Embed Panel
    panel_title: "🎫 Qvis Support & Tickets",
    panel_description: "Need help with a project, report, or inquiry?\nOpen an interactive support ticket by pressing the button below and choosing the correct category.\n\n**Available Categories:**\n🛠️ **Technical Support**: Software bugs or build issues.\n🚨 **Reports**: Report toxic behavior or rule-breakers.\n💸 **Purchases / Donations**: Store tier benefits or payment issues.\n📝 **Applications**: Apply to join our staff team.",
    panel_footer: "Qvis Ticket System • Fast & Organized",
    btn_create_ticket: "Create Ticket",
    setup_success: "✅ **Qvis** Multi-category ticket system successfully configured!\n- Panel channel: {channel}\n- Logs channel: {logs}",
    setup_error: "❌ There was an error sending the panel to {channel}.",

    // Category Selector
    select_category_placeholder: "Select a support category",
    cat_tech_label: "Technical Support",
    cat_tech_desc: "Software issues or compile bugs",
    cat_reports_label: "User Reports",
    cat_reports_desc: "Report bad behavior or rule-breakers",
    cat_purchases_label: "Purchases / Donations",
    cat_purchases_desc: "Billing, tiers or donation issues",
    cat_apps_label: "Applications",
    cat_apps_desc: "Apply to join the staff team",
    select_prompt: "Please select the appropriate category for your ticket:",

    // Modal
    modal_title: "Ticket Form - Qvis",
    modal_subject_label: "Ticket Subject",
    modal_subject_placeholder: "e.g. Build compilation error, hosting questions...",
    modal_desc_label: "Details / Description",
    modal_desc_placeholder: "Describe your inquiry or problem in detail so we can help you.",
    modal_config_error: "❌ Configuration error.",
    ticket_created_success: "✅ Your ticket has been created in {channel}",
    ticket_created_log: "🎫 Ticket Created",
    log_creator: "Creator",
    log_channel: "Channel",
    log_category: "Category",
    log_subject: "Subject",

    // Ticket Channel Embed & Buttons
    ticket_welcome: "Hello {member}! The assigned support team will help you shortly.",
    btn_close: "Close",
    btn_claim: "Claim",
    ticket_footer: "Qvis Ticket System • Use buttons below to manage.",

    // Support Actions
    only_staff_claim: "❌ Only support staff members can claim this ticket.",
    ticket_claimed_title: "🙋‍♂️ Ticket Claimed",
    ticket_claimed_desc: "Support agent **{agent}** will now handle this request exclusively.",
    ticket_claimed_log: "🙋‍♂️ Ticket Claimed",
    log_agent: "Agent",

    ticket_closed_title: "🔒 Ticket Closed",
    ticket_closed_desc: "This ticket was closed by **{user}**.\nYou can download a transcript or delete the channel permanently using the buttons below.",
    btn_transcript: "Transcript",
    btn_delete: "Delete",
    ticket_closed_log: "🔒 Ticket Closed",
    log_closed_by: "Closed by",

    deleting_channel: "🧹 Generating feedback survey and deleting channel in 5 seconds...",
    no_logs_direct_feedback: "DM feedback survey sent.",

    // Command Utils
    only_in_ticket: "❌ This command can only be used inside a ticket channel.",
    user_added: "✅ **{user}** has been added to the ticket.",
    user_removed: "🗑️ **{user}** has been removed from the ticket.",
    cmd_error_add: "❌ Could not add user to the channel. Check bot permissions.",
    cmd_error_remove: "❌ Could not remove user from the channel.",

    // Feedback System
    feedback_title: "⭐ Rate our support on Qvis",
    feedback_desc: "Your ticket in **{guild}** has ended.\nPlease rate the assistance you received using the buttons below.",
    feedback_thanks_title: "🙏 Thank you very much!",
    feedback_thanks_desc: "You rated our service with {rating}.\nYour opinion helps us improve.",
    log_feedback_title: "⭐ Support Feedback",
    log_rating: "Rating",
    log_evaluated_agent: "Evaluated Agent",
    none_assigned: "None assigned",

    // Errors
    system_not_configured: "❌ The ticket system is not configured on this server.",
    error_creating_ticket: "❌ An error occurred while creating your ticket channel."
};
