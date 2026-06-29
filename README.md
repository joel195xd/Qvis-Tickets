# Qvis Tickets 🎫

Un bot de soporte de Discord moderno, interactivo y altamente configurable, diseñado para comunidades, equipos de desarrollo y creadores en GitHub.

## 🚀 Características
- **Panel de Tickets Moderno**: Embeds atractivos e interactivos para que los usuarios abran soporte con un botón.
- **Formularios Modales**: Pregunta al usuario por el asunto y detalles de su problema antes de crear el canal.
- **Canales Dinámicos**: Permisos automáticos para el creador del ticket y el rol de soporte configurado.
- **Control Total**: Botones para Cerrar (🔒), Generar Transcripción de mensajes (📁) y Eliminar el canal (❌).
- **Sistema de Logs**: Registra la creación y cierre de tickets.
- **Base de Datos Local**: Guarda las configuraciones de cada servidor usando JSON local.

## 🛠️ Instalación y Configuración

1. **Clonar e Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno**:
   Crea o edita el archivo `.env` en la raíz del proyecto:
   ```env
   DISCORD_TOKEN=TU_DISCORD_TOKEN
   CLIENT_ID=TU_CLIENT_ID
   ```

3. **Registrar Comandos de Barra Diagonal (Slash Commands)**:
   ```bash
   node deploy-commands.js
   ```

4. **Ejecutar el Bot**:
   ```bash
   node index.js
   ```

## ⚙️ Configuración en Discord
Usa el comando `/setup-tickets` en tu servidor para iniciar el asistente de configuración interactivamente:
- **canal-panel**: Canal donde se enviará el embed del panel.
- **categoria**: Categoría donde se agruparán los canales de soporte.
- **rol-soporte**: Rol que tiene permisos de responder los tickets.
- **canal-logs** *(opcional)*: Canal para registrar logs de creación y cierre.
