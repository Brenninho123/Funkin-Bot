const docsBase = 'https://funkincrew.github.io/funkin-modding-docs/';

const docs = {
  metadata: { title: 'The Metadata File', path: '01-fundamentals/01-01-the-metadata-file.html' },
  loading: { title: 'Loading the Mod In-Game', path: '01-fundamentals/01-02-loading-the-mod-in-game.html' },
  assets: { title: 'Asset Replacement and Additions', path: '01-fundamentals/01-03-asset-replacement-and-additions.html' },
  order: { title: 'Mod Load Order', path: '01-fundamentals/01-04-mod-load-order.html' },
  hotreload: { title: 'Hot Reloading', path: '01-fundamentals/01-05-hot-reloading.html' },
  chart: { title: 'Creating a Chart', path: '02-custom-songs-and-custom-levels/02-01-creating-a-chart.html' },
  song: { title: 'Adding the Custom Song', path: '02-custom-songs-and-custom-levels/02-02-adding-the-custom-song.html' },
  level: { title: 'Adding a Custom Level', path: '02-custom-songs-and-custom-levels/02-03-adding-a-custom-level.html' },
  variations: { title: 'What Are Variations?', path: '02-custom-songs-and-custom-levels/02-04-what-are-variations.html' },
  addvariation: {
    title: 'Adding Variations to Existing Songs',
    path: '02-custom-songs-and-custom-levels/02-05-adding-variations-to-existing-songs.html'
  },
  characters: { title: 'Custom Characters', path: '03-custom-characters/03-00-custom-characters.html' },
  characterassets: { title: 'Character Assets', path: '03-custom-characters/03-01-character-assets.html' },
  newcharacter: { title: 'Creating a Character', path: '03-custom-characters/03-02-creating-a-character.html' },
  usecharacter: { title: 'Using a Character in a Song', path: '03-custom-characters/03-02-using-a-character-in-a-song.html' },
  offsets: { title: 'Fixing Character Offsets', path: '03-custom-characters/03-03-fixing-character-offsets.html' },
  stages: { title: 'Custom Stages', path: '04-custom-stages/04-00-custom-stages.html' },
  newstage: { title: 'Creating a Stage', path: '04-custom-stages/04-01-creating-a-stage.html' },
  usestage: { title: 'Using a Stage in a Song', path: '04-custom-stages/04-02-using-a-stage-in-a-song.html' },
  playable: {
    title: 'Custom Playable Characters',
    path: '05-custom-playable-characters/05-00-custom-playable-characters.html'
  },
  notestyles: { title: 'Custom Note Styles', path: '06-custom-notestyles/06-00-custom-notestyles.html' },
  stickers: { title: 'Custom Sticker Packs', path: '07-custom-sticker-packs/07-00-custom-sticker-packs.html' },
  migration: { title: 'Migrating Mods to Newer Versions', path: '09-migration/09-00-migrating-mods-to-newer-versions.html' },
  append: { title: 'Appending Files', path: '10-appending-and-merging-files/10-01-appending-files.html' },
  merge: { title: 'Merging Files', path: '10-appending-and-merging-files/10-02-merging-files.html' },
  hscript: { title: 'What is HScript?', path: '20-using-hscript/20-01-what-is-hscript.html' },
  classes: { title: 'Scripted Classes', path: '21-scripted-classes/21-00-scripted-classes.html' },
  scriptedsongs: { title: 'Scripted Songs', path: '21-scripted-classes/21-01-scripted-songs.html' },
  modules: { title: 'Scripted Modules', path: '30-scripted-modules/30-00-scripted-modules.html' },
  shaders: { title: 'Custom Shaders', path: '31-custom-shaders/31-00-custom-shaders.html' }
};

const metaTemplate = `{
  "title": "My Mod",
  "description": "My first Funkin mod.",
  "contributors": [{ "name": "YourName" }],
  "api_version": "0.8.0",
  "mod_version": "1.0.0",
  "license": "Apache-2.0"
}`;

const songLayout = `mods/mymod/
  data/songs/<songid>/
    <songid>-metadata.json
    <songid>-chart.json
  songs/<songid>/
    Inst.ogg
    Voices-bf.ogg
  data/levels/<name>.json
  images/storymenu/titles/<name>.png
  _polymod_meta.json`;

