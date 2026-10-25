'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SiteHeader from './components/SiteHeader'
import HeroParticles from './components/HeroParticles'
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
  { id: 'visual', label: 'Visual', count: 25 },
  { id: 'combat', label: 'Combat', count: 18 },
  { id: 'movement', label: 'Movement', count: 13 },
  { id: 'utility', label: 'Utility & Settings', count: 15 },
]

type Shot = { src: string; w: number; h: number; alt: string }

// solid is shown first; glass is the same gui with the blur turned on
const GUI_MODES: { id: string; label: string; title: string; body: string; glass: Shot; solid?: Shot }[] = [
  {
    id: 'window',
    label: 'Window',
    title: 'one window, every module',
    body: 'categories on the left, toggles and settings on the right. search jumps straight to a module.',
    glass: { src: 'images/gui_glass_window.webp', w: 1919, h: 1079, alt: 'Glass-mode GUI window over Minecraft, showing Visual modules' },
    solid: { src: 'images/gui_window.webp', w: 1919, h: 1079, alt: 'Solid-mode GUI window over Minecraft, showing Visual modules' },
  },
  {
    id: 'clickgui',
    label: 'Click GUI',
    title: 'everything open at once',
    body: 'a panel per category, laid out across the screen. enabled modules light up pink.',
    glass: { src: 'images/gui_glass_clickgui.webp', w: 1919, h: 1079, alt: 'Glass-mode click GUI with Combat, Movement, Visual, Utility and Client panels' },
    solid: { src: 'images/gui_ingame.webp', w: 1919, h: 1079, alt: 'Solid-mode click GUI with Combat, Movement, Visual, Utility and Client panels' },
  },
  {
    id: 'external',
    label: 'External',
    title: 'or keep it out of the game',
    body: 'run the gui as its own window next to minecraft, so nothing is drawn over your screen.',
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

  // scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add(styles.revealed))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add(styles.revealed); io.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // cursor spotlight on cards: each [data-spot] gets --mx/--my relative to itself
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-spot]')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove)
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <SiteHeader />

      <main className={styles.main}>
        <section className={styles.hero}>
          <HeroParticles className={styles.heroParticles} />
          <div className={styles.heroText}>
            <h1 className={styles.title}>TorioGhost</h1>
            <p className={styles.subtitle}>
              A free external ghost client for Minecraft Bedrock
            </p>
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
              <li>windows 10 &amp; 11</li>
            </ul>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="modules-heading" data-reveal>
          <div className={styles.moduleStrip}>
            <div className={styles.moduleTotal}>
              <span id="modules-heading" className={styles.moduleTotalNum}>{TOTAL_MODULES}</span>
              <span className={styles.moduleTotalLabel}>modules, each with its own keybind and settings</span>
            </div>
            <ul className={styles.moduleList}>
              {MODULE_CATEGORIES.map((c) => {
                const body = (
                  <>
                    <span className={styles.moduleCount}>{c.count}</span>
                    <span className={styles.moduleLabel}>{c.label}</span>
                  </>
                )
                return (
                  <li key={c.id}>
                    {DOCS_ENABLED
                      ? <Link href={`/docs?category=${c.id}`} className={`${styles.moduleCard} ${styles.moduleCardLink}`} data-spot>{body}</Link>
                      : <div className={styles.moduleCard} data-spot>{body}</div>}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="gui-heading" data-reveal>
          <header className={styles.sectionHead}>
            <p className={styles.kicker}>interface</p>
            <h2 id="gui-heading" className={styles.sectionTitle}>pick how the gui looks</h2>
            <p className={styles.sectionIntro}>three layouts, glass or solid. switch any time in client settings.</p>
          </header>
          <GuiShowcase />
        </section>

        <section className={styles.section} aria-labelledby="features-heading">
          <header className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>features</p>
            <h2 id="features-heading" className={styles.sectionTitle}>more than a module list</h2>
          </header>

          <div className={styles.bento}>
            <article className={`${styles.tile} ${styles.tileWide}`} data-spot data-reveal>
              <div className={styles.tileText}>
                <h3>hud editor</h3>
                <p>drag the watermark, arraylist, radar, media player and notifications wherever you want them.</p>
              </div>
              <div className={styles.tileMedia}>
                <img src={asset('images/hud_editor.webp')} alt="HUD editor with movable Watermark, ArrayList, Radar, Media Player and Notifications boxes" width={1919} height={1079} loading="lazy" />
              </div>
            </article>

            <article className={styles.tile} data-spot data-reveal style={{ '--d': '80ms' } as React.CSSProperties}>
              <div className={styles.tileText}>
                <h3>version switcher</h3>
                <p>download and swap minecraft versions from the launcher.</p>
              </div>
              <div className={`${styles.tileMedia} ${styles.tileMediaInset}`}>
                <img src={asset('images/version_switcher.webp')} alt="Switch Minecraft Version screen listing versions 26.30 to 26.45" width={767} height={607} loading="lazy" />
              </div>
            </article>

            <article className={`${styles.tile} ${styles.tileWide}`} data-spot data-reveal>
              <div className={styles.tileText}>
                <h3>cosmetics</h3>
                <p>hats, capes, back items and pets, with a live 3d preview and favorites.</p>
              </div>
              <div className={styles.tileMedia}>
                <img src={asset('images/cosmetics.webp')} alt="Cosmetics tab with a 3D preview next to a Minecraft player wearing wings and a bandana" width={1628} height={671} loading="lazy" />
              </div>
            </article>

            <article className={styles.tile} data-spot data-reveal style={{ '--d': '80ms' } as React.CSSProperties}>
              <div className={styles.tileText}>
                <h3>connect and go</h3>
                <p>attach to a running game in one click.</p>
              </div>
              <div className={`${styles.tileMedia} ${styles.tileMediaInset} ${styles.stack}`}>
                <img src={asset('images/loading_screen.webp')} alt="Loading screen with progress bar" width={772} height={614} loading="lazy" className={styles.stackBack} />
                <img src={asset('images/connect_screen.webp')} alt="Connect screen with Connect and Switch Version buttons" width={771} height={610} loading="lazy" className={styles.stackFront} />
              </div>
            </article>
          </div>
        </section>

        <section className={`${styles.section} ${styles.cta}`} aria-labelledby="cta-heading" data-reveal>
          <div className={styles.ctaGlow} aria-hidden="true" />
          <h2 id="cta-heading" className={styles.ctaTitle}>ready when you are</h2>
          <p className={styles.sectionIntro}>grab the latest release and connect to your game.</p>
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
