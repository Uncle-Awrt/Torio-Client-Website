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

// TODO: replace with your real module categories
const MODULE_CATEGORIES = ['combat', 'movement', 'visual', 'player', 'world', 'misc']

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

  return (
    <>
      <div className={styles.container}>
        <SiteHeader />
        <div className={styles.background} />

        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroText}>
              <h1 className={styles.title}>TorioGhost External</h1>
              <p className={styles.subtitle}>external ghost client for minecraft bedrock</p>
              <ul className={styles.heroChips}>
                <li className={styles.heroChip}>60+ modules</li>
                <li className={styles.heroChip}>windows 10 &amp; 11</li>
                <li className={styles.heroChip}>
                  <img src={asset('download.svg')} alt="" className={styles.downloadsIcon} width={18} height={18} aria-hidden="true" />
                  {downloads.toLocaleString()} downloads
                </li>
              </ul>
              <div className={styles.actions}>
                <DownloadButton large exeUrl={exeUrl} zipUrl={zipUrl} latestUrl={latestUrl} />
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.ghostButton}`}>GitHub</a>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.ghostButton}`}>Discord</a>
              </div>
            </div>
            <div className={styles.heroShot}>
              <img src={asset('v2_ingame_gui.png')} alt="Torio Client v2 in-game overlay GUI" width={1600} height={900} />
            </div>
          </section>

          <section className={styles.sectionNarrow} aria-labelledby="modules-heading" data-reveal>
            <h2 id="modules-heading" className={styles.sectionTitle}>60+ modules</h2>
            <p className={styles.sectionIntro}>everything is toggleable from the gui, with per-module keybinds.</p>
            <ul className={styles.moduleChips}>
              {MODULE_CATEGORIES.map((c) => <li key={c} className={styles.moduleChip}>{c}</li>)}
            </ul>
          </section>

          <section className={`${styles.section} ${styles.lastSection}`} aria-labelledby="gui-heading" data-reveal>
            <h2 id="gui-heading" className={styles.sectionTitle}>two ways to run the gui</h2>
            <p className={styles.sectionIntro}>switch between them in settings and use whichever fits the moment.</p>
            <div className={styles.guiGrid}>
              {[
                { src: 'v2_ingame_gui.png', alt: 'Torio Client v2 in-game overlay GUI', title: 'in-game gui', body: 'an overlay drawn on top of the game.' },
                { src: 'v2_external_gui.png', alt: 'Torio Client v2 external window GUI', title: 'external window', body: 'a separate window next to minecraft.' },
              ].map((g) => (
                <div key={g.title} className={styles.guiCard}>
                  <div className={styles.guiImageWrapper}>
                    <img src={asset(g.src)} alt={g.alt} className={styles.guiImage} loading="lazy" width={1600} height={900} />
                  </div>
                  <div className={styles.guiCardContent}>
                    <h3 className={styles.guiCardTitle}>{g.title}</h3>
                    <p className={styles.guiCardBody}>{g.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <p>&copy; 2025 - 2026 TorioGhost External</p>
          <p className={styles.footerNote}>not affiliated with mojang or microsoft. use at your own risk.</p>
          <p className={styles.footerLinks}>
            <a href="https://github.com/Uncle-Awrt/Torio-Client/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>License</a>
            <span aria-hidden="true"> · </span>
            <Link href="/docs" className={styles.footerLink}>Docs</Link>
            <span aria-hidden="true"> · </span>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub</a>
            <span aria-hidden="true"> · </span>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Discord</a>
          </p>
        </footer>
      </div>
    </>
  )
}