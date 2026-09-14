# torio client website

source for the Torio Client site. next.js 16, plain css modules, no ui kit.

the download counter and release links in `data/downloads.json` refresh on their own via the
github action in `.github/workflows/update-downloads.yml`, it scrapes the client repo's releases
every few hours and commits the new numbers.

module docs live in `data/public-docs.json`, one entry per module with a markdown `content` body.
the docs page renders that with marked.

## running it

```bash
npm install
npm run dev
```

then open http://localhost:3000.

build for production with `npm run build` and serve with `npm start`.

## structure

- `app/page.tsx` - the landing page
- `app/docs/` - module documentation, fed by `data/public-docs.json`
- `app/components/SiteHeader.tsx` - shared header
- `data/` - downloads counter + docs content
- `scripts/fetch-downloads.mjs` - what the workflow runs
- `public/images/` - client screenshots and the icon

## notes

support questions do not belong in this repo's issues. the client's discord
(https://discord.gg/xq8sWQhuXG) is the support channel for both the client and this site.