const tutorials = {
  firstmod: {
    title: 'Your first mod',
    aliases: ['newmod', 'start', 'first'],
    doc: 'metadata',
    steps: [
      'Start the game at least once so the mods folder gets created.',
      'Create a new folder inside mods, for example mods/mymod.',
      'Inside it, create a file named _polymod_meta.json (make sure it is not saved as .json.txt) with the content below.',
      'Restart the game. It detects your mod on startup.',
      'To replace an asset, place your file at the same relative path as the original. The official testing123 example mod replaces images/newgrounds_logo.png this way.'
    ],
    code: metaTemplate
  },
  song: {
    title: 'Add a custom song',
    aliases: ['chart', 'songs'],
    doc: 'song',
    steps: [
      'Make your chart in the Chart Editor. Open the Debug menu from the main menu (~ by default).',
      'Save it. The game exports a .fnfc file, which is really a ZIP archive.',
      'Rename mychart.fnfc to mychart.zip and extract it. You get manifest.json, the metadata and chart JSON files, Inst.ogg and the Voices ogg files.',
      'Put the metadata and chart JSON files in data/songs/<songid>/. You do not need manifest.json.',
      'Put the ogg files in songs/<songid>/.',
      'Add the song to a level (see !tutorial level). A song only shows up in Story Mode and Freeplay when it belongs to a level.'
    ],
    code: songLayout
  },
  level: {
    title: 'Add a custom level',
    aliases: ['week', 'levels'],
    doc: 'level',
    steps: [
      'Create data/levels/<name>.json in your mod. Use a unique name, otherwise it overlaps a base game week or another mod.',
      'Set name, titleAsset, background, songs (your song ids), visible and props (the characters shown in the Story Mode menu).',
      'Add the title image at images/storymenu/titles/<name>.png.',
      'Restart the game (or press F5). The level appears in Story Mode and its songs in Freeplay.'
    ]
  },
  hotreload: {
    title: 'Hot reloading',
    aliases: ['reload', 'f5'],
    doc: 'hotreload',
    steps: [
      'Press F5 in the game. It dumps its cache, reloads game data from disk and restarts the current state.',
      'Use it to tweak stage props, character offsets or fix a script without closing the game.',
      'Known limitation: a hot reload does not reset song charts or song scripts.',
      'Some debug hotkeys only work on debug builds, so use one if F5 does nothing.'
    ]
  },
  order: {
    title: 'Mod load order',
    aliases: ['loadorder', 'priority'],
    doc: 'order',
    steps: [
      'Mods load in alphabetical order by default, with dependencies loaded first.',
      'When two mods provide the same file, the mod loaded last wins. This is decided per file.',
      'List other mods under dependencies or optionalDependencies in _polymod_meta.json to make yours load after them.',
      'Prefer _merge files over replacing whole data files, so your mod stays compatible with others.'
    ]
  },
  append: {
    title: 'Append to a file',
    aliases: ['appending'],
    doc: 'append',
    steps: [
      'Create an _append folder in your mod.',
      'Mirror the path of the target file. For example _append/data/introText.txt adds lines to data/introText.txt (the official introMod does exactly this).',
      'TXT files: the content is added to the end. CSV and TSV files: the rows are added to the end.',
      'JSON files: values are appended naively. Included values replace the old ones instead of merging with them.',
      'For finer control, use _merge (see !tutorial merge).'
    ]
  },
  merge: {
    title: 'Merge into a file',
    aliases: ['merging'],
    doc: 'merge',
    steps: [
      'Create a _merge folder in your mod and mirror the path of the target file.',
      'Merge files are applied in mod load order, so several mods can edit the same file without conflicts.',
      'CSV and TSV files: rows whose first cell matches a row in the base file replace it.',
      'XML files: add a <merge key="id" value="..."/> child tag to say which node to change.',
      'Merging lets you insert data in the middle of a file, replace data or delete it.'
    ]
  },
  hscript: {
    title: 'Scripting with HScript',
    aliases: ['script', 'scripts', 'hxc'],
    doc: 'hscript',
    steps: [
      'Scripts are .hxc files, interpreted by Polymod as HScript, a language very close to Haxe.',
      'The base game uses them for cutscenes, stage props, characters, note kinds and levels, in folders like scripts/songs and scripts/stages.',
      'Every scripted class needs a name that is unique across all mods. Duplicates get suppressed.',
      'Private variables are accessible and some classes are blacklisted for safety.',
      'Abstracts and abstract enums are not accessible. Use the underlying values instead.',
      'Read the official scripts at github.com/FunkinCrew/funkin.assets/tree/main/preload/scripts to learn how they work.'
    ]
  },
  compile: {
    title: 'Compile the game',
    aliases: ['build', 'source'],
    link: 'https://github.com/FunkinCrew/Funkin/blob/main/docs/COMPILING.md',
    steps: [
      'Install Haxe and Git.',
      'Clone the repo with git clone https://github.com/FunkinCrew/funkin.git. Do not use the Download ZIP button.',
      'Run cd funkin, then git submodule update --init --recursive to download the assets (proprietary content).',
      'Run haxelib --global install hmm, then haxelib --global run hmm setup.',
      'Run hmm install, then haxelib run lime setup.',
      'Windows: install the Visual Studio Build Tools with MSVC v143 x64/x86 build tools and the Windows 10/11 SDK.',
      'Run lime test windows (or your platform). Add -debug to enable debug features.'
    ]
  }
};

