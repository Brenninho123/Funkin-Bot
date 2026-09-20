const path = require('path');

const toBool = (value, fallback) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const toInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const toList = (value, fallback = []) => {
  if (!value) return fallback;
  return String(value).split(',').map(item => item.trim()).filter(Boolean);
};

const normalizeNumber = jid => String(jid || '').split('@')[0].split(':')[0].replace(/\D/g, '');

const config = {
  name: process.env.BOT_NAME || 'Funkin Bot',
  version: '1.0.0',
  language: process.env.BOT_LANGUAGE || 'en',
  timezone: process.env.BOT_TIMEZONE || 'America/Sao_Paulo',

  prefixes: toList(process.env.BOT_PREFIXES, ['!', '/', '.']),
  caseSensitive: toBool(process.env.BOT_CASE_SENSITIVE, false),
  allowNoPrefixInPrivate: toBool(process.env.BOT_NO_PREFIX_PRIVATE, false),

  owners: toList(process.env.BOT_OWNERS).map(normalizeNumber),
  admins: toList(process.env.BOT_ADMINS).map(normalizeNumber),

  paths: {
    session: path.resolve(process.env.BOT_SESSION_DIR || './session'),
    commands: path.resolve(process.env.BOT_COMMANDS_DIR || './commands'),
    events: path.resolve(process.env.BOT_EVENTS_DIR || './events'),
    database: path.resolve(process.env.BOT_DB_FILE || './data/database.json'),
    temp: path.resolve(process.env.BOT_TEMP_DIR || './temp')
  },

  cooldown: {
    defaultMs: toInt(process.env.BOT_COOLDOWN_MS, 2000),
    perCategoryMs: {
      general: 1500,
      fun: 3000,
      tools: 5000,
      download: 15000,
      admin: 1000
    },
    ownersBypass: true
  },

  rateLimit: {
    enabled: toBool(process.env.BOT_RATE_LIMIT, true),
    windowMs: toInt(process.env.BOT_RATE_WINDOW_MS, 10000),
    maxCommands: toInt(process.env.BOT_RATE_MAX, 6),
    tempBanMs: toInt(process.env.BOT_RATE_BAN_MS, 60000),
    strikesBeforeBan: 3
  },

  connection: {
    autoReconnect: true,
    reconnectDelayMs: toInt(process.env.BOT_RECONNECT_DELAY_MS, 3000),
    maxReconnectDelayMs: 60000,
    maxReconnectAttempts: toInt(process.env.BOT_RECONNECT_ATTEMPTS, 10),
    markOnlineOnConnect: false,
    pairingCode: toBool(process.env.BOT_PAIRING_CODE, false),
    pairingNumber: normalizeNumber(process.env.BOT_PAIRING_NUMBER)
  },

  behavior: {
    ignoreOwnMessages: true,
    ignoreBroadcasts: true,
    ignoreOldMessagesSeconds: 30,
    groupsEnabled: true,
    privateEnabled: true,
    autoReadMessages: toBool(process.env.BOT_AUTO_READ, true),
    typingIndicator: true,
    typingDurationMs: 800,
    reactOnSuccess: '✅',
    reactOnError: '❌',
    maxArgsLength: 1500
  },

  features: {
    welcome: true,
    antiLink: false,
    antiSpam: true,
    autoSticker: false,
    fnfTools: true
  },

  messages: {
    unknownCommand: 'Unknown command. Use {prefix}help to see the list.',
    cooldown: 'Wait {seconds}s before using this command again.',
    rateLimited: 'Too many commands. Try again in {seconds}s.',
    ownerOnly: 'This command is restricted to the bot owner.',
    adminOnly: 'This command is restricted to admins.',
    groupOnly: 'This command only works in groups.',
    privateOnly: 'This command only works in private chats.',
    botNotAdmin: 'I need admin permissions in this group.',
    error: 'Something went wrong while running this command.'
  },

  logging: {
    level: process.env.BOT_LOG_LEVEL || 'info',
    toFile: toBool(process.env.BOT_LOG_FILE, false),
    file: path.resolve(process.env.BOT_LOG_PATH || './logs/bot.log'),
    pretty: process.env.NODE_ENV !== 'production'
  }
};

config.isOwner = jid => config.owners.includes(normalizeNumber(jid));

config.isAdmin = jid => config.isOwner(jid) || config.admins.includes(normalizeNumber(jid));

config.getCooldown = category => {
  const value = config.cooldown.perCategoryMs[category];
  return typeof value === 'number' ? value : config.cooldown.defaultMs;
};

config.format = (template, values = {}) =>
  String(template).replace(/\{(\w+)\}/g, (match, key) =>
    values[key] !== undefined ? String(values[key]) : match
  );

config.parseCommand = (text, isGroup = true) => {
  const body = String(text || '').trim();
  if (!body) return null;

  const sorted = [...config.prefixes].sort((a, b) => b.length - a.length);
  const prefix = sorted.find(item => body.startsWith(item));

  let content;
  if (prefix) {
    content = body.slice(prefix.length).trim();
  } else if (!isGroup && config.allowNoPrefixInPrivate) {
    content = body;
  } else {
    return null;
  }

  if (!content) return null;

  const parts = content.split(/\s+/);
  const rawName = parts.shift();
  const name = config.caseSensitive ? rawName : rawName.toLowerCase();
  const args = parts;
  const text_ = args.join(' ').slice(0, config.behavior.maxArgsLength);

  return { prefix: prefix || '', name, args, text: text_ };
};

config.validate = () => {
  if (!config.prefixes.length) {
    throw new Error('At least one prefix is required');
  }
  if (config.connection.pairingCode && !config.connection.pairingNumber) {
    throw new Error('BOT_PAIRING_NUMBER is required when pairing code is enabled');
  }
  if (config.rateLimit.maxCommands < 1) {
    throw new Error('rateLimit.maxCommands must be at least 1');
  }
  return config;
};

const freeze = target => {
  Object.values(target).forEach(value => {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) freeze(value);
  });
  return Object.freeze(target);
};

module.exports = freeze(config.validate());
