const config = require('./config');
const { commands, lookup } = require('./commands');
const { closest } = require('./util');

const lastUsed = new Map();
const names = [...lookup.keys()];

const onCooldown = sender => {
  const now = Date.now();
  if (lastUsed.size > 500) {
    for (const [key, time] of lastUsed) {
      if (now - time >= config.cooldownMs) {
        lastUsed.delete(key);
      }
    }
  }
  if (now - (lastUsed.get(sender) || 0) < config.cooldownMs) {
    return true;
  }
  lastUsed.set(sender, now);
  return false;
};

const parse = body => {
  const text = body.trim();
  if (!text.startsWith(config.prefix)) {
    return null;
  }
  const [name, ...args] = text.slice(config.prefix.length).split(/\s+/);
  return { name: name.toLowerCase(), args };
};

const isOwnChat = (message, selfId) => message.from === message.to || message.to === selfId;

const isGroup = message => message.from.endsWith('@g.us');

const unknownReply = name => {
  const suggestion = closest(name, names, name.length <= 4 ? 1 : 2);
  const hint = suggestion ? ` Did you mean ${config.prefix}${suggestion}?` : '';
  return `Unknown command.${hint} Type ${config.prefix}funkinmenu to see what I can do.`;
};

const handle = async (message, selfId) => {
  if (!message.body) {
    return;
  }
  if (message.fromMe && !isOwnChat(message, selfId)) {
    return;
  }
  const parsed = parse(message.body);
  if (!parsed || !parsed.name) {
    return;
  }
  const command = lookup.get(parsed.name);
  if (!command) {
    if (!isGroup(message)) {
      await message.reply(unknownReply(parsed.name));
    }
    return;
  }
  if (onCooldown(message.from)) {
    return;
  }
  try {
    const response = await command.run({ args: parsed.args, message, commands });
    await message.reply(response);
  } catch {
    await message.reply('Something went wrong. Try again in a moment.');
  }
};

module.exports = { handle, parse };
