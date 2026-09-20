const pick = list => list[Math.floor(Math.random() * list.length)];

const normalize = text => String(text).toLowerCase().replace(/[^a-z0-9]/g, '');

const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
};

const closest = (word, candidates, maxDistance = 2) => {
  let best = null;
  let bestDistance = maxDistance + 1;
  for (const candidate of candidates) {
    const d = distance(word, candidate);
    if (d < bestDistance) {
      best = candidate;
      bestDistance = d;
    }
  }
  return best;
};

const code = text => '```\n' + text + '\n```';

module.exports = { pick, normalize, distance, closest, code };
