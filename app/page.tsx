'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteHeader from './components/SiteHeader'
import styles from './page.module.css'
import downloadsData from '../data/downloads.json'
import docsDataJson from '../data/public-docs.json'

const FALLBACK_DOWNLOADS = 1414
const REPO_RELEASES_URL = 'https://github.com/Uncle-Awrt/Torio-Client/releases/latest'
const DISCORD_URL = 'https://discord.gg/xq8sWQhuXG'
const GITHUB_URL = 'https://github.com/Uncle-Awrt/Torio-Client'

let hasLoadedGlobal = false

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const asset = (path: string) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`

const MODULE_CATEGORIES = [
  {
    key: 'visual',
    label: 'Visual',
    image: asset('/images/visual_modules.png'),
    blurb: 'see more of the game than it wants you to',
  },
  {
    key: 'combat',
    label: 'Combat',
    image: asset('/images/combat_modules.png'),
    blurb: 'pvp helpers with randomizer support baked in',
  },
  {
    key: 'movement',
    label: 'Movement',
    image: asset('/images/movement_modules.png'),
    blurb: 'strafe, tick and knockback control',
  },
  {
    key: 'utility',
    label: 'Utility',
    image: asset('/images/utility_modules.png'),
    blurb: 'the stuff that makes the client livable',
  },
] as const

type ModuleCategoryKey = (typeof MODULE_CATEGORIES)[number]['key']

const docsData = docsDataJson as unknown as Record<ModuleCategoryKey, Array<{ id: string; name: string }>>

const CORE_FEATURES = [
  {
    badge: 'connect',
    title: 'the connect screen does the work',
    body: 'open bedrock, then run torio. the connect screen finds the minecraft process on its own, checks the version in real time and tells you straight when a build is not supported. no offset folders, no manual anything.',
    image: asset('/images/connectscreen.png'),
    alt: 'Torio Client connect screen detecting a running Minecraft Bedrock process',
  },
  {
    badge: 'version switcher',
    title: 'switch versions without launchers',
    body: 'hop between v26.20 and v26.45, or install a supported bedrock build straight from the client. the built-in version switcher handles it all. no third-party launcher, no digging through folders.',
    image: asset('/images/versionswitcher.png'),
    alt: 'Torio Client built-in version switcher listing supported Minecraft Bedrock versions',
  },
  {
    badge: 'loading',
    title: 'hooked in seconds',
    body: 'once you connect, the loading pass scans game memory and settles in without freezing the game. from there every module reads live data, frame by frame, at full speed.',
    image: asset('/images/loadingscreen.png'),
    alt: 'Torio Client loading screen scanning game memory after connect',
  },
]

const SMALL_FEATURES = [
  {
    title: 'configs',
    body: 'save a setup, load it back whenever. switching between playstyles is one click instead of thirty.',
  },
  {
    title: 'keybinds',
    body: 'nearly every module takes a custom bind. even the gui toggle itself is rebindable in settings.',
  },
  {
    title: 'rgb theming',
    body: 'full accent color control with light and dark mode, straight from gui settings. no files to edit.',
  },
  {
    title: 'stream protect',
    body: 'hides your info while streaming, and the in-game overlay stays out of obs and discord captures.',
  },
  {
    title: 'system tray',
    body: 'minimize to the tray when you are done configuring. it stays out of the way until you need it.',
  },
  {
    title: 'discord presence',
    body: 'your profile shows the current menu, server, game version and client status while you play.',
  },
]

const GUIDE_STEPS = [
  {
    badge: '01',
    title: 'download',
    body: 'grab the latest release from github. the .exe runs standalone, the .zip is the portable one. no installer, nothing bundled.',
  },
  {
    badge: '02',
    title: 'connect',
    body: 'open bedrock first, then run torio. the connect screen finds the game, checks the version and hooks in.',
  },
  {
    badge: '03',
    title: 'set it up',
    body: 'toggle what you need, bind it, theme it. save the whole thing as a config so it is one click next time.',
  },
  {
    badge: '04',
    title: 'keep up',
    body: 'new bedrock versions get support as offsets update. watch the releases page or the announcements channel in discord.',
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
                <p className={styles.subtitle}>external ghost client for minecraft bedrock</p>
                <ul className={styles.heroChips}>
                  <li className={styles.heroChip}>v26.20 - v26.45</li>
                  <li className={styles.heroChip}>38 modules</li>
                  <li className={styles.heroChip}>windows</li>
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
                      <span className={styles.coreBadge}>{feature.badge}</span>
                      <h3 className={styles.coreTitle}>{feature.title}</h3>
                      <p className={styles.coreBody}>{feature.body}</p>
                    </div>
                    <div className={styles.coreImage}>
                      <img src={feature.image} alt={feature.alt} loading="lazy" />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.modulesSection} aria-labelledby="modules-heading">
              <h2 id="modules-heading" className={styles.sectionTitle}>38 modules, four tabs</h2>
              <p className={styles.sectionIntro}>
                every module is toggleable, most ship with randomizer support and their own keybind.
                this is how they are laid out in the gui.
              </p>
              <div className={styles.moduleGrid}>
                {MODULE_CATEGORIES.map((category) => (
                  <article key={category.key} className={styles.moduleCard}>
                    <div className={styles.moduleImageWrap}>
                      <img
                        src={category.image}
                        alt={`Torio Client ${category.label} modules tab`}
                        loading="lazy"
                      />
                      <span className={styles.moduleBadge}>{category.label}</span>
                    </div>
                    <div className={styles.moduleBody}>
                      <p className={styles.moduleBlurb}>{category.blurb}</p>
                      <ul className={styles.moduleChips}>
                        {docsData[category.key].map((mod) => (
                          <li key={mod.id}>
                            <Link
                              href={`/docs?category=${category.key}&module=${mod.id}`}
                              className={styles.moduleChip}
                            >
                              {mod.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/docs?category=${category.key}`}
                        className={styles.moduleBrowse}
                      >
                        browse {category.label.toLowerCase()} docs →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.smallFeatureSection} aria-labelledby="small-features-heading">
              <h2 id="small-features-heading" className={styles.sectionTitle}>the details that matter</h2>
              <div className={styles.smallFeatureGrid}>
                {SMALL_FEATURES.map((feature) => (
                  <article key={feature.title} className={styles.smallFeatureCard}>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
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
                    <span className={styles.guiCardBadge}>in-game gui</span>
                    <img
                      src={asset('v2_ingame_gui.png')}
                      alt="Torio Client v2 in-game overlay GUI"
                      className={styles.guiImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.guiCardContent}>
                    <h3 className={styles.guiCardTitle}>overlay mode</h3>
                    <p className={styles.guiCardDescription}>
                      the whole gui drawn over minecraft itself. it is stream-proof, so nothing ever
                      leaks into obs or discord screen shares. made for people who never tab out.
                    </p>
                  </div>
                </div>

                <div className={styles.guiCard}>
                  <div className={styles.guiImageWrapper}>
                    <span className={styles.guiCardBadge}>external gui</span>
                    <img
                      src={asset('v2_external_gui.png')}
                      alt="Torio Client v2 external window GUI"
                      className={styles.guiImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.guiCardContent}>
                    <h3 className={styles.guiCardTitle}>windowed mode</h3>
                    <p className={styles.guiCardDescription}>
                      the classic desktop window next to the game. built for dual monitors and quick
                      tinkering between rounds, and it works whether the game is focused or not.
                    </p>
                  </div>
                </div>
              </div>
              <figure className={styles.wideShot}>
                <img
                  src={asset('/images/externalwindow.png')}
                  alt="Torio Client v2 external window running alongside Minecraft Bedrock"
                  loading="lazy"
                />
                <figcaption>the external window on v2</figcaption>
              </figure>
            </section>

            <section className={styles.guideSection} aria-labelledby="guide-heading">
              <h2 id="guide-heading" className={styles.sectionTitle}>getting started</h2>

              <div className={styles.stepGrid}>
                {GUIDE_STEPS.map((step) => (
                  <div key={step.badge} className={styles.stepCard}>
                    <div className={styles.stepBadge}>{step.badge}</div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                ))}
              </div>

              <div className={styles.troubleCallout}>
                <h3>something broke?</h3>
                <p>
                  first make sure you are on the latest release and a supported game version.
                  if it still acts up, ask in the{' '}
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={styles.discordLink}>discord</a>.
                  github issues on the client repo are not the support channel.
                </p>
              </div>
            </section>

            <section className={styles.videoSection} aria-labelledby="video-heading">
              <h2 id="video-heading" className={styles.sectionTitle}>in motion</h2>

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
                <p className={styles.videoCaption}>
                  <span className={styles.videoTag}>devlog · work in progress</span>
                  the latest v2 showcase, straight from development. not public yet.
                </p>
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
