'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteHeader from './components/SiteHeader'
import styles from './page.module.css'
import downloadsData from '../data/downloads.json'

const FALLBACK_DOWNLOADS = 1414
const REPO_RELEASES_URL = 'https://github.com/Uncle-Awrt/Torio-Client/releases/latest'
const DISCORD_URL = 'https://discord.gg/xq8sWQhuXG'
const GITHUB_URL = 'https://github.com/Uncle-Awrt/Torio-Client'

let hasLoadedGlobal = false

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const asset = (path: string) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`


const CORE_FEATURES = [
  {
    badge: 'connect',
    title: 'the connect screen does the work',
    image: asset('/images/connectscreen.png'),
    alt: 'Torio Client connect screen detecting a running Minecraft Bedrock process',
  },
  {
    badge: 'version switcher',
    title: 'switch versions without launchers',
    image: asset('/images/versionswitcher.png'),
    alt: 'Torio Client built-in version switcher listing supported Minecraft Bedrock versions',
  },
  {
    badge: 'loading',
    title: 'hooked in seconds',
    image: asset('/images/loadingscreen.png'),
    alt: 'Torio Client loading screen scanning game memory after connect',
  },
]


const GUIDE_STEPS = [
  {
    badge: '01',
    title: 'download',
    body: 'grab the latest .exe or portable .zip release.',
  },
  {
    badge: '02',
    title: 'connect',
    body: 'launch bedrock, then open torio to hook in.',
  },
  {
    badge: '03',
    title: 'configure',
    body: 'toggle modules, set keybinds, and save your config.',
  },
]

export default function Home() {
  const [displayedText, setDisplayedText] = useState(hasLoadedGlobal ? 'Torio Client' : '')
  const [showMainContent, setShowMainContent] = useState(hasLoadedGlobal)
  const [loadingFadeOut, setLoadingFadeOut] = useState(hasLoadedGlobal)

  const downloads = downloadsData.downloads ?? FALLBACK_DOWNLOADS
  const latestUrl = downloadsData.latestUrl || REPO_RELEASES_URL
  const exeUrl = downloadsData.exeUrl ?? null
  const zipUrl = downloadsData.zipUrl ?? null

  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false)

  const fullText = 'Torio Client'

  useEffect(() => {
    if (hasLoadedGlobal) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplayedText(fullText)
      setLoadingFadeOut(true)
      setShowMainContent(true)
      hasLoadedGlobal = true
      return
    }

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        hasLoadedGlobal = true
        setTimeout(() => setLoadingFadeOut(true), 500)
        setTimeout(() => setShowMainContent(true), 1500)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    if (!isDownloadMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(`.${styles.downloadWrapper}`)) {
        setIsDownloadMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDownloadMenuOpen])


  return (
    <>
      {!showMainContent && (
        <div
          className={`${styles.loadingScreen} ${loadingFadeOut ? styles.fadeOut : ''}`}
          role="status"
          aria-live="polite"
        >
          <div className={styles.loadingContent}>
            <h1 className={styles.loadingTitle}>
              <span className={styles.titleGlow}>
                {displayedText}
                <span className={styles.cursor} aria-hidden="true">|</span>
              </span>
            </h1>
          </div>
        </div>
      )}

      {showMainContent && (
        <div className={styles.container}>
          <SiteHeader />

          <div className={styles.background}></div>

          <main className={styles.main}>
            <div className={styles.heroWrapper}>
              <section className={styles.hero}>
                <h1 className={styles.title}>
                  <span className={styles.titleGlow}>TorioGhost External</span>
                </h1>
                <p className={styles.subtitle}>external ghost client for minecraft bedrock</p>
                <ul className={styles.heroChips}>
                  <li className={styles.heroChip}>50+ modules</li>
                  <li className={styles.heroChip}>windows 10 &amp; 11</li>
                  <li className={styles.heroChip}>
                    <img src={asset('download.svg')} alt="" className={styles.downloadsIcon} aria-hidden="true" />
                    <span>{downloads.toLocaleString()} downloads</span>
                  </li>
                </ul>
              </section>

              <section className={styles.actions} aria-label="Primary actions">
                <div className={styles.downloadWrapper}>
                  {(exeUrl && zipUrl) ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.downloadButton}`}
                        onClick={() => setIsDownloadMenuOpen((open) => !open)}
                        aria-haspopup="true"
                        aria-expanded={isDownloadMenuOpen}
                      >
                        Download
                        <span className={styles.downloadCaret} aria-hidden="true">▾</span>
                      </button>
                      {isDownloadMenuOpen && (
                        <div className={styles.downloadMenu} role="menu">
                          <a
                            href={exeUrl}
                            download
                            className={styles.downloadMenuItem}
                            role="menuitem"
                            onClick={() => setIsDownloadMenuOpen(false)}
                          >
                            <span className={styles.downloadMenuLabel}>.exe</span>
                            <span className={styles.downloadMenuHint}>windows standalone</span>
                          </a>
                          <a
                            href={zipUrl}
                            download
                            className={styles.downloadMenuItem}
                            role="menuitem"
                            onClick={() => setIsDownloadMenuOpen(false)}
                          >
                            <span className={styles.downloadMenuLabel}>.zip</span>
                            <span className={styles.downloadMenuHint}>portable archive</span>
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <a href={latestUrl} className={`${styles.button} ${styles.downloadButton}`}>
                      Download
                    </a>
                  )}
                </div>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.githubButton}`}
                >
                  GitHub
                </a>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.discordButton}`}
                >
                  Discord
                </a>
              </section>
            </div>

            <section className={styles.coreSection} aria-labelledby="core-heading">
              <h2 id="core-heading" className={styles.sectionTitle}>how it hooks in</h2>
              <div className={styles.coreStack}>
                {CORE_FEATURES.map((feature, index) => (
                  <article key={feature.badge} className={`${styles.coreRow} ${index % 2 === 1 ? styles.coreRowFlip : ''}`}>
                    <div className={styles.coreText}>
                      <div className={styles.coreTag}>
                        <span className={styles.coreIndex}>0{index + 1}</span>
                        <span className={styles.coreBadgeText}>{feature.badge}</span>
                      </div>
                      <h3 className={styles.coreTitle}>{feature.title}</h3>
                    </div>
                    <div className={styles.coreImage}>
                      <img src={feature.image} alt={feature.alt} loading="lazy" />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.guiSection} aria-labelledby="gui-heading">
              <h2 id="gui-heading" className={styles.sectionTitle}>two ways to run the gui</h2>
              <p className={styles.sectionIntro}>
                one client, two faces. switch between them in settings and use whichever fits the moment.
              </p>
              <div className={styles.guiGrid}>
                <div className={styles.guiCard}>
                  <div className={styles.guiImageWrapper}>
                    <span className={styles.guiCardBadge}>ingame gui</span>
                    <img
                      src={asset('v2_ingame_gui.png')}
                      alt="Torio Client v2 in-game overlay GUI"
                      className={styles.guiImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.guiCardContent}>
                    <h3 className={styles.guiCardTitle}>in-game gui</h3>
                  </div>
                </div>

                <div className={styles.guiCard}>
                  <div className={styles.guiImageWrapper}>
                    <span className={styles.guiCardBadge}>external window</span>
                    <img
                      src={asset('v2_external_gui.png')}
                      alt="Torio Client v2 external window GUI"
                      className={styles.guiImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.guiCardContent}>
                    <h3 className={styles.guiCardTitle}>external window</h3>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.guideSection} aria-labelledby="guide-heading">
              <h2 id="guide-heading" className={styles.sectionTitle}>getting started</h2>

              <div className={styles.stepGrid}>
                {GUIDE_STEPS.map((step) => (
                  <div key={step.badge} className={styles.stepCard}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNumber}>{step.badge}</span>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                    </div>
                    <p className={styles.stepBody}>{step.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.videoSection} aria-labelledby="video-heading">
              <h2 id="video-heading" className={styles.sectionTitle}>gameplay &amp; devlog</h2>

              <div className={styles.videoFeatured}>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/NozHpYcHyUE?si=JlDjcFAnEzCnOB36"
                    title="Torio Ghost Client V2 Devlog (Minecraft Bedrock)"
                    frameBorder="0"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <h3 className={styles.videoGroupTitle}>the python days</h3>
              <p className={styles.videoGroupSub}>
                prototype demos from before the wpf rewrite. the whole client looked like this once.
              </p>
              <div className={styles.videoPair}>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/sNp_Rb1Ofvc?si=bu_SJHGj7aaSI_wG"
                    title="Torio Client Python Prototype Demo 1"
                    frameBorder="0"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/7sgeDD2K_HE?si=Wvka8_9S7yN6fHmm"
                    title="Torio Client Python Prototype Demo 2"
                    frameBorder="0"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </section>

            <section className={styles.aboutSection} aria-labelledby="about-heading">
              <h2 id="about-heading" className={styles.sectionTitle}>how it started</h2>
              <div className={styles.aboutContent}>
                <p>
                  summer 2025. ducky spent the july and august holidays messing with memory hacking
                  in python, mostly to answer one question: could a real bedrock client come out of
                  it? turns out it could.
                </p>
                <p>
                  the prototype grew fast, with a lot of ai-assisted code thrown at it to test ideas
                  quickly. it worked, it was proper spaghetti, and it shipped as v1. some of that
                  early gui survives in the screenshots below.
                </p>
                <p>
                  then came the rewrite. the whole client moved to wpf in c# for faster startup and
                  a real gui, and development now focuses purely on v26 and up. the python builds
                  stay online as an archive of where torio came from.
                </p>
              </div>
            </section>

            <section className={styles.screenshotSection} aria-labelledby="screenshots-heading">
              <h2 id="screenshots-heading" className={styles.visuallyHidden}>Screenshots</h2>
              <h3 className={styles.screenshotDate}>september 5th, the first gui</h3>
              <div className={styles.screenshotGrid}>
                <div className={styles.imageContainer}>
                  <img src={asset('Screenshot1.png')} alt="Torio Client python GUI, early build, screen 1" className={styles.screenshot} loading="lazy" />
                </div>
                <div className={styles.imageContainer}>
                  <img src={asset('Screenshot2.png')} alt="Torio Client python GUI, early build, screen 2" className={styles.screenshot} loading="lazy" />
                </div>
              </div>

              <div className={styles.arrowWrapper}>
                <img src={asset('arrow_down.svg')} alt="" className={styles.arrowIcon} aria-hidden="true" />
              </div>

              <h3 className={styles.screenshotDate}>the last python prototype</h3>
              <div className={styles.screenshotGrid}>
                <div className={styles.imageContainer}>
                  <img src={asset('Screenshot3.png')} alt="Torio Client python GUI, final prototype, screen 1" className={styles.screenshot} loading="lazy" />
                </div>
                <div className={styles.imageContainer}>
                  <img src={asset('Screenshot4.png')} alt="Torio Client python GUI, final prototype, screen 2" className={styles.screenshot} loading="lazy" />
                </div>
              </div>
            </section>
          </main>

          <footer className={styles.footer}>
            <p>&copy; 2025 - 2026 Torio Client</p>
            <p className={styles.footerNote}>
              not affiliated with mojang or microsoft. use at your own risk.
            </p>
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
      )}
    </>
  )
}
