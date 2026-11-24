import SiteHeader from '../components/SiteHeader'
import styles from './shop.module.css'

const DISCORD_URL = 'https://discord.gg/xq8sWQhuXG'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export default function ShopPage() {
  return (
    <div className={styles.container}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <SiteHeader />

      <main className={styles.main}>
        <section className={styles.cta} aria-labelledby="shop-cta-heading">
          <div>
            <h2 id="shop-cta-heading" className={styles.ctaTitle}>hear about it first</h2>
            <p className={styles.ctaBody}>launch news and beta tests are announced in the discord.</p>
          </div>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={styles.discordButton} id="shop-join-discord-btn">
            Join the Discord
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </section>
      </main>

      <footer className={styles.footer}>
        <img src={`${BASE}/images/icon.png`} alt="" width={20} height={20} />
        <span>&copy; 2025 - 2026 TorioGhost External</span>
      </footer>
    </div>
  )
}
