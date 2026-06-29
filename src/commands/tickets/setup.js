const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { setGuildConfig } = require('../../utils/ticketDb');
const { translate } = require('../../utils/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Configure the Qvis ticket system')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('panel-channel')
                .setDescription('Channel where the ticket panel will be sent')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option.setName('technical-category')
                .setDescription('Category for Technical Support')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('reports-category')
                .setDescription('Category for User Reports')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('purchases-category')
                .setDescription('Category for Purchases / Donations')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('applications-category')
                .setDescription('Category for Staff Applications')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
            option.setName('support-role')
                .setDescription('General support role')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('logs-channel')
                .setDescription('Channel for logs')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction) {
        const panelChannel = interaction.options.getChannel('panel-channel');
        const catTechnical = interaction.options.getChannel('technical-category');
        const catReports = interaction.options.getChannel('reports-category');
        const catPurchases = interaction.options.getChannel('purchases-category');
        const catApplications = interaction.options.getChannel('applications-category');
        const supportRole = interaction.options.getRole('support-role');
        const logsChannel = interaction.options.getChannel('logs-channel');

        // Save config
        setGuildConfig(interaction.guildId, {
            panelChannelId: panelChannel.id,
            categories: {
                tecnico: catTechnical.id,
                reportes: catReports.id,
                compras: catPurchases.id,
                postulaciones: catApplications.id
            },
            supportRoleId: supportRole.id,
            logsChannelId: logsChannel.id,
            ticketCounter: 0
        });

        // Translate Panel Embed
        const embed = new EmbedBuilder()
            .setTitle(translate('panel_title'))
            .setDescription(translate('panel_description'))
            .setColor('#2F3136')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || null)
            .setFooter({ text: translate('panel_footer'), iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        // Translate Button
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('qvis_ticket_open')
                .setLabel(translate('btn_create_ticket'))
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Secondary)
        );

        try {
            await panelChannel.send({ embeds: [embed], components: [row] });
            
            await interaction.reply({
                content: translate('setup_success', { channel: `<#${panelChannel.id}>`, logs: `<#${logsChannel.id}>` }),
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: translate('setup_error', { channel: `<#${panelChannel.id}>` }),
                ephemeral: true
            });
        }
    }
};
