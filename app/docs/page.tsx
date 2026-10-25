import fs from 'node:fs'
import path from 'node:path'
import SiteHeader from '../components/SiteHeader'
import DocsClient, { type DocsData } from './DocsClient'
import styles from './docs.module.css'

// public-docs.json is gitignored while the docs are unfinished, so CI builds
// (and therefore the live site) get the placeholder below instead.
const DOCS_FILE = path.join(process.cwd(), 'data', 'public-docs.json')

export default function DocsPage() {
  if (fs.existsSync(DOCS_FILE)) {
    const docsData = JSON.parse(fs.readFileSync(DOCS_FILE, 'utf8')) as DocsData
    return <DocsClient docsData={docsData} />
  }

  return (
    <div className={styles.page}>
      <SiteHeader />
      <div className={styles.background} />
      <div className={styles.docsContainer}>
        <main className={styles.contentArea}>
          <div className={styles.emptyState}>
            <h2>Documentation is coming soon</h2>
            <p>The docs are still being written. Ask in the Discord in the meantime.</p>
          </div>
        </main>
      </div>
      <footer className={styles.footer}>
        <p>&copy; 2025 - 2026 TorioGhost External</p>
      </footer>
    </div>
  )
}