const install = {
  windows: {
    title: 'Windows',
    aliases: ['win', 'pc'],
    steps: [
      'Start the game at least once. This creates a mods folder next to the executable.',
      'Extract the mod ZIP and put the mod folder inside mods.',
      'Restart the game. It detects the mod and starts with it.'
    ]
  },
  linux: {
    title: 'Linux',
    aliases: [],
    steps: [
      'Start the game at least once. This creates a mods folder next to the executable.',
      'Extract the mod ZIP and put the mod folder inside mods.',
      'Restart the game. It detects the mod and starts with it.'
    ]
  },
  mac: {
    title: 'MacOS',
    aliases: ['macos', 'osx'],
    steps: [
      'Start the game at least once so the mods folder is created.',
      'Right click Funkin.app and select Show Package Contents.',
      'Go to Contents/Resources/mods.',
      'Extract the mod ZIP and put the mod folder inside mods.',
      'Restart the game.'
    ]
  },
  android: {
    title: 'Android',
    aliases: [],
    steps: [
      'Start the game at least once. This creates a mods folder deep in your system files.',
      'Use a file browser that can see app data, or Android Studio Device Explorer.',
      'Go to /sdcard/Android/obb/me.funkin.fnf/mods.',
      'Extract the mod ZIP and put the mod folder inside mods.',
      'Restart the game. You may have to force close the app first.'
    ]
  },
  ios: {
    title: 'iOS',
    aliases: ['iphone', 'ipad'],
    steps: [
      'Start the game at least once. This creates a mods folder in your system files.',
      'Open the Files app and go to On My iPhone > Friday Night Funkin > mods.',
      'Extract the mod ZIP and put the mod folder inside mods.',
      'Restart the game. You may have to force close the app first.'
    ]
  },
  web: {
    title: 'HTML5 / Web',
    aliases: ['html5', 'browser', 'newgrounds'],
    steps: ['Mods are not supported in the web version.']
  }
};

const hotkeys = {
  any: {
    title: 'Any screen',
    aliases: ['all', 'global'],
    lines: [
      'INSERT: run memory garbage collection',
      'F2: Flixel debug overlay',
      'F3: take a screenshot (works outside debug builds too)',
      'F4: eject to the Main Menu, useful when stuck',
      'F5: hot reload scripts and data files, then restart the current state',
      'CTRL-ALT-SHIFT-L: force a crash with a detailed log'
    ]
  },
  play: {
    title: 'Play State',
    aliases: ['game', 'song', 'playstate'],
    lines: [
      'H: hide the UI',
      '1: end the song',
      '2: gain 10% health',
      '3: lose 5% health',
      'PAGEUP / PAGEDOWN: skip forward / back 2 sections (hold SHIFT for 20)',
      'The CHART hotkey opens the Chart Editor with the current song'
    ]
  },
  freeplay: {
    title: 'Freeplay',
    aliases: [],
    lines: [
      'P: switch between Pico and BF',
      'T: test the Gold Perfect rank animation',
      'SHIFT-ACCEPT: start the song in Botplay mode',
      'CTRL-ACCEPT: start the song with mirrored notes',
      'CTRL-Switch Song: preview the first unlocked alternate instrumental'
    ]
  },
  menu: {
    title: 'Main Menu',
    aliases: ['main', 'mainmenu'],
    lines: [
      '~: open the Debug menu with the Chart Editor and other editors (rebindable)',
      'SHIFT-ACCEPT on Freeplay: open Freeplay as Pico',
      'CTRL-ALT-SHIFT-W: unlock all Freeplay songs (debug builds)',
      'CTRL-ALT-SHIFT-M: lock all Freeplay songs again (debug builds)',
      'CTRL-ALT-SHIFT-E: dump your save data as a JSON file (debug builds)'
    ]
  }
};

const links = {
  repo: 'https://github.com/FunkinCrew/Funkin',
  docs: docsBase,
  web: 'https://www.newgrounds.com/portal/view/770371',
  itch: 'https://ninja-muffin24.itch.io/funkin',
  android: 'https://play.google.com/store/apps/details?id=me.funkin.fnf',
  ios: 'https://apps.apple.com/app/id6740428530',
  changelog: 'https://raw.githubusercontent.com/FunkinCrew/Funkin/main/CHANGELOG.md',
  changelogPage: 'https://github.com/FunkinCrew/Funkin/blob/main/CHANGELOG.md'
};

const credits = [
  {
    title: 'Programming',
    people: [
      'ninjamuffin99 (Lead Programmer)',
      'EliteMasterEric (Programmer)',
      'MtH (Charting and Additional Programming)',
      'GeoKureli (Additional Programming)',
      'ZackDroid (Lead Mobile Programmer)',
      'MAJigsaw77, Karim-Akra, Sector_5, Luckydog7 (Mobile Programmers)'
    ]
  },
  {
    title: 'Art, Animation and UI',
    people: [
      'PhantomArcade3K (Artist and Animator)',
      'Evilsk8r (Art)',
      'Moawling (Week 6 Pixel Art)',
      'IvanAlmighty (Misc UI Design)'
    ]
  },
  {
    title: 'Music',
    people: ['Kawaisprite (Musician)', 'BassetFilms (Music for Monster, Additional Character Design)']
  },
  {
    title: 'Special Thanks',
    people: [
      'Tom Fulp (for Newgrounds)',
      'JohnnyUtah (Voice of Tankman)',
      'L0Litsmonica (Voice of Mommy Mearest)'
    ]
  }
];

module.exports = { docsBase, docs, tutorials, install, hotkeys, links, credits, metaTemplate };
