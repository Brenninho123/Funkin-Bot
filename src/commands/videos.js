const config = require('../config');
const videos = require('../data/videos');
const { pick } = require('../util');

const categories = Object.keys(videos);

const formatCategory = key => {
  const { title, emoji, items } = videos[key];
  const lines = items.map(item => `• *${item.title}*\n${item.url}`);
  return `${emoji} *${title}*\n\n${lines.join('\n\n')}`;
};

module.exports = [
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
  ...categories.map(key => ({
    name: key,
    aliases: [],
    group: 'videos',
    description: `Videos: ${videos[key].title}`,
    run: () => formatCategory(key)
  }))
];
