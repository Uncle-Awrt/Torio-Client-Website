# TorioGhost External website

Next.js (static export) site for TorioGhost External, served from GitHub Pages on torioghost.net.
Docs sources live in `docs-content/` (local only); see `docs-content/_WRITING_GUIDE.md`.

## Who the product is

TorioGhost External is a free, lightweight external ghost client for Minecraft Bedrock, built by one
developer. Its identity comes from the app itself, so the site must use the same things:

- **Mascot:** a round chick (ひよこ, "tori" = bird) drawn as a hot-pink neon outline on black. It is the
  app icon (`public/images/icon.png`). The "TORIO" emblem has the chick's tuft on the wordmark.
- **Tone:** playful and meme-friendly, not edgy-gamer and not corporate. The app ships a bouncing duck
  overlay "to help you stay calm", a poop trail, meme-cat capes, a cat pet that meows, and a 1% easter-egg
  sound when you click the title icon. Copy can be light, but it must be true.
- **Look of the app:** near-black UI, one hot pink (`#ff3d7f`, the app uses `#ff4081`) for toggles and
  active states, Poetsen One for the logo, Lexend Deca for UI text.

## Design rules

The site must look like a person designed it for this product, not like it was generated.
When in doubt, choose the plainer option.

### Never use
- Glowing/neon `text-shadow` on text, gradient-filled buttons, glassmorphism cards
- Bento grids, "eyebrow" kickers (small uppercase labels above headings), floating blurred orbs,
  particle or aurora backgrounds, cursor spotlights, tilt-on-hover
- Vague marketing copy ("more than a module list", "ready when you are", "seamless", "powerful")
- All-lowercase headings used as a style; emoji as icons

### Do
- Let the product be the visual: the chick mascot, real screenshots and real things from the client
  (its toggles, ArrayList, HUD, the duck) at real size, not decoration
- Copy states facts a player cares about: module names, supported versions (26.30–26.60), Windows 10/11,
  free. Short sentences, normal capitalisation.
- Pink is the accent only: primary button, links, active states, the mascot. Everything else neutral.
- Hierarchy from size and weight, not effects. Spacing on an 8px grid.
- Fewer sections, each with one job. Remove anything that only fills space.
- Motion only when it is something the app really does (e.g. the duck walking). No ambient animation.
  Respect `prefers-reduced-motion`.

### Before finishing any visual change
- Screenshot at 1920x1080 and ~390px wide and look at both.
- Ask: "Would a reader guess this was AI-generated?" If yes, simplify.
- Reference sites for restraint and clarity (not their visuals): linear.app, raycast.com, lunarclient.com.

## Working notes
- `npm run build` must pass before committing. Commit and push only when asked.
- `data/downloads.json` is updated hourly by a bot; take the remote version when rebasing.
