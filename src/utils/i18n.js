const en = require('./en');
const es = require('./es');

const languages = { en, es };

// Configuración global del bot (Idioma por defecto es 'en' - inglés)
const config = {
    language: 'en' 
};

function translate(key, replacements = {}) {
    const lang = config.language;
    const langData = languages[lang] || languages['en'];
    let text = langData[key] || languages['en'][key] || key;

    for (const [placeholder, value] of Object.entries(replacements)) {
        text = text.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }
    
    return text;
}

module.exports = {
    translate,
    config
};
