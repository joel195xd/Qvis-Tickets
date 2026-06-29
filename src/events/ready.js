const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`🤖 ¡Qvis Tickets listo! Sesión iniciada como ${client.user.tag}`);
    },
};
