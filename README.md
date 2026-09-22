# Massnet Landing Page

Arabic responsive landing page for Massnet internet services. The page presents service plans, brand information, and a request form designed to send customer requests through Telegram.

## Live Preview

https://aser-405.github.io/massnet-landingpage/

## Project Structure

- `index.html` - Main page content and layout.
- `assets/styles.css` - Custom responsive styling.
- `assets/tailwind.css` - Local Tailwind utility CSS used by the page.
- `assets/app.js` - Form validation and Telegram request logic.
- `assets/loader.js` - Loading screen behavior.
- `assets/massnet.jpg` - Massnet logo/image asset.
- `firebase.json` - Firebase Hosting configuration.
- `site-config.example.js` - Safe example configuration file.

## Local Setup

Copy the example config file and add your real Telegram values locally:

```bash
cp site-config.example.js site-config.js
```

Then edit `site-config.js`:

```js
window.MASSNET_CONFIG = {
  telegramBotToken: "YOUR_TELEGRAM_BOT_TOKEN",
  telegramChatId: "YOUR_TELEGRAM_CHAT_ID"
};
```

Open `index.html` in a browser to preview the page locally.

## Security Notes

`site-config.js` is intentionally ignored by Git because it contains sensitive Telegram bot credentials. Do not commit real API tokens, bot tokens, chat IDs, or `.env` files to the repository.

For production, using a server-side endpoint or cloud function is safer than exposing a Telegram bot token in browser JavaScript.

## Deployment

This repository is ready for GitHub Pages from:

- Branch: `main`
- Folder: `/ (root)`

The included `.nojekyll` file helps GitHub Pages serve the static files directly.
