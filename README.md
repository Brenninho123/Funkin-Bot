# Funkin Bot

WhatsApp bot with commands and YouTube links about Friday Night Funkin.

## Setup

```bash
npm install
npm start
```

Scan the QR code shown in the terminal with WhatsApp (Linked Devices). The session is saved in `.wwebjs_auth`, so you only scan once.

## Testing on your own account

The bot answers commands you send to yourself in the "You" chat (message yourself), so you can test it alone. Commands you type in other people's chats are ignored.

## Commands

| Command | Description |
| --- | --- |
| `!menu` | Show every command |
| `!about` | About the bot |
| `!ping` | Check if the bot is alive |
| `!quiz` | Start a trivia question |
| `!answer <letter>` | Answer the current quiz question |
| `!arrows [size]` | Random arrow pattern to memorize |
| `!fact` | Random fun fact |
| `!tip` | Random gameplay tip |
| `!controls` | Default controls |
| `!week [1-7]` | Opponent and songs of a week |
| `!categories` | List video categories |
| `!random` | Random video link |
| `!search <term>` | Search Funkin videos on YouTube |
| `!all` | Every video category |
| `!songs` `!mods` `!tutorials` `!characters` `!animations` `!ost` `!speedruns` | Video links by category |

## Editing content

Everything lives in `src/data`:

- `videos.js`: add `{ title, url }` items to a category. A new category becomes a command automatically.
- `quiz.js`, `facts.js`, `tips.js`, `weeks.js`: questions, facts, tips and week info.
