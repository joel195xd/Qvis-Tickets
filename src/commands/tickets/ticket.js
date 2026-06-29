const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { translate } = require('../../utils/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Admin commands to manage tickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Adds a member to the current ticket')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('The user you want to add')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Removes a member from the current ticket')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('The user you want to remove')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('usuario');
        const channel = interaction.channel;

        // Validar si es un canal de ticket
        if (!channel.name.includes('-')) {
            return interaction.reply({
                content: translate('only_in_ticket'),
                ephemeral: true
            });
        }

        if (subcommand === 'add') {
            try {
                await channel.permissionOverwrites.edit(targetUser.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    EmbedLinks: true,
                    AttachFiles: true
                });
                await interaction.reply({
                    content: translate('user_added', { user: targetUser.tag })
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: translate('cmd_error_add'),
                    ephemeral: true
                });
            }
        } else if (subcommand === 'remove') {
            try {
                await channel.permissionOverwrites.delete(targetUser.id);
                await interaction.reply({
                    content: translate('user_removed', { user: targetUser.tag })
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: translate('cmd_error_remove'),
                    ephemeral: true
                });
            }
        }
    }
};
