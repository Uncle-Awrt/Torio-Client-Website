import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.gridOverlay}></div>
      </div>
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.glowEffect}></div>
          <h1 className={styles.title}>
            <span className={styles.titleGlow}>Torio Client</span>
          </h1>
          <p className={styles.subtitle}>
            Ghost Client for Minecraft Bedrock Edition
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>Fast</h3>
            <p>Optimized performance</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Secure</h3>
            <p>Low detection risk</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Customizable</h3>
            <p>Rich configuration</p>
          </div>
        </div>

        <div className={styles.actions}>
          <a 
            href="https://github.com/Uncle-Awrt/Torio-Client/releases/download/v1.0.1/TorioClient.exe" 
            className={`${styles.button} ${styles.downloadButton}`}
          >
            Download
            <div className={styles.buttonGlow}></div>
          </a>
          
          <a 
            href="https://github.com/Uncle-Awrt/Torio-Client" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${styles.button} ${styles.githubButton}`}
          >
            GitHub
            <div className={styles.buttonGlow}></div>
          </a>

          <a 
            href="https://discord.gg/xq8sWQhuXG"
            target="_blank" 
            rel="noopener noreferrer"
            className={`${styles.button} ${styles.discordButton}`}
          >
            Discord
            <div className={styles.buttonGlow}></div>
          </a>
        </div>

        <div className={styles.warning}>
          <p>We are not responsible for any consequences. Use at your own risk.</p>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Torio Client</p>
      </footer>
    </div>
  )
}