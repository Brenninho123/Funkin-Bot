const config = require('../config');
const levels = require('../data/levels');
const songs = require('../data/songs');
const facts = require('../data/facts');
const tips = require('../data/tips');
const { credits, links } = require('../data/modding');
const { pick, normalize, closest } = require('../util');

const levelOrder = ['tutorial', '1', '2', '3', '4', '5', '6', '7', 'weekend1', 'sserafim'];

const levelLabel = key => {
  if (/^\d+$/.test(key)) {
    return `Week ${key}`;
  }
  if (key === 'weekend1') {
    return 'Weekend 1';
  }
  if (key === 'tutorial') {
    return 'Tutorial';
  }
  return 'LE SSERAFIM';
};

const levelTitle = key => {
  const label = levelLabel(key);
  return label === levels[key].name ? label : `${label} - ${levels[key].name}`;
};

const formatLevel = key => {
  const { name, songs: ids } = levels[key];
  const lines = ids.map((id, i) => `${i + 1}. ${songs[id].name} (${songs[id].opponent}) - ${songs[id].bpm} BPM`);
  return `📅 *${levelTitle(key)}*\n${lines.join('\n')}`;
};

const parseLevel = argument => {
  const key = normalize(argument).replace(/^week(?=\d+$)/, '');
  return levels[key] ? key : null;
};

const songEntries = Object.entries(songs);
const songNames = songEntries.map(([, song]) => normalize(song.name));

const findSong = query => {
  const key = normalize(query);
  if (!key) {
    return null;
  }
  const exact = songEntries.find(([id, song]) => normalize(id) === key || normalize(song.name) === key);
  if (exact) {
    return exact;
  }
  if (key.length < 3) {
    return null;
  }
  return (
    songEntries.find(([id, song]) => normalize(song.name).startsWith(key) || normalize(id).startsWith(key)) ||
    songEntries.find(([, song]) => normalize(song.name).includes(key)) ||
    null
  );
};

const formatSong = ([, song]) => {
  const lines = [
    `🎵 *${song.name}*`,
    `Artist: ${song.artist}`,
    `BPM: ${song.bpm}`,
    `Level: ${levelTitle(song.level)}`,
    `Opponent: ${song.opponent}`,
    `Stage: ${song.stage}`,
    `Difficulty ratings: ${Object.entries(song.ratings)
      .map(([difficulty, rating]) => `${difficulty} ${rating}`)
      .join(' | ')}`
  ];
  if (song.variations) {
    lines.push(`Variations: ${song.variations.join(', ')}`);
  }
  return lines.join('\n');
};

const scoreHit = offset => {
  const distance = Math.abs(offset);
  if (distance > 160) {
    return { judgement: 'miss', score: -100 };
  }
  const score =
    distance < 5 ? 500 : Math.floor(500 * (1 - 1 / (1 + Math.exp(-0.08 * (distance - 54.99)))) + 9);
  const judgement = distance <= 45 ? 'sick' : distance <= 90 ? 'good' : distance <= 135 ? 'bad' : 'shit';
  return { judgement, score };
};

module.exports = [
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
    aliases: ['keys'],
    group: 'info',
    description: 'Default keyboard controls',
    run: () =>
      [
        '⌨️ *Default controls*',
        'Notes: Arrow keys or WASD',
        'Confirm: Z, Space or Enter',
        'Back: X, Backspace or Esc',
        'Pause: P, Enter or Esc',
        'Reset: R',
        'Fullscreen: F11',
        'Screenshot: F3',
        '',
        `Debug keys for modders: ${config.prefix}hotkeys`
      ].join('\n')
  },
  {
    name: 'week',
    aliases: ['level'],
    usage: 'week [1-7|tutorial|weekend1|sserafim]',
    group: 'info',
    description: 'Songs and opponents of a week',
    run: ({ args }) => {
      if (!args.length) {
        return levelOrder
          .map(key => `*${levelTitle(key)}*\n${levels[key].songs.map(id => songs[id].name).join(', ')}`)
          .join('\n\n');
      }
      const key = parseLevel(args.join(''));
      if (!key) {
        return `I do not know that week. Try ${config.prefix}week 1 to ${config.prefix}week 7, tutorial, weekend1 or sserafim.`;
      }
      return formatLevel(key);
    }
  },
  {
    name: 'song',
    aliases: ['track'],
    usage: 'song <name>',
    group: 'info',
    description: 'BPM, artist, stage and more for a song',
    run: ({ args }) => {
      if (!args.length) {
        return `Tell me a song. Example: ${config.prefix}song bopeebo`;
      }
      const found = findSong(args.join(' '));
      if (found) {
        return formatSong(found);
      }
      const suggestion = closest(normalize(args.join(' ')), songNames, 3);
      const hint = suggestion ? ` Did you mean *${songEntries[songNames.indexOf(suggestion)][1].name}*?` : '';
      return `I could not find that song.${hint}`;
    }
  },
  {
    name: 'scoring',
    aliases: ['judgement', 'timing'],
    usage: 'scoring [ms]',
    group: 'info',
    description: 'Hit windows, or the score for a hit offset',
    run: ({ args }) => {
      if (args.length) {
        const offset = parseFloat(args[0]);
        if (Number.isNaN(offset)) {
          return `Give me a number of milliseconds. Example: ${config.prefix}scoring 30`;
        }
        const { judgement, score } = scoreHit(offset);
        return `🎯 A hit ${Math.abs(offset)} ms off the beat is *${judgement.toUpperCase()}* and gives *${score}* points.`;
      }
      return [
        '🎯 *Scoring (current system)*',
        'Sick: within 45 ms',
        'Good: within 90 ms',
        'Bad: within 135 ms',
        'Shit: within 160 ms',
        'Miss: more than 160 ms (-100 points)',
        'Hits within 5 ms give the max 500 points. Slower hits score less along a curve.',
        '',
        'Classic (Week 7) system: 166 ms window, Sick 350, Good 200, Bad 100, Shit 50, Miss -10.',
        '',
        `Try ${config.prefix}scoring 30 to score a hit.`
      ].join('\n');
    }
  },
  {
    name: 'credits',
    aliases: ['team'],
    group: 'info',
    description: 'Who made the game',
    run: () =>
      [
        '👥 *Friday Night Funkin credits*',
        ...credits.map(section => `\n*${section.title}*\n${section.people.map(person => `• ${person}`).join('\n')}`)
      ].join('\n')
  },
  {
    name: 'download',
    aliases: ['play', 'links'],
    group: 'info',
    description: 'Official ways to play the game',
    run: () =>
      [
        '⬇️ *Play Friday Night Funkin*',
        `Web demo (Newgrounds): ${links.web}`,
        `Windows, Mac and Linux demo (itch.io): ${links.itch}`,
        `Android (Google Play): ${links.android}`,
        `iOS (App Store): ${links.ios}`,
        '',
        `Source code: ${links.repo}`
      ].join('\n')
  }
];
