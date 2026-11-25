# A Birthday Surprise for Debs

A personal birthday website built with plain HTML, CSS, and JavaScript. It runs as a static site and needs no backend, account, or build step.

## The experience

The page unfolds in six little moments:

1. An animated ASCII cat crosses a starry galaxy, stays to watch, and delivers a birthday note.
2. Opening the note reveals a twilight bouquet and a personal birthday message.
3. A dedicated letter shares a longer birthday message before the memories begin.
4. A scrapbook collage slowly reshuffles its overlapping frames and rotates through the supplied photos and browser-ready videos.
5. An illustrated pastel three-tier cake—with a cat, strawberries, icing, and candles—can be decorated before the visitor makes a wish.
6. An original birthday love poem closes the page.

The appreciation-card section was intentionally left out. Only media supplied with the project is used; photo alt text describes the images, while videos are labeled as personal video memories rather than given invented captions.

## Project structure

```text
index.html
css/
  style.css
js/
  script.js
images/
  photos/
  videos/
```

The scrapbook currently includes the nine JPEG photos in `images/photos/` and eight converted clips in `images/videos/browser-ready/`. It loops through a shuffled queue, slowly reshuffles its overlapping frames with a gentle fade about every sixteen seconds, pauses its automatic movement when out of view, and offers pause/play and manual shuffle controls. Every video currently shown in the collage plays muted and loops while the scrapbook is visible, even as its card moves behind another; the pause control pauses all of them. The frontmost video has controls, and reduced-motion preferences turn off automatic shuffling.

## Run locally

Open the folder in Visual Studio Code and use Live Server (or another local HTTP server) to view the site. Opening `index.html` directly with a `file://` URL may prevent browsers from loading local videos. DM Sans and Playfair Display load from Google Fonts when available; the page falls back to system fonts if offline.

## Media compatibility

The original photos and videos remain in place. The JPEG photos are browser-ready as supplied; the video clips are converted to H.264/AAC MP4 copies for consistent playback. To reconvert after adding or replacing clips, install FFmpeg (`winget install --id Gyan.FFmpeg --exact`) and run `.\scripts\convert-videos.ps1` in PowerShell. Converted copies go to `images/videos/browser-ready/`, which is what the scrapbook uses.

The supplied M4A song is preserved in `audio/`; the site uses its browser-ready MP3 copy at `audio/browser-ready/birthday-song.mp3`. The song starts when the visitor opens the birthday page and can be paused or resumed with the floating music button.

## Accessibility and responsive design

- Buttons and links are keyboard accessible and have visible focus styles.
- Photos include descriptive alternative text.
- Video is muted and has no sound-dependent interaction.
- The soundtrack starts after the visitor's opening click and has a persistent play/pause control.
- Reduced-motion preferences are respected for automatic movement and animations.
- Layouts adapt to mobile and desktop widths without horizontal page scrolling.

The visual style follows the supplied references: blush and cream surfaces, pink accents, lavender and yellow details, dark plum text, hand-drawn scrapbook lettering and doodles, and a pastel pink/yellow/blue cake illustration.
