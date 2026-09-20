const config = require('./config');
const videos = require('./data/videos');

const categories = Object.keys(videos);

const formatCategory = key => {
  const { title, emoji, items } = videos[key];
  const lines = items.map(item => `• *${item.title}*\n${item.url}`);
  return `${emoji} *${title}*\n\n${lines.join('\n\n')}`;
};

const pick = list => list[Math.floor(Math.random() * list.length)];

const commands = [
  {
    name: 'menu',
    aliases: ['help', 'start'],
    description: 'Show every available command',
    run: () => {
      const p = config.prefix;
      const lines = [
        `🎮 *${config.name}*`,
        'Your Friday Night Funkin hub!',
        '',
        `${p}menu - Show this menu`,
        `${p}about - About the bot`,
        `${p}ping - Check if the bot is alive`,
        `${p}categories - List video categories`,
        `${p}random - Get a random video link`,
        `${p}search <term> - Search Funkin videos on YouTube`,
        `${p}all - Get every video category`,
        ''
      ];
      categories.forEach(key => lines.push(`${p}${key} - ${videos[key].title}`));
      return lines.join('\n');
    }
  },
  {
    name: 'about',
    aliases: ['info'],
    description: 'About the bot',
    run: () =>
      `🎮 *${config.name}*\nA WhatsApp bot with commands and YouTube links about Friday Night Funkin.\nType ${config.prefix}menu to see what I can do.`
  },
  {
    name: 'ping',
    aliases: [],
    description: 'Check if the bot is alive',
    run: () => 'Pong! 🏓 Ready to funk!'
  },
  {
    name: 'categories',
    aliases: ['cats'],
    description: 'List video categories',
    run: () =>
      [
        '📂 *Video categories*',
        '',
        ...categories.map(key => `${videos[key].emoji} ${config.prefix}${key} - ${videos[key].title}`)
      ].join('\n')
  },
  {
    name: 'random',
    aliases: ['rand'],
    description: 'Get a random video link',
    run: () => {
      const key = pick(categories);
      const item = pick(videos[key].items);
      return `🎲 *Random pick* (${videos[key].title})\n\n*${item.title}*\n${item.url}`;
    }
  },
  {
    name: 'search',
    aliases: ['find'],
    description: 'Search Funkin videos on YouTube',
    run: ({ args }) => {
      if (!args.length) {
        return `Tell me what to look for. Example: ${config.prefix}search vs whitty`;
      }
      const term = args.join(' ');
      const query = encodeURIComponent(`Friday Night Funkin ${term}`);
      return `🔎 *Results for "${term}"*\nhttps://www.youtube.com/results?search_query=${query}`;
    }
  },
  {
    name: 'all',
    aliases: ['everything'],
    description: 'Get every video category',
    run: () => categories.map(formatCategory).join('\n\n━━━━━━━━━━\n\n')
  },
  ...categories.map(key => ({
    name: key,
    aliases: [],
    description: videos[key].title,
    run: () => formatCategory(key)
  }))
];

const lookup = new Map();
commands.forEach(command => {
  lookup.set(command.name, command);
  command.aliases.forEach(alias => lookup.set(alias, command));
});

module.exports = { commands, lookup };
