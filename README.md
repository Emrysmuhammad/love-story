# 💌 Love Story

A romantic, interactive webpage you can send to someone special. It is not a normal page: it unfolds like a small love story, with a heartfelt poem, floating hearts, soft music, twelve questions answered one at a time, a **"No" button that cannot be clicked**, and a personalized romantic ending built from the answers.

Built with vanilla **HTML, CSS and JavaScript**. No frameworks, no build step, no tracking.

---

## Table of Contents

1. [The Experience](#the-experience)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Make It Yours](#make-it-yours)
7. [How It Works](#how-it-works)
8. [Accessibility](#accessibility)
9. [Testing](#testing)
10. [Sharing It With Her](#sharing-it-with-her)
11. [Troubleshooting](#troubleshooting)
12. [Browser Support](#browser-support)
13. [Credits and Licensing](#credits-and-licensing)
14. [Commit History Guide](#commit-history-guide)
15. [Roadmap](#roadmap)
16. [Contributing](#contributing)
17. [License](#license)

---

## The Experience

1. **The poem.** A glowing moon, a framed photo and a poem that fades in line by line, praising her beauty, her smile and her eyes, and describing her as more beautiful than moonlight. A glowing **Continue** button appears when the last line lands.
2. **The questions.** Twelve questions, **one at a time**, each sliding in as the last one slides out. A progress bar fills as she goes and the photo changes every three questions.
3. **The first question** is *"Would you go on a date with me?"* The **Yes ❤️** button works normally. The **No 😔** button jumps away the instant the pointer gets close, no matter how hard she chases it, and gets a funny comment every time. Yes grows a little with every escape.
4. **The finale.** A personalized romantic message built from her answers, a "date plan" card, photos, a closing message and a burst of confetti hearts.

### The questions

| #  | Question                                | Options                                                      |
| -- | --------------------------------------- | ------------------------------------------------------------ |
| 1  | Would you go on a date with me?         | Yes ❤️ / No 😔 (impossible to click)                          |
| 2  | What day would work best for you?       | Friday, Saturday, Sunday, Any day with you ❤️                 |
| 3  | What time are you free?                 | Morning, Afternoon, Evening, Anytime                         |
| 4  | Where should we go?                     | Fancy restaurant, Beach walk, Movie night, Anywhere together |
| 5  | What should I bring?                    | Chocolate, Ice Cream, Cake, All of the above                 |
| 6  | Which flower do you like most?          | Rose, Tulip, Sunflower, Lily                                 |
| 7  | What kind of music shall we listen to?  | Romantic classics, Soft jazz, Acoustic love songs, You choose |
| 8  | What would make the date perfect?       | Deep conversations, Lots of laughter, A little surprise, Stars above us |
| 9  | What dessert should we share?           | Tiramisu, Strawberry cheesecake, Chocolate lava cake, Ice cream sundae |
| 10 | What should I wear to impress you?      | A sharp suit, Stylish casual, Match my outfit, Surprise me   |
| 11 | How many hugs do you think I deserve?   | One, Ten, A hundred, Unlimited ❤️                             |
| 12 | Ready for the best date ever?           | Absolutely, Born ready, Let's go, Can't wait                 |

---

## Features

- Floating, falling and drifting **hearts, pearls and sparkles** that travel in different directions, vary in size and color, and keep red as the dominant color
- Romantic **background music** that loops, fades in softly, starts at a comfortable volume and has play/pause and volume controls
- Elegant typography: script titles, serif poem text and a clean sans-serif for buttons
- A **poem** that fades in line by line
- Questions shown **one at a time** with smooth slide transitions and a progress bar
- A **No button that dodges** mouse pointers, finger taps and keyboard focus
- A **personalized ending** built from the answers, plus a "date plan" card
- **Confetti hearts**, sparkles and a more festive particle mode on the final screen
- Photos with **alt text** and a graceful fallback card when an image cannot load
- Fully responsive for phones, tablets and desktops
- Respects `prefers-reduced-motion`
- No frameworks, no tracking, no data leaves the browser

---

## Tech Stack

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Markup     | HTML5 (semantic sections, ARIA attributes)            |
| Styling    | CSS3 (custom properties, grid, flexbox, keyframes)    |
| Logic      | Vanilla JavaScript (ES2015+)                          |
| Audio      | HTML `Audio` element with source fallbacks            |
| Fonts      | Google Fonts: Great Vibes, Playfair Display, Quicksand |
| Testing    | Node.js built-in test runner (`node:test`)            |

---

## Project Structure

```
love-story/
├── index.html           # Three screens, music control, particle layer
├── css/
│   ├── base.css         # Palette, typography, animated background
│   ├── effects.css      # Particle and confetti animations
│   ├── screens.css      # Transitions, poem, buttons, photos, music control
│   ├── quiz.css         # Question card, options, the escaping No button
│   └── final.css        # Final screen, gallery, responsive, reduced motion
├── js/
│   ├── config.js        # ALL content: names, poem, questions, photos, music
│   ├── particles.js     # Ambient floating hearts, pearls and sparkles
│   ├── confetti.js      # Confetti hearts bursts
│   ├── images.js        # Photo helper with alt text and fallback card
│   ├── music.js         # Looping music player with autoplay handling
│   ├── quiz.js          # One-at-a-time question flow (pure logic)
│   ├── escape.js        # The No button that cannot be clicked
│   ├── summary.js       # Personalized message builder (pure logic)
│   └── main.js          # Wires screens, buttons and effects together
├── assets/              # Put your own music.mp3 and photos here
├── tests/
│   ├── quiz.test.js
│   ├── summary.test.js
│   └── config.test.js
├── package.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- Any modern web browser
- (Optional) [Node.js](https://nodejs.org/) 18 or newer, only needed to run the tests

### Run it

```bash
git clone https://github.com/<your-username>/love-story.git
cd love-story
```

Then open it:

```bash
# Windows
start index.html
# macOS
open index.html
# Linux
xdg-open index.html
```

Or use the VS Code **Live Server** extension, or any static server such as `python -m http.server 8000`.

---

## Make It Yours

Everything personal is in **`js/config.js`**. You never need to touch another file.

### Names

```js
HER_NAME: 'Amara',   // shows "For Amara" and "Perfect, Amara!"
HIS_NAME: 'Daniel',  // signs the ending "Yours, Daniel"
```

Leave them empty and the page says "you" and "Yours, always".

### The poem

Edit `POEM.title` and `POEM.stanzas`. Each stanza is an array of lines, and each line fades in one after another.

### The questions

Each question looks like this:

```js
{
  id: 'flower',
  detail: 'Flowers',                       // heading in the "Our date plan" card
  prompt: 'Which flower do you like most?',
  note: 'Flowers for someone prettier than all of them.',   // small line under the question
  options: [
    { label: 'Rose',  say: 'beautiful roses' },
    { label: 'Tulip', say: 'elegant tulips' }
  ]
}
```

- `label` is what the button shows.
- `say` is the fragment used to build the final message, so it must read naturally inside a sentence.
- Keep the ids `date`, `day`, `time`, `place`, `gift`, `flower`, `music`, `perfect`, `dessert`, `outfit` and `hugs` if you want them to appear in the personalized message. Extra questions with new ids still show up in the date plan card.

### Photos

```js
photo('keywords,here', 21, 'Alt text describing the picture')
```

Or replace any entry with your own:

```js
{ src: 'assets/us.jpg', alt: 'The two of us laughing at the beach' }
```

Put your own photos in the `assets/` folder for the best result. Always write alt text: it is shown if the image cannot load.

### Music

`MUSIC.SOURCES` is tried in order until one loads. The most reliable choice is your own song:

1. Copy an MP3 into `assets/` and name it `music.mp3`.
2. Make sure `'assets/music.mp3'` is in the list (it is by default).

Change `MUSIC.VOLUME` (0 to 1) for the starting volume. It defaults to a comfortable `0.35`.

---

## How It Works

### The escaping No button

`js/escape.js` makes the button impossible to click with four layers:

1. **Proximity:** a `pointermove` listener measures the distance from the pointer to the button. Inside 110 px it jumps to a new random spot.
2. **Smart landing spot:** the new spot is far from the pointer, away from the previous position and never on top of the Yes button. If 40 random tries all fail, it picks the screen corner farthest from the pointer.
3. **Touch and click:** a press that lands near it makes it jump, and a `click` is cancelled. Keyboard focus also makes it hop away, so Tab and Enter cannot reach it either.
4. **Free to roam:** on the first escape the button moves to `<body>` and becomes `position: fixed`, so it can run anywhere on screen. A placeholder keeps the layout steady so Yes does not shift.

The Yes button grows by 3% with every escape (up to 35% bigger), which makes the chase both funnier and kinder.

### Particles

`js/particles.js` spawns one element at a time on a timer. Each gets a random route from six (rising, falling, drifting left or right, and two diagonals), a random size, color, speed and sway. Reds make up the majority of heart colors. A cap on simultaneous particles (18 on phones, 30 on larger screens) keeps it smooth, and spawning pauses when the tab is hidden. The finale switches to a faster, denser "celebrate" mode.

### Music and autoplay

The player tries to start immediately. Browsers refuse to play sound before the visitor interacts with the page, so if autoplay is blocked the button pulses and the music begins on the **very first tap, click or key press** (usually **Continue**). If a source fails to load it moves to the next one, and if the internet comes back it tries again. The track loops forever and fades in over 2.5 seconds.

### The personalized message

`js/summary.js` builds the ending from the `say` fragments of the chosen answers. It joins what is known, skips what is missing and never prints blanks, for example:

> Perfect! I've taken notes on everything. I'll pick you up on Saturday in the evening, and we'll head to a fancy candlelit restaurant. I'll bring beautiful roses, and I'll make sure there's plenty of chocolate waiting for you. … Until then, keep looking as beautiful as you always do. I can't wait to spend time with you.

### Design decisions

- **Logic and display are separate.** `quiz.js` and `summary.js` have no DOM code, so they run in Node for testing.
- **No ES modules.** Each file is an IIFE that attaches to `window.Love`, so the page also works when opened straight from `file://`.
- **Content in one file.** Personalizing never requires touching logic or styles.
- **Optional things fail softly:** music, photos and fonts all have fallbacks.

---

## Accessibility

- Every photo has alt text, and a failed photo is replaced by a card that shows that text
- Screen headings receive focus when a screen changes
- The progress bar uses `role="progressbar"` and live values
- The No button's jokes are announced through a polite live region
- Visible keyboard focus rings
- `prefers-reduced-motion` turns off particles and confetti, and shows everything immediately

---

## Testing

The pure logic is covered by unit tests, so there is nothing to install:

```bash
npm test
```

(or simply `node --test`)

| Test file          | What it covers                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `quiz.test.js`     | One-at-a-time flow, recording answers, progress, invalid input, finishing, reset         |
| `summary.test.js`  | Message wording, name handling, missing answers, no "undefined", date plan order         |
| `config.test.js`   | 10 to 12 questions, Yes/No setup, unique ids, `say` fragments, alt text, music fallbacks |

---

## Sharing It With Her

The page is static, so hosting it is free. **GitHub Pages:**

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After a minute it is live at `https://<your-username>.github.io/love-story/`. Send her that link. 💌

Tip: open the link on your own phone first and play through it once. If you do not want strangers to find it, keep the repository private (Pages for private repos needs a paid GitHub plan) or use another static host.

---

## Troubleshooting

| Problem                             | What to do                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| No music at first                   | Normal: browsers wait for a tap. Press the pulsing ♪ button or tap anywhere.                             |
| Music button shows ✕                | None of the sources loaded. Add your own `assets/music.mp3`, then click the button to retry.            |
| A photo shows a pink card with text | The image could not load. Replace its URL in `config.js` with your own file in `assets/`.               |
| Different photos on each visit      | The default photos come from a keyword service. Use your own photos for a fixed result.                 |
| Fonts look different                | Google Fonts could not load (offline). Fallback fonts are used and everything still works.              |
| Few or no floating hearts           | Your device may have "reduce motion" enabled. The page respects that setting.                           |

---

## Browser Support

Current versions of Chrome, Edge, Firefox and Safari on desktop and mobile. It needs ES2015 classes, CSS custom properties and the `Audio` element.

---

## Credits and Licensing

- **Fonts:** Great Vibes, Playfair Display and Quicksand via Google Fonts (SIL Open Font License).
- **Photos:** the default photos are fetched from [LoremFlickr](https://loremflickr.com/), which serves random Creative Commons photos from Flickr. Each photo has its own license. That is fine for a private gesture, but if you publish the page widely use your own photos or properly credited ones.
- **Music:** the example links point to public sources. Check the license of any track you use and credit the artist where required. For a personal gift, a song you own or love is the best choice.
- **Poem:** original, written for this project. Feel free to rewrite it in your own words.

---

## Commit History Guide

The project was built module by module, one commit per step:

| #  | Type    | What it added                                                    |
| -- | ------- | ---------------------------------------------------------------- |
| 1  | `chore` | Repository initialization, `.gitignore` and assets folder        |
| 2  | `docs`  | Initial README skeleton                                          |
| 3  | `feat`  | HTML structure for the three screens                             |
| 4  | `style` | Palette, typography and animated background                      |
| 5  | `style` | Particle and confetti animations                                 |
| 6  | `feat`  | Content config: poem, questions, photos, music                   |
| 7  | `feat`  | Floating hearts, pearls and sparkles                             |
| 8  | `feat`  | Confetti hearts                                                  |
| 9  | `feat`  | Image helper with alt text and fallback card                     |
| 10 | `feat`  | Looping music player with autoplay handling                      |
| 11 | `style` | Screen transitions, poem, buttons, photos, music control         |
| 12 | `feat`  | One-at-a-time quiz logic                                         |
| 13 | `feat`  | The escaping No button                                           |
| 14 | `style` | Quiz card, options and No button styles                          |
| 15 | `feat`  | Personalized summary builder                                     |
| 16 | `style` | Final screen, gallery, responsive and reduced motion             |
| 17 | `test`  | Unit tests for quiz, summary and config                          |
| 18 | `feat`  | Main script that brings everything to life                       |
| 19 | `chore` | `package.json` with test script                                  |
| 20 | `docs`  | This detailed README                                             |
| 21 | `chore` | MIT license                                                      |

Commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) style.

---

## Roadmap

- [ ] Typewriter effect for the poem
- [ ] Optional password or secret link before the poem
- [ ] "Copy our date plan" or share button on the final screen
- [ ] Choose-your-own song picker
- [ ] A save-the-date calendar file (`.ics`) download
- [ ] More languages

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes and run `npm test`
4. Commit with a clear message: `git commit -m "feat: describe your change"`
5. Push and open a Pull Request

---

## License

Released under the [MIT License](LICENSE).