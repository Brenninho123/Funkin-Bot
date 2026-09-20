const config = require('./config');
const videos = require('./data/videos');
const weeks = require('./data/weeks');
const facts = require('./data/facts');
const tips = require('./data/tips');
const questions = require('./data/quiz');

const categories = Object.keys(videos);
const letters = ['A', 'B', 'C', 'D'];
const arrows = ['⬅️', '⬇️', '⬆️', '➡️'];
const activeQuizzes = new Map();

const pick = list => list[Math.floor(Math.random() * list.length)];

const formatCategory = key => {
  const { title, emoji, items } = videos[key];
  const lines = items.map(item => `• *${item.title}*\n${item.url}`);
  return `${emoji} *${title}*\n\n${lines.join('\n\n')}`;
};

const formatWeek = number => {
  const { opponent, songs } = weeks[number];
  return `📅 *Week ${number}*\nOpponent: ${opponent}\nSongs: ${songs.join(', ')}`;
};

const commands = [
  {
    name: 'menu',
    aliases: ['help', 'start'],
    group: 'general',
    description: 'Show every available command',
    run: () => {
      const p = config.prefix;
      const section = (title, group) => [
        `*${title}*`,
        ...commands.filter(c => c.group === group).map(c => `${p}${c.usage || c.name} - ${c.description}`),
        ''
      ];
      return [
        `🎮 *${config.name}*`,
        'Your Friday Night Funkin hub!',
        '',
        ...section('General', 'general'),
        ...section('Fun and games', 'fun'),
        ...section('Info', 'info'),
        ...section('Videos', 'videos')
      ]
        .join('\n')
        .trim();
    }
  },
  {
    name: 'about',
    aliases: ['info'],
    group: 'general',
    description: 'About the bot',
    run: () =>
      `🎮 *${config.name}*\nA WhatsApp bot with commands and YouTube links about Friday Night Funkin.\nType ${config.prefix}menu to see what I can do.`
  },
  {
    name: 'ping',
    aliases: [],
    group: 'general',
    description: 'Check if the bot is alive',
    run: () => 'Pong! 🏓 Ready to funk!'
  },
  {
    name: 'categories',
    aliases: ['cats'],
    group: 'videos',
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
    group: 'videos',
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
    usage: 'search <term>',
    group: 'videos',
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
    group: 'videos',
    description: 'Get every video category',
    run: () => categories.map(formatCategory).join('\n\n━━━━━━━━━━\n\n')
  },
  {
    name: 'quiz',
    aliases: [],
    group: 'fun',
    description: 'Start a Funkin trivia question',
    run: ({ message }) => {
      const index = Math.floor(Math.random() * questions.length);
      activeQuizzes.set(message.from, index);
      const { question, options } = questions[index];
      const lines = options.map((option, i) => `${letters[i]}) ${option}`);
      return `❓ *Quiz*\n${question}\n\n${lines.join('\n')}\n\nAnswer with ${config.prefix}answer <letter>`;
    }
  },
  {
    name: 'answer',
    aliases: ['ans'],
    usage: 'answer <letter>',
    group: 'fun',
    description: 'Answer the current quiz question',
    run: ({ args, message }) => {
      const index = activeQuizzes.get(message.from);
      if (index === undefined) {
        return `No quiz running. Type ${config.prefix}quiz to start one.`;
      }
      const choice = letters.indexOf((args[0] || '').toUpperCase());
      if (choice === -1) {
        return `Pick one of ${letters.join(', ')}. Example: ${config.prefix}answer B`;
      }
      activeQuizzes.delete(message.from);
      const { options, answer } = questions[index];
      if (choice === answer) {
        return '✅ Correct! You are on beat!';
      }
      return `❌ Miss! The right answer was ${letters[answer]}) ${options[answer]}`;
    }
  },
  {
    name: 'arrows',
    aliases: ['notes'],
    usage: 'arrows [size]',
    group: 'fun',
    description: 'Get a random arrow pattern to memorize',
    run: ({ args }) => {
      const requested = parseInt(args[0], 10);
      const size = Number.isNaN(requested) ? 8 : Math.min(Math.max(requested, 4), 16);
      const pattern = Array.from({ length: size }, () => pick(arrows)).join(' ');
      return `🎹 *Hit these in order!*\n${pattern}`;
    }
  },
  {
    name: 'fact',
    aliases: [],
    group: 'info',
    description: 'Random fun fact about the game',
    run: () => `💡 *Did you know?*\n${pick(facts)}`
  },
  {
    name: 'tip',
    aliases: [],
    group: 'info',
    description: 'Random gameplay tip',
    run: () => `🎯 *Tip*\n${pick(tips)}`
  },
  {
    name: 'controls',
    aliases: [],
    group: 'info',
    description: 'Default controls',
    run: () =>
      '⌨️ *Controls*\nNotes: Arrow keys, WASD or DFJK\nConfirm: Enter\nBack: Esc'
  },
  {
    name: 'week',
    aliases: [],
    usage: 'week [1-7]',
    group: 'info',
    description: 'Opponent and songs of a week',
    run: ({ args }) => {
      if (!args.length) {
        return Object.keys(weeks).map(formatWeek).join('\n\n');
      }
      const number = parseInt(args[0], 10);
      if (!weeks[number]) {
        return `There is no such week. Try ${config.prefix}week 1 to ${config.prefix}week 7.`;
      }
      return formatWeek(number);
    }
  },
  ...categories.map(key => ({
    name: key,
    aliases: [],
    group: 'videos',
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
