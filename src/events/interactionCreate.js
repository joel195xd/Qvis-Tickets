const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const { getGuildConfig, setGuildConfig } = require('../utils/ticketDb');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        // Manejar comandos slash
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No se encontró el comando ${interaction.commandName}.`);
                return;
            }
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
                } else {
                    await interaction.reply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
                }
            }
            return;
        }

        // Manejar clics en Botones
        if (interaction.isButton()) {
            const { customId, guild, member, channel } = interaction;
            const config = getGuildConfig(guild.id);

            // Botón de Abrir Ticket
            if (customId === 'qvis_ticket_open') {
                if (!config) {
                    return interaction.reply({ content: '❌ El sistema de tickets no está configurado en este servidor.', ephemeral: true });
                }

                // Mostrar Modal de Asunto
                const modal = new ModalBuilder()
                    .setCustomId('qvis_ticket_modal')
                    .setTitle('Formulario de Ticket - Qvis');

                const subjectInput = new TextInputBuilder()
                    .setCustomId('ticket_subject')
                    .setLabel('Asunto del Ticket')
                    .setPlaceholder('Ej: Error de compilación, Dudas de hosting...')
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(100)
                    .setRequired(true);

                const descInput = new TextInputBuilder()
                    .setCustomId('ticket_description')
                    .setLabel('Detalles / Descripción')
                    .setPlaceholder('Describe detalladamente tu consulta o problema para ayudarte mejor.')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(500)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(subjectInput),
                    new ActionRowBuilder().addComponents(descInput)
                );

                return interaction.showModal(modal);
            }

            // Botón de Cerrar Ticket
            if (customId === 'qvis_ticket_close') {
                await interaction.deferReply();

                // Cambiar permisos para que el usuario ya no pueda escribir, pero vea el ticket cerrado
                try {
                    await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
                    
                    const closedEmbed = new EmbedBuilder()
                        .setTitle('🔒 Ticket Cerrado')
                        .setDescription(`Este ticket ha sido cerrado por **${member.user.tag}**.\nPuedes transcribir los mensajes o eliminar el canal permanentemente usando los botones inferiores.`)
                        .setColor('#F04747')
                        .setTimestamp();

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('qvis_ticket_transcript')
                            .setLabel('Transcripción')
                            .setEmoji('📁')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('qvis_ticket_delete')
                            .setLabel('Eliminar')
                            .setEmoji('❌')
                            .setStyle(ButtonStyle.Danger)
                    );

                    await interaction.editReply({ embeds: [closedEmbed], components: [row] });

                    // Opcional: Logs del ticket
                    if (config.logsChannelId) {
                        const logChannel = guild.channels.cache.get(config.logsChannelId);
                        if (logChannel) {
                            const logEmbed = new EmbedBuilder()
                                .setTitle('🔒 Ticket Cerrado')
                                .addFields(
                                    { name: 'Canal', value: `${channel.name}`, inline: true },
                                    { name: 'Cerrado por', value: `${member.user.tag}`, inline: true }
                                )
                                .setColor('#F04747')
                                .setTimestamp();
                            await logChannel.send({ embeds: [logEmbed] });
                        }
                    }
                } catch (err) {
                    console.error(err);
                    await interaction.editReply('❌ Ocurrió un error al cerrar el ticket.');
                }
            }

            // Botón de Eliminar Ticket
            if (customId === 'qvis_ticket_delete') {
                await interaction.reply('🧹 Eliminando el ticket en 5 segundos...');
                setTimeout(async () => {
                    try {
                        await channel.delete();
                    } catch (err) {
                        console.error('Error al borrar canal:', err);
                    }
                }, 5000);
            }

            // Botón de Transcripción
            if (customId === 'qvis_ticket_transcript') {
                await interaction.deferReply({ ephemeral: true });
                try {
                    const messages = await channel.messages.fetch({ limit: 100 });
                    let transcript = `Transcripción del Ticket: ${channel.name}\n\n`;
                    
                    const sortedMessages = messages.reverse();
                    sortedMessages.forEach(msg => {
                        transcript += `[${msg.createdAt.toLocaleString()}] ${msg.author.tag}: ${msg.content}\n`;
                    });

                    const buffer = Buffer.from(transcript, 'utf-8');
                    await interaction.editReply({
                        content: 'Aquí tienes la transcripción de los últimos 100 mensajes del ticket:',
                        files: [{
                            attachment: buffer,
                            name: `transcript-${channel.name}.txt`
                        }]
                    });
                } catch (err) {
                    console.error(err);
                    await interaction.editReply('❌ Error al generar la transcripción.');
                }
            }
        }

        // Manejar envío de Modales
        if (interaction.isModalSubmit()) {
            const { customId, guild, member } = interaction;
            
            if (customId === 'qvis_ticket_modal') {
                await interaction.deferReply({ ephemeral: true });

                const config = getGuildConfig(guild.id);
                if (!config) return interaction.editReply('❌ Error de configuración.');

                const subject = interaction.fields.getTextInputValue('ticket_subject');
                const description = interaction.fields.getTextInputValue('ticket_description');

                // Incrementar contador
                const ticketNum = (config.ticketCounter || 0) + 1;
                setGuildConfig(guild.id, { ticketCounter: ticketNum });

                const ticketChannelName = `ticket-${String(ticketNum).padStart(4, '0')}`;

                try {
                    // Crear canal de texto
                    const channel = await guild.channels.create({
                        name: ticketChannelName,
                        type: ChannelType.GuildText,
                        parent: config.categoryId,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone.id,
                                deny: [PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: member.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
                            },
                            {
                                id: config.supportRoleId,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
                            }
                        ]
                    });

                    // Mensaje interno del ticket
                    const embedTicket = new EmbedBuilder()
                        .setTitle(`🎫 Ticket #${String(ticketNum).padStart(4, '0')}`)
                        .setDescription(`¡Hola ${member}! El equipo de soporte de **Qvis** te atenderá pronto.`)
                        .addFields(
                            { name: 'Asunto', value: subject, inline: false },
                            { name: 'Descripción', value: description, inline: false }
                        )
                        .setColor('#5865F2')
                        .setFooter({ text: 'Usa los botones inferiores para gestionar el ticket.' })
                        .setTimestamp();

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('qvis_ticket_close')
                            .setLabel('Cerrar Ticket')
                            .setEmoji('🔒')
                            .setStyle(ButtonStyle.Secondary)
                    );

                    await channel.send({ content: `<@&${config.supportRoleId}> | ${member}`, embeds: [embedTicket], components: [row] });

                    await interaction.editReply(`✅ Tu ticket ha sido creado en ${channel}`);

                    // Log de creación de ticket
                    if (config.logsChannelId) {
                        const logChannel = guild.channels.cache.get(config.logsChannelId);
                        if (logChannel) {
                            const logEmbed = new EmbedBuilder()
                                .setTitle('🎫 Ticket Creado')
                                .addFields(
                                    { name: 'Creador', value: `${member.user.tag} (${member.id})`, inline: true },
                                    { name: 'Canal', value: `${channel}`, inline: true },
                                    { name: 'Asunto', value: subject }
                                )
                                .setColor('#5865F2')
                                .setTimestamp();
                            await logChannel.send({ embeds: [logEmbed] });
                        }
                    }

                } catch (error) {
                    console.error(error);
                    await interaction.editReply('❌ Ocurrió un error al crear el canal de tu ticket. Verifica que el bot tenga los permisos de "Gestionar Canales".');
                }
            }
        }
    },
};
