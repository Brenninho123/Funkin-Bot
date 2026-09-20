const general = require('./general');
const fun = require('./fun');
const info = require('./info');
const modding = require('./modding');
const videos = require('./videos');

const commands = [...general, ...fun, ...info, ...modding, ...videos];

const lookup = new Map();
commands.forEach(command => {
  [command.name, ...command.aliases].forEach(name => {
    if (lookup.has(name)) {
      throw new Error(`Duplicate command name: ${name}`);
    }
    lookup.set(name, command);
  });
});

module.exports = { commands, lookup };
