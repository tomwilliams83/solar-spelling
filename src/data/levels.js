// Year 3 UK spelling words organised by planet/dwarf planet level
// Ordered by distance from the Sun (orbital order).
// Difficulty increases with planet size / distance.
// No words are repeated across levels.
// All spellings follow British English conventions.
//
// ORDER: Mercury, Venus, Earth, Mars, Ceres*, Jupiter, Saturn, Uranus, Neptune,
//        Pluto*, Haumea*, Makemake*, Eris*   (* = dwarf planet)

export const PLANETS = [
  // ─── 1. MERCURY ────────────────────────────────────────────────────────────
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    order: 0,
    distanceFromSun: 0.39,
    radius: 2439,
    colour: '#9E9E9E',
    description: 'The smallest planet and closest to the Sun',
    facts: [
      'Mercury is the smallest planet in our solar system — only slightly bigger than Earth\'s Moon.',
      'A day on Mercury lasts 59 Earth days, but its year is only 88 days long!',
      'Mercury has extreme temperatures: 430°C in the day and −180°C at night.',
      'Mercury has almost no atmosphere, so the sky is always black even in daytime.',
      'Mercury is covered in craters from asteroid impacts billions of years ago.',
    ],
    words: [
      { word: 'hot', distractors: ['hott', 'hote', 'lot'] },
      { word: 'big', distractors: ['bige', 'bigg', 'pig'] },
      { word: 'run', distractors: ['runn', 'ran', 'fun'] },
      { word: 'sit', distractors: ['sett', 'set', 'bit'] },
      { word: 'red', distractors: ['redd', 'rad', 'bed'] },
      { word: 'map', distractors: ['mapp', 'mape', 'nap'] },
      { word: 'sun', distractors: ['sunn', 'son', 'bun'] },
      { word: 'top', distractors: ['topp', 'tope', 'pop'] },
    ],
    sentences: [
      { sentence: 'The ____ shines very brightly in the sky.', answer: 'sun' },
      { sentence: 'Mercury is a very ____ planet near the sun.', answer: 'hot' },
      { sentence: 'The astronaut used a ____ to find her way.', answer: 'map' },
    ],
  },

  // ─── 2. VENUS ──────────────────────────────────────────────────────────────
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    order: 1,
    distanceFromSun: 0.72,
    radius: 6051,
    colour: '#E8C97E',
    description: 'The hottest planet, wrapped in thick clouds',
    facts: [
      'Venus is the hottest planet in our solar system, with temperatures reaching 465°C.',
      'Venus spins backwards compared to most planets — so the sun rises in the west!',
      'A day on Venus is longer than its year: one Venus day equals 243 Earth days.',
      'The clouds on Venus are made of sulphuric acid, making it extremely dangerous.',
      'Venus is sometimes called Earth\'s "twin" because they are almost the same size.',
    ],
    words: [
      { word: 'glow', distractors: ['gloe', 'glowe', 'flow'] },
      { word: 'spin', distractors: ['spinn', 'spen', 'thin'] },
      { word: 'rock', distractors: ['rokk', 'roke', 'lock'] },
      { word: 'dust', distractors: ['duste', 'dast', 'gust'] },
      { word: 'ship', distractors: ['shipp', 'chip', 'shep'] },
      { word: 'flag', distractors: ['flage', 'flog', 'slag'] },
      { word: 'jump', distractors: ['jurnp', 'jamp', 'dump'] },
      { word: 'cold', distractors: ['coald', 'colde', 'bold'] },
    ],
    sentences: [
      { sentence: 'The rocket began to ____ as it entered the atmosphere.', answer: 'spin' },
      { sentence: 'The surface of Venus is covered in hot ____.', answer: 'rock' },
      { sentence: 'Deep in space it gets very ____ and dark.', answer: 'cold' },
    ],
  },

  // ─── 3. EARTH ──────────────────────────────────────────────────────────────
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    order: 2,
    distanceFromSun: 1.0,
    radius: 6371,
    colour: '#4B9CD3',
    description: 'Our home — the blue planet',
    facts: [
      'Earth is the only planet known to have life on it.',
      'Earth has one moon, which controls the tides in our oceans.',
      'About 71% of Earth\'s surface is covered in water, which is why it looks blue from space.',
      'Earth\'s atmosphere protects us from harmful radiation from the Sun.',
      'Earth is approximately 4.5 billion years old — that\'s 4,500,000,000 years!',
    ],
    words: [
      { word: 'night', distractors: ['nite', 'nigt', 'nigh'] },
      { word: 'light', distractors: ['lite', 'ligh', 'litte'] },
      { word: 'small', distractors: ['smal', 'smale', 'smoll'] },
      { word: 'space', distractors: ['spase', 'spaice', 'spaise'] },
      { word: 'crash', distractors: ['crach', 'crasch', 'crish'] },
      { word: 'flame', distractors: ['flaim', 'flam', 'flane'] },
      { word: 'storm', distractors: ['starm', 'stoarm', 'storem'] },
      { word: 'bright', distractors: ['brite', 'brigt', 'brigh'] },
    ],
    sentences: [
      { sentence: 'From ____ you can see the stars clearly.', answer: 'space' },
      { sentence: 'The ____ sky was full of twinkling stars.', answer: 'night' },
      { sentence: 'The rocket left a trail of ____ behind it.', answer: 'flame' },
    ],
  },

  // ─── 4. MARS ───────────────────────────────────────────────────────────────
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    order: 3,
    distanceFromSun: 1.52,
    radius: 3389,
    colour: '#CD4F2A',
    description: 'The Red Planet — dusty and cold',
    facts: [
      'Mars is called the Red Planet because its soil contains iron oxide — the same as rust!',
      'Mars has the largest volcano in the solar system, called Olympus Mons — three times taller than Mount Everest.',
      'Mars has two small moons called Phobos and Deimos.',
      'Scientists have sent rovers to Mars to study the surface — including the Perseverance rover.',
      'A day on Mars is 24 hours and 37 minutes — almost the same as an Earth day!',
    ],
    words: [
      { word: 'cloud', distractors: ['clowde', 'clawd', 'cloude'] },
      { word: 'thick', distractors: ['thik', 'thikk', 'thic'] },
      { word: 'swirl', distractors: ['swerl', 'swirle', 'sworl'] },
      { word: 'orbit', distractors: ['orbite', 'orbitt', 'orbot'] },
      { word: 'planet', distractors: ['planit', 'planett', 'planat'] },
      { word: 'yellow', distractors: ['yelo', 'yelloe', 'yelow'] },
      { word: 'circle', distractors: ['sircle', 'circal', 'cirkle'] },
      { word: 'frozen', distractors: ['frozzen', 'frozan', 'frowzen'] },
    ],
    sentences: [
      { sentence: 'A ____ of dust swirled across the surface of Mars.', answer: 'cloud' },
      { sentence: 'Mars takes longer to ____ the sun than Earth does.', answer: 'orbit' },
      { sentence: 'The ice caps on Mars are ____ all year round.', answer: 'frozen' },
    ],
  },

  // ─── 5. CERES (dwarf — asteroid belt) ──────────────────────────────────────
  {
    id: 'ceres',
    name: 'Ceres',
    type: 'dwarf',
    order: 4,
    distanceFromSun: 2.77,
    radius: 473,
    colour: '#B8A99A',
    description: 'A dwarf planet hidden in the asteroid belt',
    facts: [
      'Ceres is the largest object in the asteroid belt between Mars and Jupiter.',
      'It was discovered in 1801 by an astronomer named Giuseppe Piazzi.',
      'Ceres has a diameter of about 945 kilometres — smaller than the United Kingdom is wide!',
      'Scientists think there may be a salty ocean hidden beneath Ceres\' icy crust.',
      'A day on Ceres lasts just 9 hours — you\'d have nearly three days in one Earth day!',
    ],
    words: [
      { word: 'hidden', distractors: ['hiden', 'hiddan', 'hiddun'] },
      { word: 'crater', distractors: ['craiter', 'cratter', 'craytor'] },
      { word: 'ancient', distractors: ['anciant', 'anchent', 'ancyent'] },
      { word: 'salty', distractors: ['saltey', 'salti', 'saltty'] },
      { word: 'rocky', distractors: ['rocki', 'rockky', 'rokky'] },
      { word: 'surface', distractors: ['serface', 'surfase', 'surfece'] },
      { word: 'desert', distractors: ['dessert', 'dezert', 'desart'] },
      { word: 'explore', distractors: ['explor', 'expslore', 'explorre'] },
    ],
    sentences: [
      { sentence: 'Ceres is ____ among thousands of asteroids.', answer: 'hidden' },
      { sentence: 'The ____ surface of Ceres is covered in craters.', answer: 'rocky' },
      { sentence: 'Scientists want to ____ the asteroid belt in more detail.', answer: 'explore' },
    ],
  },

  // ─── 6. JUPITER ────────────────────────────────────────────────────────────
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    order: 5,
    distanceFromSun: 5.2,
    radius: 71492,
    colour: '#C88B3A',
    description: 'The giant king of the solar system',
    facts: [
      'Jupiter is the largest planet in the solar system — over 1,300 Earths could fit inside it!',
      'Jupiter\'s Great Red Spot is a storm that has been raging for over 350 years.',
      'Jupiter has at least 95 known moons — more than any other planet.',
      'Jupiter rotates faster than any other planet — a day there is only 10 hours long.',
      'Jupiter acts like a giant vacuum cleaner, pulling in asteroids and comets that might otherwise hit Earth.',
    ],
    words: [
      { word: 'enormous', distractors: ['enarmous', 'enormus', 'enormuos'] },
      { word: 'gravity', distractors: ['gravvity', 'gravitty', 'graviti'] },
      { word: 'powerful', distractors: ['powerfull', 'powarful', 'powerfel'] },
      { word: 'lightning', distractors: ['lightnning', 'lightening', 'ligtning'] },
      { word: 'discover', distractors: ['discuver', 'discovver', 'discorver'] },
      { word: 'magnetic', distractors: ['magnettik', 'magnatic', 'magnetick'] },
      { word: 'hydrogen', distractors: ['hidrogen', 'hydrojen', 'hyddrogen'] },
      { word: 'protect', distractors: ['protekt', 'protec', 'pratect'] },
    ],
    sentences: [
      { sentence: 'Jupiter\'s ____ pull is much stronger than Earth\'s.', answer: 'gravity' },
      { sentence: 'The ____ storm on Jupiter is bigger than Earth itself.', answer: 'enormous' },
      { sentence: 'Jupiter helps to ____ Earth by pulling in dangerous asteroids.', answer: 'protect' },
    ],
  },

  // ─── 7. SATURN ─────────────────────────────────────────────────────────────
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    order: 6,
    distanceFromSun: 9.58,
    radius: 60268,
    colour: '#E8D5A3',
    description: 'The ringed jewel of the solar system',
    facts: [
      'Saturn\'s rings are made of billions of chunks of ice and rock, ranging from tiny grains to house-sized boulders.',
      'Saturn is so light that if you could find an ocean big enough, it would float!',
      'A day on Saturn is only 10.7 hours, but a year lasts 29 Earth years.',
      'Saturn has 146 known moons — the most of any planet. Its largest moon, Titan, has a thick atmosphere.',
      'Saturn\'s rings stretch 282,000 km from the planet, but are only about 10 metres thick in places.',
    ],
    words: [
      { word: 'atmosphere', distractors: ['atmosfere', 'atmosphear', 'atmusphere'] },
      { word: 'temperature', distractors: ['temperture', 'temprature', 'tempurature'] },
      { word: 'beautiful', distractors: ['beutiful', 'beautifull', 'beauteful'] },
      { word: 'pressure', distractors: ['pressur', 'presure', 'pressuer'] },
      { word: 'thousand', distractors: ['thouzand', 'thousend', 'thousond'] },
      { word: 'particle', distractors: ['partikle', 'partical', 'particel'] },
      { word: 'distance', distractors: ['distanse', 'distunce', 'distonce'] },
      { word: 'floating', distractors: ['floeting', 'flotting', 'flooting'] },
    ],
    sentences: [
      { sentence: 'Saturn\'s rings are made of millions of ice ____ s.', answer: 'particle' },
      { sentence: 'Saturn is so far away that the ____ from Earth is enormous.', answer: 'distance' },
      { sentence: 'The ____ of Saturn looks truly ____ from a telescope.', answer: 'beautiful' },
    ],
  },

  // ─── 8. URANUS ─────────────────────────────────────────────────────────────
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    order: 7,
    distanceFromSun: 19.2,
    radius: 25559,
    colour: '#7DE8E8',
    description: 'The ice giant that spins on its side',
    facts: [
      'Uranus spins completely on its side — its axis is tilted 98 degrees, like a rolling ball!',
      'Uranus has 13 known rings, but they are very dark and hard to see.',
      'Uranus is an "ice giant" made mostly of icy materials like water, methane, and ammonia.',
      'A season on Uranus lasts 21 Earth years because of how tilted it is.',
      'Uranus was the first planet discovered using a telescope, found by William Herschel in 1781.',
    ],
    words: [
      { word: 'methane', distractors: ['methayne', 'methain', 'methaine'] },
      { word: 'tilted', distractors: ['tiltted', 'tiltid', 'tiltead'] },
      { word: 'rotation', distractors: ['rotashun', 'rotacion', 'rotatoin'] },
      { word: 'telescope', distractors: ['telescoap', 'telescape', 'telescoop'] },
      { word: 'scientist', distractors: ['sientist', 'scientest', 'sceintist'] },
      { word: 'unusual', distractors: ['unuzual', 'unusuall', 'unusuel'] },
      { word: 'freezing', distractors: ['freesing', 'frieezing', 'frezing'] },
      { word: 'invisible', distractors: ['invissible', 'invisable', 'invizible'] },
    ],
    sentences: [
      { sentence: 'Uranus looks blue-green because of ____ gas in its atmosphere.', answer: 'methane' },
      { sentence: 'A ____ is used to see distant planets in the night sky.', answer: 'telescope' },
      { sentence: 'The planet\'s ____ axis makes its seasons very strange.', answer: 'tilted' },
    ],
  },

  // ─── 9. NEPTUNE ────────────────────────────────────────────────────────────
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    order: 8,
    distanceFromSun: 30.1,
    radius: 24622,
    colour: '#3F54BA',
    description: 'The windiest planet at the edge of our solar system',
    facts: [
      'Neptune has the strongest winds in the solar system — over 2,000 kilometres per hour!',
      'Neptune was the first planet found using maths rather than a telescope.',
      'A year on Neptune lasts 165 Earth years — it completed its first full orbit since discovery only in 2011!',
      'Neptune has a storm called the Great Dark Spot, similar to Jupiter\'s Great Red Spot.',
      'Neptune\'s largest moon, Triton, orbits backwards and is slowly spiralling inwards.',
    ],
    words: [
      { word: 'adventure', distractors: ['adventcher', 'adventuure', 'adventuer'] },
      { word: 'calculate', distractors: ['calcalate', 'calculait', 'calculayt'] },
      { word: 'direction', distractors: ['dirrection', 'direktion', 'direstion'] },
      { word: 'navigate', distractors: ['navigayt', 'naviggate', 'navigait'] },
      { word: 'probably', distractors: ['proberbly', 'probbably', 'probabley'] },
      { word: 'violent', distractors: ['violant', 'viollent', 'violint'] },
      { word: 'continuous', distractors: ['continuus', 'contineous', 'continnuous'] },
      { word: 'enormous', distractors: ['enarmous', 'enormus', 'enormuos'] },
    ],
    sentences: [
      { sentence: 'The winds on Neptune are extremely ____.', answer: 'violent' },
      { sentence: 'Scientists had to ____ where Neptune was before they could see it.', answer: 'calculate' },
      { sentence: 'A journey to Neptune would be an incredible ____.', answer: 'adventure' },
    ],
  },

  // ─── 10. PLUTO (dwarf) ─────────────────────────────────────────────────────
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'dwarf',
    order: 9,
    distanceFromSun: 39.5,
    radius: 1188,
    colour: '#C4A882',
    description: 'The beloved icy dwarf planet beyond Neptune',
    facts: [
      'Pluto was discovered in 1930 by a young astronomer named Clyde Tombaugh.',
      'A year on Pluto lasts 248 Earth years — you wouldn\'t have a birthday very often!',
      'Pluto has a giant heart-shaped plain made of frozen nitrogen called Tombaugh Regio.',
      'Pluto has five moons. Its biggest moon, Charon, is so large that they orbit each other!',
      'Pluto was reclassified as a dwarf planet in 2006, which made many people around the world very sad!',
    ],
    words: [
      { word: 'nitrogen', distractors: ['nitragen', 'nitregen', 'nitrogan'] },
      { word: 'dwarf', distractors: ['dworf', 'dwarff', 'dwaff'] },
      { word: 'farthest', distractors: ['furtherst', 'furthest', 'farthist'] },
      { word: 'astronomer', distractors: ['astonomer', 'astromer', 'astronomar'] },
      { word: 'classified', distractors: ['classifyed', 'clasified', 'classiffied'] },
      { word: 'icy', distractors: ['iccy', 'icey', 'icsy'] },
      { word: 'discovered', distractors: ['discuvered', 'discovvered', 'discorved'] },
      { word: 'reclassify', distractors: ['reclassafi', 'reclassifie', 'reclasify'] },
    ],
    sentences: [
      { sentence: 'Pluto is covered in ____ plains of frozen gas.', answer: 'icy' },
      { sentence: 'An ____ is a scientist who studies stars and planets.', answer: 'astronomer' },
      { sentence: 'Pluto was ____ as a dwarf planet in 2006.', answer: 'classified' },
    ],
  },

  // ─── 11. HAUMEA (dwarf) ────────────────────────────────────────────────────
  {
    id: 'haumea',
    name: 'Haumea',
    type: 'dwarf',
    order: 10,
    distanceFromSun: 43.1,
    radius: 620,
    colour: '#D4C5A9',
    description: 'The egg-shaped spinning dwarf planet',
    facts: [
      'Haumea is shaped like a rugby ball because it spins so incredibly fast — one day lasts only 4 hours!',
      'Haumea has two small moons called Hi\'iaka and Namaka.',
      'It is named after the Hawaiian goddess of childbirth and fertility.',
      'Haumea has a thin ring around it, discovered in 2017.',
      'Haumea is made mostly of rock covered in a thin layer of ice.',
    ],
    words: [
      { word: 'elliptical', distractors: ['eliptical', 'elliptikle', 'eliptikle'] },
      { word: 'mythology', distractors: ['mitholagy', 'mythollogy', 'mytholegy'] },
      { word: 'elongated', distractors: ['elonggated', 'elongatid', 'elungated'] },
      { word: 'rapidly', distractors: ['rappidly', 'rapidley', 'reppidly'] },
      { word: 'goddess', distractors: ['goddes', 'godess', 'goddiss'] },
      { word: 'discovery', distractors: ['discuvery', 'discovvery', 'discoverie'] },
      { word: 'composition', distractors: ['compasition', 'composision', 'composishin'] },
      { word: 'rotation', distractors: ['rotashun', 'rotacion', 'rotatoin'] },
    ],
    sentences: [
      { sentence: 'Haumea spins so ____ that it has become egg-shaped.', answer: 'rapidly' },
      { sentence: 'The planet is named after a Hawaiian ____.', answer: 'goddess' },
      { sentence: 'Scientists made the ____ of Haumea\'s ring in 2017.', answer: 'discovery' },
    ],
  },

  // ─── 12. MAKEMAKE (dwarf) ──────────────────────────────────────────────────
  {
    id: 'makemake',
    name: 'Makemake',
    type: 'dwarf',
    order: 11,
    distanceFromSun: 45.8,
    radius: 715,
    colour: '#D4864A',
    description: 'A reddish dwarf planet named after a god of creation',
    facts: [
      'Makemake is one of the brightest objects in the Kuiper Belt after Pluto.',
      'It is named after the creator god of the Rapa Nui people of Easter Island.',
      'Makemake has one known moon, nicknamed MK2, discovered in 2016.',
      'Its surface is covered in frozen methane and ethane, giving it a reddish-brown colour.',
      'A year on Makemake lasts 305 Earth years!',
    ],
    words: [
      { word: 'reddish', distractors: ['reddesh', 'redish', 'reddich'] },
      { word: 'brightest', distractors: ['brigtest', 'brightist', 'britest'] },
      { word: 'ethane', distractors: ['ethayne', 'ethan', 'ethaen'] },
      { word: 'creation', distractors: ['creashun', 'creattion', 'creacion'] },
      { word: 'nickname', distractors: ['niccname', 'nicknam', 'nicname'] },
      { word: 'civilisation', distractors: ['civlisation', 'civilsation', 'civilizasion'] },
      { word: 'reclassified', distractors: ['reclassafied', 'reclasified', 'reclassifyed'] },
      { word: 'telescope', distractors: ['telescoap', 'telescape', 'telescoop'] },
    ],
    sentences: [
      { sentence: 'The frozen ____ on Makemake gives it its reddish colour.', answer: 'ethane' },
      { sentence: 'Makemake\'s moon was given the ____ MK2.', answer: 'nickname' },
      { sentence: 'The Rapa Nui people have an ancient ____ story featuring Makemake.', answer: 'creation' },
    ],
  },

  // ─── 13. ERIS (dwarf) ──────────────────────────────────────────────────────
  {
    id: 'eris',
    name: 'Eris',
    type: 'dwarf',
    order: 12,
    distanceFromSun: 67.7,
    radius: 1163,
    colour: '#C8C8C8',
    description: 'The most massive dwarf planet — the world that changed everything',
    facts: [
      'Eris is the most massive known dwarf planet — even slightly heavier than Pluto, though Pluto is a tiny bit wider.',
      'The discovery of Eris in 2005 is the reason scientists decided to create the "dwarf planet" category.',
      'Eris is named after the Greek goddess of discord and strife.',
      'Eris has one moon called Dysnomia, named after the goddess of lawlessness.',
      'Eris is so far from the Sun that its surface temperature drops to around −240°C — close to absolute zero!',
    ],
    words: [
      { word: 'definition', distractors: ['defenition', 'definishun', 'deffinition'] },
      { word: 'category', distractors: ['catagory', 'categorie', 'catergory'] },
      { word: 'controversy', distractors: ['contraversy', 'controvercy', 'controvursy'] },
      { word: 'measurement', distractors: ['measurment', 'measuremant', 'measuerment'] },
      { word: 'observatory', distractors: ['observitory', 'observatary', 'observatorie'] },
      { word: 'conclusion', distractors: ['conclution', 'conclussion', 'conclushun'] },
      { word: 'scientific', distractors: ['sientific', 'scientiffic', 'sceintific'] },
      { word: 'temperature', distractors: ['temperture', 'temprature', 'tempurature'] },
    ],
    sentences: [
      { sentence: 'The discovery of Eris caused great ____ in the scientific world.', answer: 'controversy' },
      { sentence: 'Scientists built an ____ to study distant objects in space.', answer: 'observatory' },
      { sentence: 'The ____ of a "planet" was changed because of Eris.', answer: 'definition' },
    ],
  },
];

export const QUESTION_TYPES = {
  LISTEN_SPELL: 'listen_spell',
  CHOOSE_SPELLING: 'choose_spelling',
  FILL_BLANK: 'fill_blank',
};

export const AVATARS = [
  { id: 'astronaut', emoji: '👨‍🚀', label: 'Astronaut' },
  { id: 'scientist', emoji: '👩‍🔬', label: 'Scientist' },
  { id: 'alien', emoji: '👽', label: 'Space Friend' },
  { id: 'robot', emoji: '🤖', label: 'Robot' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket Pilot' },
  { id: 'star', emoji: '⭐', label: 'Star Explorer' },
];
