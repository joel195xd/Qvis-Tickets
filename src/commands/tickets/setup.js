const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { setGuildConfig } = require('../../utils/ticketDb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Configura el sistema de tickets de Qvis')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('canal-panel')
                .setDescription('Canal donde se enviará el panel de tickets')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option.setName('categoria-tecnico')
                .setDescription('Categoría para Soporte Técnico')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('categoria-reportes')
                .setDescription('Categoría para Reportes de Usuarios')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('categoria-compras')
                .setDescription('Categoría para Consultas de Compras/Donaciones')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('categoria-postulaciones')
                .setDescription('Categoría para Aplicaciones/Postulaciones')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
            option.setName('rol-soporte')
                .setDescription('Rol general para Soporte')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('canal-logs')
                .setDescription('Canal de logs')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction) {
        const canalPanel = interaction.options.getChannel('canal-panel');
        const catTecnico = interaction.options.getChannel('categoria-tecnico');
        const catReportes = interaction.options.getChannel('categoria-reportes');
        const catCompras = interaction.options.getChannel('categoria-compras');
        const catPostulaciones = interaction.options.getChannel('categoria-postulaciones');
        const rolSoporte = interaction.options.getRole('rol-soporte');
        const canalLogs = interaction.options.getChannel('canal-logs');

        // Guardar configuración multi-categoría en la base de datos
        setGuildConfig(interaction.guildId, {
            panelChannelId: canalPanel.id,
            categories: {
                tecnico: catTecnico.id,
                reportes: catReportes.id,
                compras: catCompras.id,
                postulaciones: catPostulaciones.id
            },
            supportRoleId: rolSoporte.id,
            logsChannelId: canalLogs.id,
            ticketCounter: 0
        });

        // Embed del Panel de Tickets
        const embed = new EmbedBuilder()
            .setTitle('🎫 Qvis Support & Tickets')
            .setDescription(
                '¿Necesitas ayuda con algún proyecto, reporte o consulta?\n' +
                'Abre un ticket de soporte interactivo presionando el botón de abajo y seleccionando la categoría correspondiente.\n\n' +
                '**Categorías disponibles:**\n' +
                '🛠️ **Soporte Técnico**: Dudas o problemas con el software.\n' +
                '🚨 **Reportes**: Reportes de usuarios o comportamientos inadecuados.\n' +
                '💸 **Compras / Donaciones**: Consultas de pagos, compras o soporte de tiers.\n' +
                '📝 **Postulaciones**: Aplica para formar parte de nuestro equipo.'
            )
            .setColor('#2F3136')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || null)
            .setFooter({ text: 'Qvis Ticket System • Rápido y Organizado', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        // Botón interactivo moderno
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('qvis_ticket_open')
                .setLabel('Crear Ticket')
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Secondary)
        );

        try {
            await canalPanel.send({ embeds: [embed], components: [row] });
            
            await interaction.reply({
                content: `✅ ¡Sistema de tickets multi-categoría de **Qvis** configurado exitosamente!\n- Panel enviado a: ${canalPanel}\n- Canal de logs: ${canalLogs}`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `❌ Hubo un error al enviar el panel al canal ${canalPanel}.`,
                ephemeral: true
            });
        }
    }
};
