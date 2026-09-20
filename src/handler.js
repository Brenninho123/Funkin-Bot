const config = require('./config');
const { lookup } = require('./commands');

const lastUsed = new Map();

const onCooldown = sender => {
  const now = Date.now();
  const previous = lastUsed.get(sender) || 0;
  if (now - previous < config.cooldownMs) {
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

const handle = async message => {
  if (!message.body || message.fromMe) {
    return;
  }
  const parsed = parse(message.body);
  if (!parsed) {
    return;
  }
  const command = lookup.get(parsed.name);
  if (!command) {
    await message.reply(`Unknown command. Type ${config.prefix}menu to see what I can do.`);
    return;
  }
  if (onCooldown(message.from)) {
    return;
  }
  try {
    const response = await command.run({ args: parsed.args, message });
    await message.reply(response);
  } catch {
    await message.reply('Something went wrong. Try again in a moment.');
  }
};

module.exports = { handle, parse };
