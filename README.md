# Unknown Marketing landing page

A responsive, dependency-free link hub with the animated logo intro from the main Unknown Marketing website. Serve this folder with any static web server; no build step required.

The logo fills with color, its apostrophe launches upward, and the landing page appears through a circular reveal. Visitors can skip or replay it. Reduced-motion visitors see the links immediately.

## Add links

Edit `links` in `config.js`. Each item has `title`, `subtitle`, and `url`. Empty URLs display non-clickable Coming soon cards. Set a full `https://` URL, `mailto:` address, or `tel:` number to activate a card.

## Restore the video area

The video placeholder above the links is temporarily hidden until the video is ready. Its original markup remains in `index.html` (the `.video-placeholder` block), and its styling remains in `styles.css`. The `hidden` attribute removes the entire box from the layout without leaving an empty video-sized space.

To restore the original placeholder, remove `hidden` from that block. When the finished video is available, replace the play icon and label with the video player and update the block's accessibility attributes to describe the video. The animated logo intro is separate and continues to work as before.

## Preview locally

Run `python3 -m http.server 8080` in this folder and visit http://localhost:8080.

## Button title lettering

Button titles use `assets/fonts/sunborn-titles.woff`, a small font reconstructed from the exact Sunborn letter outlines exported from a copy of the Brandem Canva logo. The [copied lettering sheet](https://www.canva.com/design/DAHWQvaI9EI/edit) is retained for future updates. The original logo design was preserved.

This asset contains the letters used in the four current button titles, with uppercase and lowercase text mapped to Sunborn's capital letter shapes. It is a lettering subset, not the complete commercial Sunborn font. If a future title needs additional letters, export those letters from the same Canva design and extend the asset. The existing title sizes remain 18px on desktop and 16px on mobile; subtitles and other page text continue to use Antic.

Antic uses Google Fonts with local fallbacks. No analytics, cookies, or visitor uploads are included.
