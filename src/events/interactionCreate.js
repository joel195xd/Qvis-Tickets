const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { getGuildConfig, setGuildConfig } = require('../utils/ticketDb');
const { translate } = require('../utils/i18n');

// Almacenamiento en memoria para guardar el creador y agente de cada ticket temporalmente para la valoración
const ticketSessionData = new Map();

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
            const config = guild ? getGuildConfig(guild.id) : null;

            // Botón de Abrir Ticket (Muestra el selector de categoría)
            if (customId === 'qvis_ticket_open') {
                if (!config) {
                    return interaction.reply({ content: translate('system_not_configured'), ephemeral: true });
                }

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('qvis_ticket_category_select')
                    .setPlaceholder(translate('select_category_placeholder'))
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(translate('cat_tech_label'))
                            .setValue('tecnico')
                            .setDescription(translate('cat_tech_desc'))
                            .setEmoji('🛠️'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel(translate('cat_reports_label'))
                            .setValue('reportes')
                            .setDescription(translate('cat_reports_desc'))
                            .setEmoji('🚨'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel(translate('cat_purchases_label'))
                            .setValue('compras')
                            .setDescription(translate('cat_purchases_desc'))
                            .setEmoji('💸'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel(translate('cat_apps_label'))
                            .setValue('postulaciones')
                            .setDescription(translate('cat_apps_desc'))
                            .setEmoji('📝')
                    );

                const row = new ActionRowBuilder().addComponents(selectMenu);

                return interaction.reply({
                    content: translate('select_prompt'),
                    components: [row],
                    ephemeral: true
                });
            }

            // Botón de Cerrar Ticket
            if (customId === 'qvis_ticket_close') {
                await interaction.deferReply();

                try {
                    await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
                    
                    const closedEmbed = new EmbedBuilder()
                        .setTitle(translate('ticket_closed_title'))
                        .setDescription(translate('ticket_closed_desc', { user: member.user.tag }))
                        .setColor('#F04747')
                        .setTimestamp();

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('qvis_ticket_transcript')
                            .setLabel(translate('btn_transcript'))
                            .setEmoji('📁')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('qvis_ticket_delete')
                            .setLabel(translate('btn_delete'))
                            .setEmoji('❌')
                            .setStyle(ButtonStyle.Danger)
                    );

                    await interaction.editReply({ embeds: [closedEmbed], components: [row] });

                    // Log del ticket cerrado
                    if (config && config.logsChannelId) {
                        const logChannel = guild.channels.cache.get(config.logsChannelId);
                        if (logChannel) {
                            const logEmbed = new EmbedBuilder()
                                .setTitle(translate('ticket_closed_log'))
                                .addFields(
                                    { name: translate('log_channel'), value: `${channel.name}`, inline: true },
                                    { name: translate('log_closed_by'), value: `${member.user.tag}`, inline: true }
                                )
                                .setColor('#F04747')
                                .setTimestamp();
                            await logChannel.send({ embeds: [logEmbed] });
                        }
                    }
                } catch (err) {
                    console.error(err);
                    await interaction.editReply('❌ Error.');
                }
            }

            // Botón de Reclamar Ticket (Claim)
            if (customId === 'qvis_ticket_claim') {
                try {
                    if (!config) return;
                    if (!member.roles.cache.has(config.supportRoleId)) {
                        return interaction.reply({ content: translate('only_staff_claim'), ephemeral: true });
                    }

                    // Actualizar permisos
                    await channel.permissionOverwrites.edit(config.supportRoleId, { SendMessages: false });
                    await channel.permissionOverwrites.edit(member.id, {
                        ViewChannel: true,
                        SendMessages: true,
                        EmbedLinks: true,
                        AttachFiles: true
                    });

                    const session = ticketSessionData.get(channel.id) || {};
                    session.agentId = member.id;
                    ticketSessionData.set(channel.id, session);

                    const claimEmbed = new EmbedBuilder()
                        .setTitle(translate('ticket_claimed_title'))
                        .setDescription(translate('ticket_claimed_desc', { agent: member.user.tag }))
                        .setColor('#FEE75C')
                        .setTimestamp();

                    await interaction.reply({ embeds: [claimEmbed] });

                    // Log de ticket reclamado
                    if (config.logsChannelId) {
                        const logChannel = guild.channels.cache.get(config.logsChannelId);
                        if (logChannel) {
                            const logEmbed = new EmbedBuilder()
                                .setTitle(translate('ticket_claimed_log'))
                                .addFields(
                                    { name: translate('log_channel'), value: `${channel.name}`, inline: true },
                                    { name: translate('log_agent'), value: `${member.user.tag}`, inline: true }
                                )
                                .setColor('#FEE75C')
                                .setTimestamp();
                            await logChannel.send({ embeds: [logEmbed] });
                        }
                    }
                } catch (err) {
                    console.error(err);
                    await interaction.reply({ content: '❌ Error.', ephemeral: true });
                }
            }

            // Botón de Eliminar Ticket (Con trigger de feedback DM)
            if (customId === 'qvis_ticket_delete') {
                await interaction.reply(translate('deleting_channel'));

                const session = ticketSessionData.get(channel.id);
                if (session && session.creatorId) {
                    try {
                        const user = await client.users.fetch(session.creatorId);
                        
                        const starRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId(`feedback_star_1_${session.agentId || 'none'}`).setLabel('⭐').setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId(`feedback_star_2_${session.agentId || 'none'}`).setLabel('⭐⭐').setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId(`feedback_star_3_${session.agentId || 'none'}`).setLabel('⭐⭐⭐').setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId(`feedback_star_4_${session.agentId || 'none'}`).setLabel('⭐⭐⭐⭐').setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId(`feedback_star_5_${session.agentId || 'none'}`).setLabel('⭐⭐⭐⭐⭐').setStyle(ButtonStyle.Secondary)
                        );

                        const feedbackEmbed = new EmbedBuilder()
                            .setTitle(translate('feedback_title'))
                            .setDescription(translate('feedback_desc', { guild: guild.name }))
                            .setColor('#5865F2')
                            .setTimestamp();

                        await user.send({ embeds: [feedbackEmbed], components: [starRow] });
                    } catch (err) {
                        console.log('No se pudo enviar mensaje directo de valoración (DMs cerrados).');
                    }
                }

                setTimeout(async () => {
                    try {
                        ticketSessionData.delete(channel.id);
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
                    let transcript = `Transcript for ticket: ${channel.name}\n\n`;
                    
                    const sortedMessages = messages.reverse();
                    sortedMessages.forEach(msg => {
                        transcript += `[${msg.createdAt.toLocaleString()}] ${msg.author.tag}: ${msg.content}\n`;
                    });

                    const buffer = Buffer.from(transcript, 'utf-8');
                    await interaction.editReply({
                        content: 'Transcript file:',
                        files: [{
                            attachment: buffer,
                            name: `transcript-${channel.name}.txt`
                        }]
                    });
                } catch (err) {
                    console.error(err);
                    await interaction.editReply('❌ Error.');
                }
            }

            // Feedback de Estrellas (captura los clics de botón en DMs)
            if (customId.startsWith('feedback_star_')) {
                const parts = customId.split('_');
                const rating = parts[2];
                const agentId = parts[3];

                const ratingEmoji = '⭐'.repeat(parseInt(rating));

                const finalEmbed = new EmbedBuilder()
                    .setTitle(translate('feedback_thanks_title'))
                    .setDescription(translate('feedback_thanks_desc', { rating: ratingEmoji }))
                    .setColor('#43B581')
                    .setTimestamp();

                // Intentar enviar a logs de servidores configurados
                for (const [, sharedGuild] of client.guilds.cache) {
                    const guildConfig = getGuildConfig(sharedGuild.id);
                    if (guildConfig && guildConfig.logsChannelId) {
                        const logsChan = sharedGuild.channels.cache.get(guildConfig.logsChannelId);
                        if (logsChan) {
                            const logFeedbackEmbed = new EmbedBuilder()
                                .setTitle(translate('log_feedback_title'))
                                .addFields(
                                    { name: translate('log_creator'), value: `${member.user.tag}`, inline: true },
                                    { name: translate('log_rating'), value: `${ratingEmoji} (${rating}/5)`, inline: true },
                                    { name: translate('log_evaluated_agent'), value: agentId !== 'none' ? `<@${agentId}>` : translate('none_assigned'), inline: true }
                                )
                                .setColor('#FEE75C')
                                .setTimestamp();
                            await logsChan.send({ embeds: [logFeedbackEmbed] });
                        }
                    }
                }

                await interaction.update({ embeds: [finalEmbed], components: [] });
            }
        }

        // Manejar selección del Selector de Categoría
        if (interaction.isStringSelectMenu()) {
            const { customId, guild, member } = interaction;

            if (customId === 'qvis_ticket_category_select') {
                const selectedCategory = interaction.values[0];

                const modal = new ModalBuilder()
                    .setCustomId(`qvis_ticket_modal_${selectedCategory}`)
                    .setTitle(translate('modal_title'));

                const subjectInput = new TextInputBuilder()
                    .setCustomId('ticket_subject')
                    .setLabel(translate('modal_subject_label'))
                    .setPlaceholder(translate('modal_subject_placeholder'))
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(100)
                    .setRequired(true);

                const descInput = new TextInputBuilder()
                    .setCustomId('ticket_description')
                    .setLabel(translate('modal_desc_label'))
                    .setPlaceholder(translate('modal_desc_placeholder'))
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(500)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(subjectInput),
                    new ActionRowBuilder().addComponents(descInput)
                );

                await interaction.showModal(modal);
            }
        }

        // Manejar envío de Modales
        if (interaction.isModalSubmit()) {
            const { customId, guild, member } = interaction;
            
            if (customId.startsWith('qvis_ticket_modal_')) {
                await interaction.deferReply({ ephemeral: true });

                const categoryKey = customId.split('_')[3];
                const config = getGuildConfig(guild.id);
                if (!config) return interaction.editReply(translate('modal_config_error'));

                const subject = interaction.fields.getTextInputValue('ticket_subject');
                const description = interaction.fields.getTextInputValue('ticket_description');

                const ticketNum = (config.ticketCounter || 0) + 1;
                setGuildConfig(guild.id, { ticketCounter: ticketNum });

                const ticketChannelName = `${categoryKey}-${String(ticketNum).padStart(4, '0')}`;
                const targetCategoryId = config.categories[categoryKey];

                try {
                    const channel = await guild.channels.create({
                        name: ticketChannelName,
                        type: ChannelType.GuildText,
                        parent: targetCategoryId,
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

                    ticketSessionData.set(channel.id, {
                        creatorId: member.id,
                        agentId: null
                    });

                    const embedTicket = new EmbedBuilder()
                        .setTitle(`🎫 Ticket #${String(ticketNum).padStart(4, '0')} (${categoryKey.toUpperCase()})`)
                        .setDescription(translate('ticket_welcome', { member: `${member}` }))
                        .addFields(
                            { name: translate('log_subject'), value: subject, inline: false },
                            { name: translate('modal_desc_label'), value: description, inline: false }
                        )
                        .setColor('#5865F2')
                        .setFooter({ text: translate('ticket_footer') })
                        .setTimestamp();

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('qvis_ticket_close')
                            .setLabel(translate('btn_close'))
                            .setEmoji('🔒')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('qvis_ticket_claim')
                            .setLabel(translate('btn_claim'))
                            .setEmoji('🙋‍♂️')
                            .setStyle(ButtonStyle.Success)
                    );

                    await channel.send({ content: `<@&${config.supportRoleId}> | ${member}`, embeds: [embedTicket], components: [row] });

                    await interaction.editReply(translate('ticket_created_success', { channel: `${channel}` }));

                    // Log de creación de ticket
                    if (config.logsChannelId) {
                        const logChannel = guild.channels.cache.get(config.logsChannelId);
                        if (logChannel) {
                            const logEmbed = new EmbedBuilder()
                                .setTitle(translate('ticket_created_log'))
                                .addFields(
                                    { name: translate('log_creator'), value: `${member.user.tag} (${member.id})`, inline: true },
                                    { name: translate('log_channel'), value: `${channel}`, inline: true },
                                    { name: translate('log_category'), value: `${categoryKey.toUpperCase()}`, inline: true },
                                    { name: translate('log_subject'), value: subject }
                                )
                                .setColor('#5865F2')
                                .setTimestamp();
                            await logChannel.send({ embeds: [logEmbed] });
                        }
                    }

                } catch (error) {
                    console.error(error);
                    await interaction.editReply(translate('error_creating_ticket'));
                }
            }
        }
    },
};
