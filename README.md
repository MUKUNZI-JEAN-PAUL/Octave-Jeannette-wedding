# Jeannette & Octave — Wedding Invitation

A single-page digital wedding invitation (dark ceremony theme, entry gate, video hero, order-of-day timeline, embedded map, and an RSVP that emails replies directly to the couple). Built with React + Vite.

## 1. Personalize the content

Open `src/App.jsx` and edit the `CONFIG` object at the top:

- `partner1`, `partner2`, `weddingDateISO`, `weddingDayLine`, `weddingDateDisplay`, `city`
- `introLines` — the poetic lines at the top; wrap a phrase in `*asterisks*` to italicize it
- `greeting`, `localWelcome`
- `schedule` — one entry per part of the day; each can have its own list of sub-times in `items` (leave `items: []` to hide the sub-list)
- `galleryTitle`, `venueName`, `mapQuery`, `dressCode`, `rsvpBy`, `whatsappNumber`

## 2. Add real media (optional but recommended)

Drop files into the `public/` folder with these exact names:

| File | Used for |
|---|---|
| `public/hero.mp4` + `public/hero-poster.jpg` | Background video on the hero section (falls back to a plain dark background if missing) |
| `public/audio/music.mp3` | Background music, started when the guest taps "Tap to open" (the music button is hidden automatically if this file is missing) |
| `public/gallery-1.jpg` – `gallery-4.jpg` | The "Us, Lately" gallery |
| `public/og-image.jpg` | The preview image shown when the link is shared on WhatsApp/social |

Until a file exists, that spot shows a labeled placeholder (or is hidden entirely, for video/audio) instead of breaking.

Keep the hero video short (10–20 seconds, looped) and compressed — under 10MB loads much faster on mobile data.

## 3. Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

**Note on the RSVP form:** it emails replies via FormSubmit.co (see "Check your RSVP replies" below), which works from any host, including local `npm run dev` preview — no need to wait until you deploy to test it.

## 4. Deploy to Netlify

**Option A — drag and drop (fastest):**

```bash
npm install
npm run build
```

Then go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the generated `dist/` folder onto the page. Netlify gives you a live URL immediately.

**Option B — connect a Git repository (recommended if you'll keep editing):**

1. Push this folder to a GitHub/GitLab repository.
2. In Netlify, "Add new site" → "Import an existing project" → pick the repo.
3. Build settings are already set via `netlify.toml` — Netlify detects them automatically.
4. Every future push updates the live site.

## 5. Check your RSVP replies

RSVPs are emailed directly using [FormSubmit.co](https://formsubmit.co) — a free service, no account or dashboard login needed by anyone. In `src/App.jsx`, set:

```js
rsvpEmail: "jeanette@example.com",   // required — replies are sent here
rsvpCcEmail: "octave@example.com",   // optional — also cc'd; leave "" to skip
```

**One-time activation step:** the very first RSVP anyone submits after you deploy will NOT arrive as a normal reply. Instead, FormSubmit sends an email to `rsvpEmail` asking to confirm you want to receive form submissions — someone needs to open that email and click "Confirm" once. Every submission after that arrives normally, straight to the inbox, with no dashboard to check.

This also means RSVPs work no matter where you host the site (Netlify, Vercel, GitHub Pages, anywhere) — it's not tied to Netlify specifically.

## Notes

- The "Tap to open" entry screen exists partly for effect and partly because browsers only allow audio to autoplay after a person interacts with the page — this is why music starts on that tap rather than automatically.
- The map embed needs no API key; it uses `mapQuery` to search Google Maps.
- Nothing here requires a paid plan — Netlify's free tier covers hosting and up to 100 form submissions a month, which is plenty for a wedding.
