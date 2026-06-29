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
            option.setName('categoria')
                .setDescription('Categoría donde se crearán los tickets')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
            option.setName('rol-soporte')
                .setDescription('Rol que tendrá acceso a dar soporte en los tickets')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('canal-logs')
                .setDescription('Canal opcional para registrar acciones de los tickets')
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction) {
        const canalPanel = interaction.options.getChannel('canal-panel');
        const categoria = interaction.options.getChannel('categoria');
        const rolSoporte = interaction.options.getRole('rol-soporte');
        const canalLogs = interaction.options.getChannel('canal-logs');

        // Guardar configuración en la "Base de Datos"
        setGuildConfig(interaction.guildId, {
            panelChannelId: canalPanel.id,
            categoryId: categoria.id,
            supportRoleId: rolSoporte.id,
            logsChannelId: canalLogs ? canalLogs.id : null,
            ticketCounter: 0
        });

        // Crear el Embed ultra-moderno del Panel de Tickets
        const embed = new EmbedBuilder()
            .setTitle('🎫 Qvis Support & Tickets')
            .setDescription(
                '¿Necesitas ayuda con algún proyecto, reporte o consulta?\n' +
                'Abre un ticket de soporte interactivo presionando el botón de abajo.\n\n' +
                '**⚠️ Importante:** Por favor, sé lo más descriptivo posible al rellenar el formulario para agilizar el proceso.'
            )
            .setColor('#2F3136')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || null)
            .setFooter({ text: 'Qvis Ticket System • Fácil y rápido', iconURL: interaction.client.user.displayAvatarURL() })
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
                content: `✅ ¡Sistema de tickets de **Qvis** configurado exitosamente!\n- **Panel enviado a:** ${canalPanel}\n- **Categoría de tickets:** ${categoria.name}\n- **Rol de soporte:** ${rolSoporte}`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `❌ Hubo un error al enviar el panel al canal ${canalPanel}. Asegúrate de que tengo permisos de enviar mensajes e incrustar enlaces allí.`,
                ephemeral: true
            });
        }
    }
};
