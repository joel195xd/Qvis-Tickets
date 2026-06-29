const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { setGuildConfig } = require('../../utils/ticketDb');
const { translate } = require('../../utils/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Configure the Qvis ticket system')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('canal-panel')
                .setDescription('Channel where the ticket panel will be sent')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option.setName('categoria-tecnico')
                .setDescription('Category for Technical Support')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('categoria-reportes')
                .setDescription('Category for User Reports')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('categoria-compras')
                .setDescription('Category for Purchases / Donations')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('categoria-postulaciones')
                .setDescription('Category for Staff Applications')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
            option.setName('rol-soporte')
                .setDescription('General support role')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('canal-logs')
                .setDescription('Channel for logs')
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

        // Guardar configuración
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

        // Embed del Panel traducido
        const embed = new EmbedBuilder()
            .setTitle(translate('panel_title'))
            .setDescription(translate('panel_description'))
            .setColor('#2F3136')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || null)
            .setFooter({ text: translate('panel_footer'), iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        // Botón traducido
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('qvis_ticket_open')
                .setLabel(translate('btn_create_ticket'))
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Secondary)
        );

        try {
            await canalPanel.send({ embeds: [embed], components: [row] });
            
            await interaction.reply({
                content: translate('setup_success', { channel: `<#${canalPanel.id}>`, logs: `<#${canalLogs.id}>` }),
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: translate('setup_error', { channel: `<#${canalPanel.id}>` }),
                ephemeral: true
            });
        }
    }
};
