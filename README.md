# Funkin Bot

WhatsApp bot with commands, modding guides and YouTube links about Friday Night Funkin.

## Setup

```bash
npm install
npm start
```

Scan the QR code shown in the terminal with WhatsApp (Linked Devices). The session is saved in `.wwebjs_auth`, so you only scan once.

## Testing on your own account

The bot answers commands you send to yourself in the "You" chat (message yourself), so you can test it alone. Commands you type in other people's chats are ignored. In groups the bot stays silent on unknown commands.

## Commands

| Command | Description |
| --- | --- |
| `!funkinmenu` | Show every command (also `!help`) |
| `!about` | About the bot |
| `!ping` | Check if the bot is alive |
| `!quiz` / `!answer <letter>` | Trivia questions |
| `!arrows [size]` | Random arrow pattern to memorize |
| `!fact` | Random fun fact |
| `!tip` | Random gameplay tip |
| `!controls` | Default keyboard controls |
| `!week [1-7\|tutorial\|weekend1\|sserafim]` | Songs and opponents of a week |
| `!song <name>` | BPM, artist, stage, ratings and variations of a song |
| `!scoring [ms]` | Hit windows, or the score for a hit offset |
| `!credits` | Who made the game |
| `!download` | Official ways to play the game |
| `!modding` | Modding hub |
| `!tutorial [topic]` | Step-by-step guides: firstmod, song, level, hotreload, order, append, merge, hscript, compile |
| `!docs [topic]` | Links to the official modding docs |
| `!installmod [platform]` | How to install a mod |
| `!hotkeys [section]` | Debug hotkeys |
| `!ids <characters\|stages\|songs>` | Official ids for metadata and charts |
| `!version` | Latest game version, read live from the official changelog |
| `!categories`, `!random`, `!search <term>`, `!all` | YouTube video links |
| `!songs` `!mods` `!tutorials` `!characters` `!animations` `!ost` `!speedruns` | Video links by category |

## Where the data comes from

Song, week, character and stage data, the scoring windows, the debug hotkeys, the default controls and the mod install steps were taken from the official repositories: [FunkinCrew/Funkin](https://github.com/FunkinCrew/Funkin), [FunkinCrew/funkin.assets](https://github.com/FunkinCrew/funkin.assets) and the [modding docs](https://funkincrew.github.io/funkin-modding-docs/).

## Editing content

Everything lives in `src/data`:

- `videos.js`: add `{ title, url }` items to a category. A new category becomes a command automatically.
- `quiz.js`, `facts.js`, `tips.js`: questions, facts and tips.
- `levels.js`, `songs.js`, `ids.js`: weeks, songs and official ids.
- `modding.js`: tutorials, docs links, install steps, hotkeys and credits.

Commands live in `src/commands`, one file per group.
