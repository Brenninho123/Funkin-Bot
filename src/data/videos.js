const search = query => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

module.exports = {
  songs: {
    title: 'Songs',
    emoji: '🎵',
    items: [
      { title: 'Week 1 - Tutorial, Bopeebo, Fresh, Dad Battle', url: search('Friday Night Funkin Week 1 songs') },
      { title: 'Week 2 - Spookeez, South, Monster', url: search('Friday Night Funkin Week 2 songs') },
      { title: 'Week 3 - Pico, Philly Nice, Blammed', url: search('Friday Night Funkin Week 3 songs') },
      { title: 'Week 4 - Satin Panties, High, M.I.L.F', url: search('Friday Night Funkin Week 4 songs') },
      { title: 'Week 5 - Cocoa, Eggnog, Winter Horrorland', url: search('Friday Night Funkin Week 5 songs') },
      { title: 'Week 6 - Senpai, Roses, Thorns', url: search('Friday Night Funkin Week 6 songs') },
      { title: 'Week 7 - Ugh, Guns, Stress', url: search('Friday Night Funkin Week 7 songs') }
    ]
  },
  mods: {
    title: 'Mods',
    emoji: '🧩',
    items: [
      { title: 'Vs. Sonic.EXE', url: search('Friday Night Funkin Vs Sonic.EXE mod') },
      { title: 'Vs. Whitty', url: search('Friday Night Funkin Vs Whitty mod') },
      { title: 'Vs. Hex', url: search('Friday Night Funkin Vs Hex mod') },
      { title: 'Vs. Tricky', url: search('Friday Night Funkin Vs Tricky mod') },
      { title: 'Vs. Selever', url: search('Friday Night Funkin Vs Selever mod') },
      { title: 'Mid-Fight Masses', url: search('Friday Night Funkin Mid-Fight Masses mod') },
      { title: 'Indie Cross', url: search('Friday Night Funkin Indie Cross mod') },
      { title: 'Vs. Impostor', url: search('Friday Night Funkin Vs Impostor mod') }
    ]
  },
  tutorials: {
    title: 'Tutorials',
    emoji: '📚',
    items: [
      { title: 'How to play for beginners', url: search('Friday Night Funkin how to play beginner guide') },
      { title: 'How to install mods', url: search('Friday Night Funkin how to install mods') },
      { title: 'How to make a mod', url: search('Friday Night Funkin how to make a mod tutorial') },
      { title: 'How to chart a song', url: search('Friday Night Funkin chart editor tutorial') },
      { title: 'Psych Engine setup', url: search('Friday Night Funkin Psych Engine tutorial') },
      { title: 'Improve your accuracy', url: search('Friday Night Funkin tips to hit sicks') }
    ]
  },
  characters: {
    title: 'Characters',
    emoji: '🎤',
    items: [
      { title: 'Boyfriend', url: search('Friday Night Funkin Boyfriend character') },
      { title: 'Girlfriend', url: search('Friday Night Funkin Girlfriend character') },
      { title: 'Daddy Dearest', url: search('Friday Night Funkin Daddy Dearest') },
      { title: 'Pico', url: search('Friday Night Funkin Pico') },
      { title: 'Mommy Mearest', url: search('Friday Night Funkin Mommy Mearest') },
      { title: 'Senpai', url: search('Friday Night Funkin Senpai') },
      { title: 'Tankman', url: search('Friday Night Funkin Tankman') }
    ]
  },
  animations: {
    title: 'Animations',
    emoji: '🎬',
    items: [
      { title: 'Best fan animations', url: search('Friday Night Funkin animation') },
      { title: 'Fan-made cutscenes', url: search('Friday Night Funkin fan cutscene animation') },
      { title: 'Sprite animations', url: search('Friday Night Funkin sprite animation') }
    ]
  },
  ost: {
    title: 'Original Soundtrack',
    emoji: '🎧',
    items: [
      { title: 'Full OST', url: search('Friday Night Funkin OST full') },
      { title: 'Kawai Sprite tracks', url: search('Kawai Sprite Friday Night Funkin') },
      { title: 'Remixes', url: search('Friday Night Funkin remix') }
    ]
  },
  speedruns: {
    title: 'Speedruns and Challenges',
    emoji: '🏁',
    items: [
      { title: 'Full game speedruns', url: search('Friday Night Funkin speedrun') },
      { title: 'Hard mode no misses', url: search('Friday Night Funkin hard no miss') },
      { title: 'Blind playthroughs', url: search('Friday Night Funkin blind playthrough') }
    ]
  }
};
