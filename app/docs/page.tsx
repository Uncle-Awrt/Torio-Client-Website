'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SiteHeader from '../components/SiteHeader'
import styles from './docs.module.css'

type TabId = 'guide' | 'dev' | 'license'

const TABS: { id: TabId; label: string; eyebrow: string }[] = [
  { id: 'guide', label: 'User Guide', eyebrow: '01' },
  { id: 'dev', label: 'Developer Docs', eyebrow: '02' },
  { id: 'license', label: 'License', eyebrow: '03' },
]

function DocsContent() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as TabId) || 'guide'
  const [activeTab, setActiveTab] = useState<TabId>(
    TABS.some((t) => t.id === initialTab) ? initialTab : 'guide'
  )

  useEffect(() => {
    const tab = searchParams.get('tab') as TabId
    if (TABS.some((t) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className={styles.page}>
      <SiteHeader />

      <div className={styles.background}>
        <div className={styles.gridOverlay} aria-hidden="true"></div>
      </div>

      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Documentation</h1>
        </header>

        <div
          className={styles.tabList}
          role="tablist"
          aria-label="Documentation categories"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`${styles.tabButton} ${
                activeTab === tab.id ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabEyebrow}>{tab.eyebrow}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <section
          role="tabpanel"
          id="panel-guide"
          aria-labelledby="tab-guide"
          hidden={activeTab !== 'guide'}
          className={styles.panel}
        >
          <UserGuide />
        </section>

        <section
          role="tabpanel"
          id="panel-dev"
          aria-labelledby="tab-dev"
          hidden={activeTab !== 'dev'}
          className={styles.panel}
        >
          <DeveloperDocs />
        </section>

        <section
          role="tabpanel"
          id="panel-license"
          aria-labelledby="tab-license"
          hidden={activeTab !== 'license'}
          className={styles.panel}
        >
          <LicenseInfo />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 - 2026 TorioGhost Client</p>
      </footer>
    </div>
  )
}

export default function DocsPage() {
  return (
    <Suspense fallback={null}>
      <DocsContent />
    </Suspense>
  )
}

function UserGuide() {
  return (
    <div className={styles.content}>
      <h2 className={styles.contentHeading}>Introduction</h2>
      <p>
        Torio Client is an open-source ghost client for Minecraft Bedrock. 
        This page explains everything step-by-step, from downloading and launching to basic usage.
      </p>

      <h2 className={styles.contentHeading}>Installation Guide</h2>
      <ol className={styles.stepList}>
        <li>
          <strong>Download</strong>
          <p>Get the latest release from the top page.</p>
        </li>
        <li>
          <strong>Launch</strong>
          <p>Launch Minecraft Bedrock and run the executable.</p>
        </li>
        <li>
          <strong>Config</strong>
          <p>Configure your preferred settings.</p>
        </li>
      </ol>

      <h2 className={styles.contentHeading}>Troubleshooting</h2>
      <p>
        If you experience issues such as the client not launching or behaving strangely, first ensure you are using the latest version. 
        If the problem persists, please report it in our Discord server.
      </p>
    </div>
  )
}

function DeveloperDocs() {
  return (
    <div className={styles.content}>
      <h2 className={styles.contentHeading}>Developer Documentation</h2>
      <p>Coming soon...</p>
    </div>
  )
}

function LicenseInfo() {
  return (
    <div className={styles.content}>
      <h2 className={styles.contentHeading}>License</h2>
      <p>
        Torio Client is released as open-source software. 
        Below is a summary of the license terms. Please refer to the <code>LICENSE</code> file in the repository for the official and complete legal text.
      </p>

      <div className={styles.licenseBox}>
        <p className={styles.licenseName}>Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)</p>
        <p>Copyright (c) 2025-2026 Ducky / Torio Client contributors</p>
        <p>
          This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
        </p>
        <p>
          <strong>You are free to:</strong>
        </p>
        <p>
          • <strong>Share</strong> — copy and redistribute the material in any medium or format
        </p>
        <p>
          • <strong>Adapt</strong> — remix, transform, and build upon the material
        </p>
        <p>
          <strong>Under the following terms:</strong>
        </p>
        <p>
          • <strong>Attribution</strong> — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
        </p>
        <p>
          • <strong>NonCommercial</strong> — You may not use the material for commercial purposes.
        </p>
      </div>

      <h2 className={styles.contentHeading}>Third-Party Components</h2>
      <p>
        This project utilizes components provided by third parties, such as fonts and certain libraries. 
        Please refer to the documentation of each distributor for their respective licensing terms.
      </p>

      <h2 className={styles.contentHeading}>Disclaimer</h2>
      <div className={styles.callout} role="note">
        Use Torio Client at your own risk. The developers are not responsible for any damage caused by the use of this software. 
        Additionally, using it on multiplayer servers may violate the server&apos;s terms of service.
      </div>
    </div>
  )
}