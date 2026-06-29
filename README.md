# Qvis Tickets 🎫

A modern, highly configurable, and interactive Discord support ticket bot designed for communities, development teams, and creators on GitHub.

## 🚀 Features
- **Modern Ticket Panel**: Sleek and interactive embeds allowing users to open support requests with a single button click.
- **Form Modals**: Prompts users for a title/subject and detailed description using Discord modals before generating a channel.
- **Multi-Category Dropdown 📂**: Users can choose between categories like **Technical Support 🛠️**, **User Reports 🚨**, **Purchases / Donations 💸**, and **Staff Applications 📝** via interactive select menus.
- **Dynamic Permission Controls**: Channels are created private by default, only visible to the ticket creator and the configured Support Role.
- **Live Ticket Management ⚙️**: Easy command utilities to add (`/ticket add @member`) or remove (`/ticket remove @member`) users dynamically.
- **Interactive Control Buttons**: Built-in buttons inside the ticket channel for:
  - 🔒 **Close**: Closes the ticket and locks channel write permissions.
  - 🙋‍♂️ **Claim**: Staff can claim the ticket exclusively.
  - 📁 **Transcript**: Generates a `.txt` log of the chat history.
  - ❌ **Delete**: Safely removes the channel after a 5-second countdown.
- **Star Feedback Rating System ⭐**: Automatically sends a private message (DM) rating survey (1-5 stars) to the user when a ticket is deleted, logging the feedback results in the server logs.
- **i18n Translation Engine**: Dynamic translation support, configured in English (`en`) by default, with Spanish (`es`) dictionary built-in.

## 🛠️ Installation & Setup

1. **Clone the Repository & Install Dependencies**:
   ```bash
   git clone https://github.com/joel195xd/Qvis-Tickets.git
   cd Qvis-Tickets
   npm install
   ```

2. **Configure Environment Variables**:
   Create or edit the `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=YOUR_DISCORD_TOKEN
   CLIENT_ID=YOUR_CLIENT_ID
   ```

3. **Register Slash Commands**:
   Run the deployment script to register slash commands globally:
   ```bash
   node deploy-commands.js
   ```

4. **Start the Bot**:
   ```bash
   node index.js
   ```

## ⚙️ In-Discord Configuration
Use the `/setup-tickets` command in your server to trigger the setup assistant:
- **canal-panel**: Text channel where the ticket system panel will be displayed.
- **categoria-tecnico**: Category channel for Technical Support.
- **categoria-reportes**: Category channel for User Reports.
- **categoria-compras**: Category channel for Purchase/Donation tickets.
- **categoria-postulaciones**: Category channel for Staff Applications.
- **rol-soporte**: Role allowed to manage and view support tickets.
- **canal-logs**: Channel dedicated to logging creation, closure, and star ratings feedback.

---
## 🌐 Language Localization
Change the global bot language inside `src/utils/i18n.js`:
```javascript
const config = {
    language: 'en' // Change to 'es' for Spanish
};
```
