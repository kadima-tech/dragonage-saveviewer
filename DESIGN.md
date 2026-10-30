# Design

The visual design is by Alexander van Bergen (StinStin), from 2014. Keep it intact; this is a revival, not a redesign.

## Layout

- A full-viewport background illustration (`src/assets/bg.jpg`) is fixed to the bottom right and fills the left side of the page.
- All content sits in a right-aligned column, 675px wide (`max-width: 100%` on small screens), anchored to the bottom right. Views add 50px horizontal padding inside it.
- Text is right-aligned throughout. Views that can overflow (About, Results) scroll vertically within the column.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| Accent red | `#b30201` | Subtitles, chapter headings, active nav item, title accent, error messages, drop-zone hover border |
| Deep red | `#790101` | Bottom of the Browse button gradient |
| Text | `#000` | Body copy and nav links |
| Muted | `#aaa` | Upload placeholder, drop-zone border |
| Dark button | `#333` → `#111` | Upload button gradient |
| Surface | `#fff` | Drop zone |

## Typography

- Headings and navigation: **Cinzel 700** (Google Fonts). H1 28px; H2 20px in accent red.
- Body: **PT Sans** 16px (Google Fonts).

## Components

- **Upload box**: a white inset-shadow drop zone, rounded on the left, with a red gradient "Browse" button inside, joined to a dark gradient "Upload" button on the right. Dragging a file over it turns the border accent red. Both buttons open the file picker; dropping a file uploads it directly.
- **Navigation**: Cinzel links separated by " • "; the active link is accent red.
- **Status / errors**: loading states are Cinzel H2s in accent red; errors are bold accent-red paragraphs under the upload box.

## Implementation

Styles are co-located with components via styled-components (v6). Transient props are prefixed with `$` (e.g. `$hover`). There is no global stylesheet beyond the body reset in `src/index.css`.

## Voice

First-person and explanatory (About page), aimed at Dragon Age players who want to carry their choices into Inquisition.
