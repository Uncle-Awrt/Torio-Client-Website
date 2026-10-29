'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SiteHeader from './components/SiteHeader'
import styles from './page.module.css'
import downloadsData from '../data/downloads.json'

const FALLBACK_DOWNLOADS = 1414
const REPO_RELEASES_URL = 'https://github.com/Uncle-Awrt/Torio-Client/releases/latest'
const DISCORD_URL = 'https://discord.gg/xq8sWQhuXG'
const GITHUB_URL = 'https://github.com/Uncle-Awrt/Torio-Client'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const asset = (path: string) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`

const DOCS_ENABLED = !!process.env.NEXT_PUBLIC_DOCS_ENABLED

const TOTAL_MODULES = '70+'
const MODULE_CATEGORIES = [
  { id: 'combat', label: 'Combat', count: 18, examples: ['Aim Assist', 'TriggerBot', 'Reach', 'Auto Crystal'] },
  { id: 'movement', label: 'Movement', count: 14, examples: ['Velocity', 'Clutch', 'Toggle Sprint', 'Timer'] },
  { id: 'visual', label: 'Visual', count: 27, examples: ['ESP', 'NameTag', 'Emote', 'Radar'] },
  { id: 'utility', label: 'Utility & Settings', count: 15, examples: ['Blink', 'Stream Hide', 'Ore Miner', 'Auto 360'] },
]

// features shown as alternating screenshot / text rows
const FEATURES = [
  {
    title: 'HUD Editor',
    body: 'Drag the watermark, Array List, Radar, media player and notifications anywhere on screen, and resize them.',
    img: { src: 'images/hud_editor.webp', w: 1919, h: 1079, alt: 'HUD editor with movable Watermark, ArrayList, Radar, Media Player and Notifications boxes' },
  },
  {
    title: 'Emotes',
    body: 'Hold B to open the emote wheel: 30 emotes from a wave to a breakdown dance, on five pages. Your cosmetics follow the pose.',
    img: { src: 'images/emote_wheel.webp', w: 1600, h: 1000, alt: 'Emote wheel open over the game, on the Party page with Shuffle selected' },
  },
  {
    title: 'Cosmetics',
    body: 'Hats, capes, wings and pets on your own character, with a 3D preview. Only you see them.',
    img: { src: 'images/cosmetics.webp', w: 1628, h: 671, alt: 'Cosmetics tab with a 3D preview next to a Minecraft player wearing wings and a bandana' },
  },
  {
    title: 'Version Switcher',
    body: 'Download and install any supported Minecraft version from the connect screen.',
    img: { src: 'images/version_switcher.webp', w: 767, h: 607, alt: 'Switch Minecraft Version screen listing versions' },
  },
  {
    title: 'Connect in one click',
    body: 'Start Minecraft, press Connect, and the GUI opens. Close the game and the client waits for the next one.',
    img: { src: 'images/connect_screen.webp', w: 771, h: 610, alt: 'Connect screen with Connect and Switch Version buttons' },
  },
]

type Shot = { src: string; w: number; h: number; alt: string }

// solid is shown first; glass is the same gui with the blur turned on
const GUI_MODES: { id: string; label: string; title: string; body: string; glass: Shot; solid?: Shot }[] = [
  {
    id: 'window',
    label: 'Window',
    title: 'One window, every module',
    body: 'Categories on the left, toggles and settings on the right. Search jumps straight to a module.',
    glass: { src: 'images/gui_glass_window.webp', w: 1919, h: 1079, alt: 'Glass-mode GUI window over Minecraft, showing Visual modules' },
    solid: { src: 'images/gui_window.webp', w: 1919, h: 1079, alt: 'Solid-mode GUI window over Minecraft, showing Visual modules' },
  },
  {
    id: 'clickgui',
    label: 'Click GUI',
    title: 'Every category open at once',
    body: 'One panel per category across the screen. Enabled modules light up pink.',
    glass: { src: 'images/gui_glass_clickgui.webp', w: 1919, h: 1079, alt: 'Glass-mode click GUI with Combat, Movement, Visual, Utility and Client panels' },
    solid: { src: 'images/gui_ingame.webp', w: 1919, h: 1079, alt: 'Solid-mode click GUI with Combat, Movement, Visual, Utility and Client panels' },
  },
  {
    id: 'external',
    label: 'External',
    title: 'Or keep it out of the game',
    body: 'Run the GUI as its own window next to Minecraft, so nothing is drawn over the game.',
    glass: { src: 'images/gui_external_side.webp', w: 1633, h: 689, alt: 'External GUI window running next to the Minecraft window' },
  },
]

function DownloadButton({ large, exeUrl, zipUrl, latestUrl }: { large?: boolean; exeUrl: string | null; zipUrl: string | null; latestUrl: string }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const cls = `${styles.button} ${styles.downloadButton} ${large ? styles.buttonLarge : ''}`

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus() }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  if (!(exeUrl && zipUrl)) return <a href={latestUrl} className={cls}>Download</a>

  return (
    <div className={styles.downloadWrapper} ref={wrapRef}>
      <button ref={btnRef} type="button" className={cls} onClick={() => setOpen((o) => !o)} aria-haspopup="true" aria-expanded={open}>
        Download
        <span className={`${styles.downloadCaret} ${open ? styles.caretOpen : ''}`} aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className={styles.downloadMenu}>
          <a href={exeUrl} download className={styles.downloadMenuItem} onClick={() => setOpen(false)}>
            <span className={styles.downloadMenuLabel}>.exe</span>
            <span className={styles.downloadMenuHint}>windows standalone</span>
          </a>
          <a href={zipUrl} download className={styles.downloadMenuItem} onClick={() => setOpen(false)}>
            <span className={styles.downloadMenuLabel}>.zip</span>
            <span className={styles.downloadMenuHint}>portable archive</span>
          </a>
        </div>
      )}
    </div>
  )
}

function GuiShowcase() {
  const [modeId, setModeId] = useState(GUI_MODES[0].id)
  const [glass, setGlass] = useState(false)
  const mode = GUI_MODES.find((m) => m.id === modeId) ?? GUI_MODES[0]
  const shot = !glass && mode.solid ? mode.solid : mode.glass

  return (
    <div className={styles.showcase}>
      <div className={styles.showcaseBar}>
        <div className={styles.tabs} role="tablist" aria-label="GUI modes">
          {GUI_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={m.id === modeId}
              className={`${styles.tab} ${m.id === modeId ? styles.tabActive : ''}`}
              onClick={() => setModeId(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.showcaseFrame} role="tabpanel">
        {/* blurred copy fills the letterbox when the screenshot isn't 16:9 */}
        <div className={styles.showcaseBackdrop} style={{ backgroundImage: `url(${asset(shot.src)})` }} aria-hidden="true" />
        <img key={shot.src} src={asset(shot.src)} alt={shot.alt} width={shot.w} height={shot.h} className={styles.showcaseImage} loading="lazy" />
      </div>

      <div className={styles.showcaseCaption}>
        <div className={styles.showcaseText}>
          <h3>{mode.title}</h3>
          <p>{mode.body}</p>
        </div>
        {/* under the image so it reads as "change this picture" */}
        {mode.solid && (
          <div className={styles.themeSwitch} role="group" aria-label="GUI style">
            {[false, true].map((g) => (
              <button
                key={String(g)}
                type="button"
                aria-pressed={glass === g}
                className={`${styles.themeOption} ${glass === g ? styles.themeOptionActive : ''}`}
                onClick={() => setGlass(g)}
              >
                {g ? 'glass' : 'solid'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const downloads = downloadsData.downloads ?? FALLBACK_DOWNLOADS
  const latestUrl = downloadsData.latestUrl || REPO_RELEASES_URL
  const exeUrl = downloadsData.exeUrl ?? null
  const zipUrl = downloadsData.zipUrl ?? null

  const onMascotClick = () => {
    if (Math.random() < 0.01) new Audio(asset('sounds/easteregg.wav')).play().catch(() => {})
  }

  return (
    <div className={styles.container}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <SiteHeader />

      <main className={styles.main}>
        <section className={styles.hero}>
          {/* the app icon; like in the client, clicking it has a 1% chance of the easter-egg sound */}
          <button type="button" className={styles.mascot} onClick={onMascotClick} aria-label="Torio">
            <img src={asset('images/icon.png')} alt="" width={256} height={256} />
          </button>
          <div className={styles.heroText}>
            <h1 className={styles.title}>TorioGhost</h1>
            <p className={styles.subtitle}>A free external ghost client for Minecraft Bedrock</p>
            <div className={styles.actions}>
              <DownloadButton large exeUrl={exeUrl} zipUrl={zipUrl} latestUrl={latestUrl} />
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.ghostButton}`}>GitHub</a>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.ghostButton}`}>Discord</a>
            </div>
            <ul className={styles.heroMeta}>
              <li>
                <img src={asset('download.svg')} alt="" className={styles.downloadsIcon} width={16} height={16} aria-hidden="true" />
                {downloads.toLocaleString()} downloads
              </li>
              <li>Bedrock 26.30 – 26.60</li>
              <li>Windows 10 &amp; 11</li>
            </ul>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="modules-heading">
          <header className={styles.sectionHead}>
            <h2 id="modules-heading" className={styles.sectionTitle}>{TOTAL_MODULES} modules</h2>
            <p className={styles.sectionIntro}>Every module has its own toggle key and settings.</p>
          </header>
          <ul className={styles.moduleList}>
            {MODULE_CATEGORIES.map((c) => {
              const body = (
                <>
                  <span className={styles.moduleHead}>
                    <span className={styles.moduleLabel}>{c.label}</span>
                    <span className={styles.moduleCount}>{c.count}</span>
                  </span>
                  <span className={styles.moduleExamples}>{c.examples.join(', ')}, …</span>
                </>
              )
              return (
                <li key={c.id}>
                  {DOCS_ENABLED
                    ? <Link href={`/docs?category=${c.id}`} className={`${styles.moduleCard} ${styles.moduleCardLink}`}>{body}</Link>
                    : <div className={styles.moduleCard}>{body}</div>}
                </li>
              )
            })}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="gui-heading">
          <header className={styles.sectionHead}>
            <h2 id="gui-heading" className={styles.sectionTitle}>Three ways to use the GUI</h2>
            <p className={styles.sectionIntro}>In game as a window or a click GUI, or as a separate window next to Minecraft. Solid or glass.</p>
          </header>
          <GuiShowcase />
        </section>

        <section className={styles.section} aria-labelledby="features-heading">
          <header className={styles.sectionHead}>
            <h2 id="features-heading" className={styles.sectionTitle}>Also in the client</h2>
          </header>
          <div className={styles.features}>
            {FEATURES.map((f) => (
              <article key={f.title} className={styles.feature}>
                <div className={styles.featureMedia}>
                  <img src={asset(f.img.src)} alt={f.img.alt} width={f.img.w} height={f.img.h} loading="lazy" />
                </div>
                <div className={styles.featureText}>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.cta}`} aria-labelledby="cta-heading">
          <h2 id="cta-heading" className={styles.sectionTitle}>Download TorioGhost</h2>
          <p className={styles.sectionIntro}>Free. Windows 10 and 11. Minecraft Bedrock 26.30 – 26.60.</p>
          <div className={`${styles.actions} ${styles.ctaActions}`}>
            <DownloadButton large exeUrl={exeUrl} zipUrl={zipUrl} latestUrl={latestUrl} />
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.ghostButton}`}>Join the Discord</a>
          </div>
          <p className={styles.safeNote}>
            Antivirus warning? <Link href="/docs?category=start&module=IsItSafe">Why it happens and how to check the file</Link>
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <img src={asset('images/icon.png')} alt="" width={22} height={22} />
            <span>TorioGhost External</span>
          </div>
          <p className={styles.footerLinks}>
            <a href="https://github.com/Uncle-Awrt/Torio-Client/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>License</a>
            {DOCS_ENABLED && <Link href="/docs" className={styles.footerLink}>Docs</Link>}
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub</a>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Discord</a>
          </p>
        </div>
        <p className={styles.footerNote}>&copy; 2025 - 2026 TorioGhost External. not affiliated with mojang or microsoft. use at your own risk.</p>
      </footer>
    </div>
  )
}
