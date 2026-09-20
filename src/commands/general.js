const config = require('../config');

const sections = [
  ['General', 'general'],
  ['Fun and games', 'fun'],
  ['Info', 'info'],
  ['Modding', 'modding'],
  ['Videos', 'videos']
];

module.exports = [
  {
    name: 'funkinmenu',
    aliases: ['help', 'start'],
    group: 'general',
    description: 'Show every available command',
    run: ({ commands }) => {
      const p = config.prefix;
      const lines = [`🎮 *${config.name}*`, 'Your Friday Night Funkin hub!', ''];
      sections.forEach(([title, group]) => {
        lines.push(`*${title}*`);
        commands
          .filter(command => command.group === group)
          .forEach(command => lines.push(`${p}${command.usage || command.name} - ${command.description}`));
        lines.push('');
      });
      return lines.join('\n').trim();
    }
  },
  {
    name: 'about',
    aliases: ['info'],
    group: 'general',
    description: 'About the bot',
    run: () =>
      `🎮 *${config.name}*\nA WhatsApp bot with commands, modding guides and YouTube links about Friday Night Funkin.\nType ${config.prefix}funkinmenu to see what I can do.`
  },
  {
    name: 'ping',
    aliases: [],
    group: 'general',
    description: 'Check if the bot is alive',
    run: () => 'Pong! 🏓 Ready to funk!'
  }
];
