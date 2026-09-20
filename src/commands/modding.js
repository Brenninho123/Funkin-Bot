const config = require('../config');
const ids = require('../data/ids');
const songs = require('../data/songs');
const { docsBase, docs, tutorials, install, hotkeys, links } = require('../data/modding');
const { normalize, closest, code } = require('../util');

const p = config.prefix;

const findEntry = (table, argument) => {
  const key = normalize(argument);
  if (!key) {
    return null;
  }
  const direct = Object.keys(table).find(name => normalize(name) === key);
  if (direct) {
    return direct;
  }
  const byAlias = Object.keys(table).find(name => (table[name].aliases || []).some(alias => normalize(alias) === key));
  if (byAlias) {
    return byAlias;
  }
  const near = closest(key, Object.keys(table).map(normalize), 1);
  return near ? Object.keys(table).find(name => normalize(name) === near) : null;
};

const formatTutorial = key => {
  const tutorial = tutorials[key];
  const lines = [`📘 *${tutorial.title}*`, '', ...tutorial.steps.map((step, i) => `${i + 1}. ${step}`)];
  if (tutorial.code) {
    lines.push('', code(tutorial.code));
  }
  const link = tutorial.link || (tutorial.doc && docsBase + docs[tutorial.doc].path);
  if (link) {
    lines.push('', `📖 ${link}`);
  }
  return lines.join('\n');
};

let versionCache = null;

const fetchVersion = async () => {
  if (versionCache && Date.now() - versionCache.at < 10 * 60 * 1000) {
    return versionCache.value;
  }
  const response = await fetch(links.changelog, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) {
    throw new Error('request failed');
  }
  const text = await response.text();
  const match = text.match(/^## \[(\d+\.\d+\.\d+[^\]]*)\] - (\d{4}-\d{2}-\d{2})/m);
  if (!match) {
    throw new Error('no version found');
  }
  versionCache = { at: Date.now(), value: { version: match[1], date: match[2] } };
  return versionCache.value;
};

module.exports = [
  {
    name: 'modding',
    aliases: ['mod', 'mods101'],
    group: 'modding',
    description: 'Start here to learn modding',
    run: () =>
      [
        '🧩 *Funkin modding hub*',
        'Mods are folders with a _polymod_meta.json file, loaded by the Polymod system. You can replace assets, add songs, levels, characters and stages, and script behavior with HScript.',
        '',
        `${p}tutorial - step-by-step guides`,
        `${p}docs - links to the official modding docs`,
        `${p}installmod - how to install a mod`,
        `${p}hotkeys - debug hotkeys`,
        `${p}ids - official character, stage and song ids`,
        `${p}version - latest game version`,
        '',
        `📖 ${docsBase}`,
        `💻 ${links.repo}`
      ].join('\n')
  },
  {
    name: 'tutorial',
    aliases: ['guide', 'howto'],
    usage: 'tutorial [topic]',
    group: 'modding',
    description: 'Step-by-step modding guides',
    run: ({ args }) => {
      if (!args.length) {
        return [
          '📘 *Modding tutorials*',
          '',
          ...Object.keys(tutorials).map(key => `${p}tutorial ${key} - ${tutorials[key].title}`),
          '',
          `Video tutorials: ${p}tutorials`
        ].join('\n');
      }
      const key = findEntry(tutorials, args.join(''));
      if (!key) {
        return `I do not have that tutorial. Type ${p}tutorial to see the list.`;
      }
      return formatTutorial(key);
    }
  },
  {
    name: 'docs',
    aliases: ['documentation'],
    usage: 'docs [topic]',
    group: 'modding',
    description: 'Links to the official modding docs',
    run: ({ args }) => {
      if (!args.length) {
        return [
          '📖 *Official modding docs*',
          docsBase,
          '',
          `Topics: ${Object.keys(docs).join(', ')}`,
          '',
          `Example: ${p}docs song`
        ].join('\n');
      }
      const key = findEntry(docs, args.join(''));
      if (!key) {
        return `I do not know that topic. Type ${p}docs to see them all.`;
      }
      return `📖 *${docs[key].title}*\n${docsBase}${docs[key].path}`;
    }
  },
  {
    name: 'installmod',
    aliases: ['install'],
    usage: 'installmod [platform]',
    group: 'modding',
    description: 'How to install a mod',
    run: ({ args }) => {
      if (!args.length) {
        return [
          '📦 *Install a mod*',
          `Pick your platform: ${Object.keys(install).join(', ')}`,
          `Example: ${p}installmod windows`
        ].join('\n');
      }
      const key = findEntry(install, args.join(''));
      if (!key) {
        return `I do not know that platform. Try: ${Object.keys(install).join(', ')}`;
      }
      const { title, steps } = install[key];
      return [`📦 *Install a mod on ${title}*`, '', ...steps.map((step, i) => `${i + 1}. ${step}`)].join('\n');
    }
  },
  {
    name: 'hotkeys',
    aliases: ['debug'],
    usage: 'hotkeys [any|play|freeplay|menu]',
    group: 'modding',
    description: 'Debug hotkeys for modders',
    run: ({ args }) => {
      const keys = args.length ? [findEntry(hotkeys, args.join(''))] : Object.keys(hotkeys);
      if (keys.includes(null)) {
        return `I do not know that section. Try: ${Object.keys(hotkeys).join(', ')}`;
      }
      const blocks = keys.map(key => `*${hotkeys[key].title}*\n${hotkeys[key].lines.map(line => `• ${line}`).join('\n')}`);
      return ['⌨️ *Debug hotkeys*', 'Most of these only work on debug builds.', '', blocks.join('\n\n')].join('\n');
    }
  },
  {
    name: 'ids',
    aliases: ['assets'],
    usage: 'ids <characters|stages|songs>',
    group: 'modding',
    description: 'Official ids to use in metadata and charts',
    run: ({ args }) => {
      const lists = {
        characters: ids.characters,
        stages: ids.stages,
        songs: Object.keys(songs)
      };
      const key = args.length ? findEntry(lists, args.join('')) : null;
      if (!key) {
        return `Which ids? Try ${p}ids characters, ${p}ids stages or ${p}ids songs.`;
      }
      return `🆔 *Official ${key.replace(/s$/, '')} ids* (${lists[key].length})\n${lists[key].join(', ')}`;
    }
  },
  {
    name: 'version',
    aliases: ['latest', 'update'],
    group: 'modding',
    description: 'Latest game version from the official changelog',
    run: async () => {
      try {
        const { version, date } = await fetchVersion();
        return `🆕 *Latest version: ${version}* (${date})\n${links.changelogPage}`;
      } catch {
        return `I could not reach GitHub right now. You can read the changelog here:\n${links.changelogPage}`;
      }
    }
  }
];
