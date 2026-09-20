# Funkin Bot

WhatsApp bot with commands and YouTube links about Friday Night Funkin.

## Setup

```bash
npm install
npm start
```

Scan the QR code shown in the terminal with WhatsApp (Linked Devices). The session is saved in `.wwebjs_auth`, so you only scan once.

## Commands

| Command | Description |
| --- | --- |
| `!menu` | Show every command |
| `!about` | About the bot |
| `!ping` | Check if the bot is alive |
| `!categories` | List video categories |
| `!random` | Random video link |
| `!search <term>` | Search Funkin videos on YouTube |
| `!all` | Every video category |
| `!songs` `!mods` `!tutorials` `!characters` `!animations` `!ost` `!speedruns` | Video links by category |

## Adding videos

Edit `src/data/videos.js` and add `{ title, url }` items to any category. A new category becomes a command automatically.
