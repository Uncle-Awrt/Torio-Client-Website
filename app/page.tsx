'use client'

import { useState, useEffect } from 'react'
import SiteHeader from './components/SiteHeader'
import styles from './page.module.css'
import downloadsData from '../data/downloads.json'

const FALLBACK_DOWNLOADS = 1414
const REPO_RELEASES_URL = 'https://github.com/Uncle-Awrt/Torio-Client/releases/latest'

let hasLoadedGlobal = false

export default function Home() {
  const [displayedText, setDisplayedText] = useState(hasLoadedGlobal ? 'Torio Client' : '')
  const [showMainContent, setShowMainContent] = useState(hasLoadedGlobal)
  const [loadingFadeOut, setLoadingFadeOut] = useState(hasLoadedGlobal)

  const downloads = downloadsData.downloads ?? FALLBACK_DOWNLOADS
  const latestUrl = downloadsData.latestUrl || REPO_RELEASES_URL
  const exeUrl = downloadsData.exeUrl ?? null
  const zipUrl = downloadsData.zipUrl ?? null

  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

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
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

  const gridOpacity = Math.max(0, 1 - scrollY / 500)

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

          <div className={styles.background}>
            <div className={styles.gridOverlay} style={{ opacity: gridOpacity }} aria-hidden="true"></div>
          </div>

          <main className={styles.main}>
            <div className={styles.heroWrapper}>
              <section className={styles.hero}>
                <h1 className={styles.title}>
                  <span className={styles.titleGlow}>Torio Client</span>
                </h1>
                <p className={styles.subtitle}>Open Source Ghost Client for Minecraft Bedrock</p>
                <p className={styles.downloads}>
                  <img src="download.svg" alt="" className={styles.downloadsIcon} aria-hidden="true" />
                  <span>{downloads.toLocaleString()} downloads</span>
                </p>
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
                            <span className={styles.downloadMenuHint}>Windows standalone</span>
                          </a>
                          <a
                            href={zipUrl}
                            download
                            className={styles.downloadMenuItem}
                            role="menuitem"
                            onClick={() => setIsDownloadMenuOpen(false)}
                          >
                            <span className={styles.downloadMenuLabel}>.zip</span>
                            <span className={styles.downloadMenuHint}>Portable archive</span>
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
                  href="https://github.com/Uncle-Awrt/Torio-Client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.githubButton}`}
                >
                  GitHub
                </a>
                <a
                  href="https://discord.gg/xq8sWQhuXG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.discordButton}`}
                >
                  Discord
                </a>
              </section>
            </div>

            <section className={styles.guideSection} aria-labelledby="guide-heading">
              <h2 id="guide-heading" className={styles.sectionTitle}>User Guide</h2>

              <div className={styles.stepGrid}>
                <div className={styles.stepCard}>
                  <div className={styles.stepBadge}>01</div>
                  <h3>Download</h3>
                  <p>Download the latest client release.</p>
                </div>
                <div className={styles.stepCard}>
                  <div className={styles.stepBadge}>02</div>
                  <h3>Launch</h3>
                  <p>Open Minecraft, then run the client.</p>
                </div>
                <div className={styles.stepCard}>
                  <div className={styles.stepBadge}>03</div>
                  <h3>Config</h3>
                  <p>Configure settings using the client GUI.</p>
                </div>
              </div>

              <div className={styles.troubleCallout}>
                <h3>Troubleshooting</h3>
                <p>
                  If you experience issues such as the client not launching or behaving strangely,
                  first ensure you are using the latest version. If the problem persists, please report it in our
                  <a href="https://discord.gg/xq8sWQhuXG" target="_blank" rel="noopener noreferrer" className={styles.discordLink}> Discord server</a>.
                </p>
              </div>
            </section>

            <section className={styles.guiSection} aria-labelledby="gui-heading">
              <h2 id="gui-heading" className={styles.sectionTitle}>Dual GUI Modes</h2>
              <p className={styles.sectionSubtitle}>
                Torio Client V2 allows you to seamlessly switch between an in-game overlay and an external desktop GUI to fit your playstyle.
              </p>

              <div className={styles.guiGrid}>
                <div className={styles.guiCard}>
                  <div className={styles.guiImageWrapper}>
                    <span className={styles.guiCardBadge}>In-Game GUI</span>
                    <img
                      src="/images/v2_ingame_gui.png"
                      alt="Torio Client V2 In-Game Overlay GUI"
                      className={styles.guiImage}
                    />
                  </div>
                  <div className={styles.guiCardContent}>
                    <h3 className={styles.guiCardTitle}>In-Game Overlay GUI</h3>
                    <p className={styles.guiCardDescription}>
                      Built for players who prefer configuring settings directly in-game. Features an external in-game overlay with stream-proof protection that prevents the GUI from being captured in screen shares or recordings.
                    </p>
                  </div>
                </div>

                <div className={styles.guiCard}>
                  <div className={styles.guiImageWrapper}>
                    <span className={styles.guiCardBadge}>External GUI</span>
                    <img
                      src="/images/v2_external_gui.png"
                      alt="Torio Client V2 External Window GUI"
                      className={styles.guiImage}
                    />
                  </div>
                  <div className={styles.guiCardContent}>
                    <h3 className={styles.guiCardTitle}>External Window GUI</h3>
                    <p className={styles.guiCardDescription}>
                      Easily configure and customize your client and module settings from an external window outside of the game.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.devlogSection} aria-labelledby="devlog-heading">
              <h2 id="devlog-heading" className={styles.sectionTitle}>
                Latest Devlog <span className={styles.devlogNote}>(In Development · Not Public Yet)</span>
              </h2>
              <p className={styles.devlogSubtitle}>
                Watch the latest development showcase and see new upcoming features in action.
              </p>
              <div className={styles.videoContainer}>
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
            </section>

            <section className={styles.videoSection} aria-labelledby="video-heading">
              <h2 id="video-heading" className={styles.sectionTitle}>Python Prototype Versions</h2>
              <div className={styles.videoContainer}>
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
              <h2 id="about-heading" className={styles.sectionTitle}>Our Story</h2>
              <div className={styles.aboutContent}>
                <p>
                  It all started in the summer of 2025, during the July and August holidays.
                  Ducky, the owner of Torio Client, began developing a simple memory hacking program using Python.
                  Having long harbored a passion for creating a unique client for Minecraft Bedrock,
                  this project marked the beginning of his journey into development.
                </p>
                <p>
                  The source code for the Python prototype was developed at high speed using AI to facilitate rapid experimentation.
                  Because numerous features were implemented so quickly for testing purposes,
                  the original codebase became quite messy—a true piece of &quot;spaghetti code&quot;—but it served
                  as the vital foundation for what Torio Client is today.
                </p>
              </div>
            </section>

            <section className={styles.screenshotSection} aria-labelledby="screenshots-heading">
              <h2 id="screenshots-heading" className={styles.visuallyHidden}>Screenshots</h2>
              <h3 className={styles.screenshotDate}>Snapshots from September 5th</h3>
              <div className={styles.screenshotGrid}>
                <div className={styles.imageContainer}>
                  <img src="Screenshot1.png" alt="Torio Client GUI prototype screen 1 as of September 5th" className={styles.screenshot} />
                </div>
                <div className={styles.imageContainer}>
                  <img src="Screenshot2.png" alt="Torio Client GUI prototype screen 2 as of September 5th" className={styles.screenshot} />
                </div>
              </div>

              <div className={styles.arrowWrapper}>
                <img src="arrow_down.svg" alt="" className={styles.arrowIcon} aria-hidden="true" />
              </div>

              <h3 className={styles.screenshotDate}>Current Python GUI Prototype</h3>
              <div className={styles.screenshotGrid}>
                <div className={styles.imageContainer}>
                  <img src="Screenshot3.png" alt="Current Torio Client Python GUI prototype screen 1" className={styles.screenshot} />
                </div>
                <div className={styles.imageContainer}>
                  <img src="Screenshot4.png" alt="Current Torio Client Python GUI prototype screen 2" className={styles.screenshot} />
                </div>
              </div>
            </section>
          </main>

          <footer className={styles.footer}>
            <p>&copy; 2025 - 2026 TorioGhost Client</p>
            <p className={styles.footerLinks}>
              <a href="/docs?tab=license" className={styles.footerLink}>License</a>
              <span aria-hidden="true"> · </span>
              <a href="/docs" className={styles.footerLink}>Docs</a>
            </p>
          </footer>
        </div>
      )}
    </>
  )
}