(function (root) {
  'use strict';

  /** Build a photo entry from a LoremFlickr keyword search (swap for your own URLs any time). */
  function photo(keywords, lock, alt, caption) {
    return {
      src: 'https://loremflickr.com/900/600/' + keywords + '?lock=' + lock,
      alt: alt,
      caption: caption || ''
    };
  }

  /**
   * Everything personal lives in this file: names, the poem, the questions,
   * the photos and the music. Edit freely. No other file needs to change.
   */
  const Config = {

    // ---- Personalize these two lines ----
    HER_NAME: '',   // e.g. 'Amara'   (leave empty to just say "you")
    HIS_NAME: '',   // e.g. 'Daniel'  (used for the signature at the very end)

    // ---- Background music ----
    // Sources are tried in order. If one fails to load, the next is used.
    // The most reliable option: put your own song at assets/music.mp3
    MUSIC: {
      VOLUME: 0.35,      // comfortable default (0 to 1)
      FADE_MS: 2500,     // gentle fade-in
      SOURCES: [
        'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Gymnop%C3%A9die_No._1.ogg',
        'assets/music.mp3'
      ]
    },

    // ---- The opening poem ----
    POEM: {
      title: 'More Beautiful Than Moonlight',
      stanzas: [
        [
          'The moon has lit a thousand quiet skies,',
          'yet it grows pale beside your smiling eyes.'
        ],
        [
          'Your smile arrives like morning through a door,',
          'and every worry fades. I wish for nothing more.'
        ],
        [
          'Your eyes hold evenings I would cross the sea to see,',
          'as warm as candlelight, and kind as kind can be.'
        ],
        [
          'I looked for words as lovely as your face,',
          'but language never learned your kind of grace.'
        ],
        [
          'So let me say it plainly, soft and true:',
          'no moonlight in the world is half as bright as you.'
        ]
      ]
    },

    // ---- Photos (every photo has alt text that is shown if it fails to load) ----
    IMAGES: {
      hero: Object.assign(
        photo('roses,red', 11, 'A bouquet of deep red roses glowing in warm candlelight'),
        { eager: true }
      ),
      // One of these appears for every 3 questions
      quiz: [
        photo('sunset,couple', 21, 'A couple walking hand in hand along a beach at golden sunset'),
        photo('candlelight,dinner', 22, 'A candlelit table set for two with red roses'),
        photo('moon,night', 23, 'A glowing full moon over a calm night sky'),
        photo('bouquet,flowers', 24, 'A bouquet of pink and red flowers tied with a ribbon')
      ],
      gallery: [
        photo('roses,red', 31, 'Red roses with soft morning dew'),
        photo('couple,love', 32, 'Two people holding hands, standing close together'),
        photo('hearts,love', 33, 'Red paper hearts scattered on a soft pink background')
      ]
    },

    // ---- The escaping "No" button ----
    DODGE: {
      DISTANCE: 110,        // how close (px) the pointer can get before it jumps away
      MAX_YES_SCALE: 1.35,  // the Yes button grows a little with every escape
      MESSAGES: [
        'Nice try! 😏',
        'Too slow! 🏃',
        'Oops, missed me! 🙈',
        'The No button is shy 😳',
        'Not today! 💨',
        'Have you tried the Yes button? 😉',
        "I'm afraid I'm too fast for you ⚡",
        'Pssst... Yes is right there ❤️'
      ]
    },

    /*
      ---- The questions (shown one at a time) ----
      label  = what the button says
      say    = the fragment used to build the final personalized message
      detail = the heading used in the "Our date plan" card
    */
    QUESTIONS: [
      {
        id: 'date',
        detail: 'The date',
        type: 'dodge',
        prompt: 'Would you go on a date with me?',
        note: 'Take your time... (not too much though 😉)',
        options: [
          { label: 'Yes ❤️', say: '', yes: true },
          { label: 'No 😔', say: '', no: true }
        ]
      },
      {
        id: 'day',
        detail: 'Day',
        prompt: 'What day would work best for you?',
        note: 'I will happily clear my schedule.',
        options: [
          { label: 'Friday', say: 'on Friday' },
          { label: 'Saturday', say: 'on Saturday' },
          { label: 'Sunday', say: 'on Sunday' },
          { label: 'Any day with you ❤️', say: 'on whichever day suits you best' }
        ]
      },
      {
        id: 'time',
        detail: 'Time',
        prompt: 'What time are you free?',
        note: '',
        options: [
          { label: 'Morning', say: 'in the morning' },
          { label: 'Afternoon', say: 'in the afternoon' },
          { label: 'Evening', say: 'in the evening' },
          { label: 'Anytime', say: 'at whatever time suits you' }
        ]
      },
      {
        id: 'place',
        detail: 'Place',
        prompt: 'Where should we go?',
        note: 'Every option sounds perfect with you.',
        options: [
          { label: 'Fancy restaurant', say: 'a fancy candlelit restaurant' },
          { label: 'Beach walk', say: 'the beach for a slow walk by the water' },
          { label: 'Movie night', say: 'a cozy movie night' },
          { label: 'Anywhere together', say: 'anywhere at all, as long as it is with you' }
        ]
      },
      {
        id: 'gift',
        detail: 'Treats',
        prompt: 'What should I bring?',
        note: 'I have a feeling you have a sweet tooth.',
        options: [
          { label: 'Chocolate', say: 'plenty of chocolate' },
          { label: 'Ice Cream', say: 'plenty of your favourite ice cream' },
          { label: 'Cake', say: 'a delicious cake' },
          { label: 'All of the above', say: 'a mountain of chocolate, ice cream and cake' }
        ]
      },
      {
        id: 'flower',
        detail: 'Flowers',
        prompt: 'Which flower do you like most?',
        note: 'Flowers for someone who is prettier than all of them.',
        options: [
          { label: 'Rose', say: 'beautiful roses' },
          { label: 'Tulip', say: 'elegant tulips' },
          { label: 'Sunflower', say: 'bright sunflowers' },
          { label: 'Lily', say: 'graceful lilies' }
        ]
      },
      {
        id: 'music',
        detail: 'Music',
        prompt: 'What kind of music shall we listen to?',
        note: 'The soundtrack matters.',
        options: [
          { label: 'Romantic classics', say: 'timeless romantic classics' },
          { label: 'Soft jazz', say: 'soft, dreamy jazz' },
          { label: 'Acoustic love songs', say: 'acoustic love songs' },
          { label: 'You choose', say: 'whatever songs you pick, because I trust your taste' }
        ]
      },
      {
        id: 'perfect',
        detail: 'Perfect touch',
        prompt: 'What would make the date perfect?',
        note: 'I am taking notes.',
        options: [
          { label: 'Deep conversations', say: 'plenty of deep conversation' },
          { label: 'Lots of laughter', say: 'lots of laughter' },
          { label: 'A little surprise', say: 'a little surprise I planned just for you' },
          { label: 'Stars above us', say: 'a quiet moment under the stars' }
        ]
      },
      {
        id: 'dessert',
        detail: 'Dessert',
        prompt: 'What dessert should we share?',
        note: 'One spoon, two people.',
        options: [
          { label: 'Tiramisu', say: 'a slice of tiramisu' },
          { label: 'Strawberry cheesecake', say: 'strawberry cheesecake' },
          { label: 'Chocolate lava cake', say: 'a chocolate lava cake' },
          { label: 'Ice cream sundae', say: 'a giant ice cream sundae' }
        ]
      },
      {
        id: 'outfit',
        detail: 'My outfit',
        prompt: 'What should I wear to impress you?',
        note: 'Be honest. I can take it.',
        options: [
          { label: 'A sharp suit', say: 'my sharpest suit' },
          { label: 'Stylish casual', say: 'my best smart-casual look' },
          { label: 'Match my outfit', say: 'something that matches your style' },
          { label: 'Surprise me', say: 'a surprise outfit (I promise it will be good)' }
        ]
      },
      {
        id: 'hugs',
        detail: 'Hugs owed',
        prompt: 'How many hugs do you think I deserve?',
        note: 'Choose generously. 🤗',
        options: [
          { label: 'One big hug', say: 'one big warm hug' },
          { label: 'Ten hugs', say: 'ten warm hugs' },
          { label: 'A hundred hugs', say: 'a hundred hugs' },
          { label: 'Unlimited hugs ❤️', say: 'unlimited hugs' }
        ]
      },
      {
        id: 'ready',
        detail: 'Ready?',
        prompt: 'Ready for the best date ever?',
        note: 'Last question, I promise.',
        options: [
          { label: 'Absolutely, yes! ❤️', say: '' },
          { label: 'Born ready 😎', say: '' },
          { label: "Let's go! 🚗", say: '' },
          { label: "Can't wait 🥰", say: '' }
        ]
      }
    ],

    // ---- The ending ----
    FINAL: {
      closing: [
        'Whatever we do and wherever we go, my favourite part will be sitting across from you and watching you smile.',
        'You make ordinary days feel like a story worth telling.'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;           // Node (unit tests)
  } else {
    root.Love = root.Love || {};
    root.Love.Config = Config;         // Browser
  }
})(typeof window !== 'undefined' ? window : globalThis);