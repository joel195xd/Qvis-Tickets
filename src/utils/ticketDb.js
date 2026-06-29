const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'ticketConfig.json');

function readConfig() {
    try {
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, JSON.stringify({}));
        }
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer ticketConfig.json:', error);
        return {};
    }
}

function writeConfig(data) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error('Error al escribir en ticketConfig.json:', error);
    }
}

function getGuildConfig(guildId) {
    const config = readConfig();
    return config[guildId] || null;
}

function setGuildConfig(guildId, guildData) {
    const config = readConfig();
    config[guildId] = {
        ...config[guildId],
        ...guildData
    };
    writeConfig(config);
}

module.exports = {
    getGuildConfig,
    setGuildConfig
};
