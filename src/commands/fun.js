const config = require('../config');
const questions = require('../data/quiz');
const { pick } = require('../util');

const letters = ['A', 'B', 'C', 'D'];
const arrows = ['⬅️', '⬇️', '⬆️', '➡️'];
const activeQuizzes = new Map();

module.exports = [
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
  }
];
