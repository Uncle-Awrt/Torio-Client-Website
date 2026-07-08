'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [displayedText, setDisplayedText] = useState('')
  const [showMainContent, setShowMainContent] = useState(false)
  const [loadingFadeOut, setLoadingFadeOut] = useState(false)
  const [downloads, setDownloads] = useState<number | null>(null)
  const [latestUrl, setLatestUrl] = useState('https://github.com/Uncle-Awrt/Torio-Client/releases/latest')
  
  const [scrollY, setScrollY] = useState(0)
  const fullText = 'Torio Client'

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => setLoadingFadeOut(true), 500)
        setTimeout(() => setShowMainContent(true), 1500)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetch('/api/downloads')
      .then(res => res.json())
      .then(data => {
        setDownloads(data.downloads)
        setLatestUrl(data.latestUrl)
      })
      .catch(() => {
        setDownloads(1414)
      })
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const gridOpacity = Math.max(0, 1 - scrollY / 500)

  return (
    <>
      {!showMainContent && (
        <div className={`${styles.loadingScreen} ${loadingFadeOut ? styles.fadeOut : ''}`}>
          <div className={styles.loadingContent}>
            <h1 className={styles.loadingTitle}>
              <span className={styles.titleGlow}>
                {displayedText}
                <span className={styles.cursor}>|</span>
              </span>
            </h1>
          </div>
        </div>
      )}

      {showMainContent && (
        <div className={styles.container}>
          <div className={styles.background}>
            <div className={styles.gridOverlay} style={{ opacity: gridOpacity }}></div>
          </div>

          <main className={styles.main}>
            <div className={styles.heroWrapper}>
              <section className={styles.hero}>
                <h1 className={styles.title}>
                  <span className={styles.titleGlow}>Torio Client</span>
                </h1>
                <p className={styles.subtitle}>Open Source Ghost Client for Minecraft Bedrock</p>
                {downloads !== null && (
                  <p className={styles.downloads}>
                    <img src="/download.svg" alt="" className={styles.downloadsIcon} />
                    {downloads.toLocaleString()} Downloads
                  </p>
                )}
              </section>

              <section className={styles.actions}>
                <a href={latestUrl} className={`${styles.button} ${styles.downloadButton}`}>Download</a>
                <a href="https://github.com/kukentyan/torio-master" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.githubButton}`}>Source Code</a>
                <a href="https://discord.gg/xq8sWQhuXG" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.discordButton}`}>Discord</a>
              </section>
            </div>

            <section className={styles.videoSection}>
              <h2 className={styles.sectionTitle}>Python Prototype Versions</h2>
              <div className={styles.videoContainer}>
                <div className={styles.videoWrapper}>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/sNp_Rb1Ofvc?si=bu_SJHGj7aaSI_wG" title="YouTube video player" frameBorder="0" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div>
                <div className={styles.videoWrapper}>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/sNp_Rb1Ofvc?si=bu_SJHGj7aaSI_wG" title="YouTube video player" frameBorder="0" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div>
              </div>
            </section>

            <section className={styles.aboutSection}>
              <h2 className={styles.sectionTitle}>Our Story</h2>
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

            <section className={styles.screenshotSection}>
              <h3 className={styles.screenshotDate}>Snapshots from September 5th</h3>
              <div className={styles.screenshotGrid}>
                <div className={styles.imageContainer}>
                  <img src="/Screenshot1.png" alt="Sept 5th 1" className={styles.screenshot} />
                </div>
                <div className={styles.imageContainer}>
                  <img src="/Screenshot2.png" alt="Sept 5th 2" className={styles.screenshot} />
                </div>
              </div>

              <div className={styles.arrowWrapper}>
                <img src="/arrow_down.svg" alt="Evolution Arrow" className={styles.arrowIcon} />
              </div>

              <h3 className={styles.screenshotDate}>Current Python GUI Prototype</h3>
              <div className={styles.screenshotGrid}>
                <div className={styles.imageContainer}>
                  <img src="/Screenshot3.png" alt="Current 1" className={styles.screenshot} />
                </div>
                <div className={styles.imageContainer}>
                  <img src="/Screenshot4.png" alt="Current 2" className={styles.screenshot} />
                </div>
              </div>
            </section>
          </main>

          <footer className={styles.footer}>
            <p>&copy; 2025 - 2026 TorioGhost Client</p>
          </footer>
        </div>
      )}
    </>
  )
}