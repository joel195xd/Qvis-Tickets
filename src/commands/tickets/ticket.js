const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Comandos de administración para gestionar tickets en caliente')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Añade un miembro al ticket actual')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('El usuario que deseas añadir')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remueve un miembro del ticket actual')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('El usuario que deseas remover')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('usuario');
        const channel = interaction.channel;

        // Validar si es un canal de ticket válido (por el nombre)
        if (!channel.name.startsWith('ticket-')) {
            return interaction.reply({
                content: '❌ Este comando solo puede ser utilizado dentro de un canal de ticket.',
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
                    content: `✅ **${targetUser.tag}** ha sido añadido al ticket.`
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: '❌ No se pudo añadir al usuario al canal. Revisa los permisos del bot.',
                    ephemeral: true
                });
            }
        } else if (subcommand === 'remove') {
            try {
                // Quitarle los permisos explícitos de ver el canal
                await channel.permissionOverwrites.delete(targetUser.id);
                await interaction.reply({
                    content: `🗑️ **${targetUser.tag}** ha sido removido del ticket.`
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: '❌ No se pudo remover al usuario del canal.',
                    ephemeral: true
                });
            }
        }
    }
};
