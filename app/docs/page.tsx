'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '../components/SiteHeader'
import styles from './docs.module.css'
import docsDataJson from '../../data/public-docs.json'

interface DocModule {
  id: string
  name: string
  description: string
  content?: string
}

interface DocsData {
  general: DocModule[]
  visual: DocModule[]
  combat: DocModule[]
  movement: DocModule[]
  utility: DocModule[]
  core: DocModule[]
}

const docsData = docsDataJson as unknown as DocsData

const CATEGORY_LABELS: Record<keyof DocsData, string> = {
  general: 'General',
  visual: 'Visual Modules',
  combat: 'Combat Modules',
  movement: 'Movement Modules',
  utility: 'Utility Modules',
  core: 'Core Subsystems',
}

function DocsContent() {
  const searchParams = useSearchParams()

  const getInitialState = () => {
    const catParam = searchParams.get('category') as keyof DocsData
    const modParam = searchParams.get('module')

    let category: keyof DocsData = 'general'
    let moduleId = ''

    if (catParam && docsData[catParam]) {
      category = catParam
      if (modParam && docsData[catParam].some(m => m.id === modParam)) {
        moduleId = modParam
      } else if (docsData[catParam].length > 0) {
        moduleId = docsData[catParam][0].id
      }
    } else {
      category = 'general'
      if (docsData.general.length > 0) {
        moduleId = docsData.general[0].id
      }
    }
    return { category, moduleId }
  }

  const initialState = getInitialState()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<keyof DocsData>(initialState.category)
  const [selectedModuleId, setSelectedModuleId] = useState(initialState.moduleId)
  const [expandedCategories, setExpandedCategories] = useState<Record<keyof DocsData, boolean>>({
    general: initialState.category === 'general',
    visual: initialState.category === 'visual',
    combat: initialState.category === 'combat',
    movement: initialState.category === 'movement',
    utility: initialState.category === 'utility',
    core: initialState.category === 'core',
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const catParam = searchParams.get('category') as keyof DocsData
    const modParam = searchParams.get('module')

    if (catParam && docsData[catParam]) {
      setSelectedCategory(catParam)
      if (modParam && docsData[catParam].some(m => m.id === modParam)) {
        setSelectedModuleId(modParam)
      } else if (docsData[catParam].length > 0) {
        setSelectedModuleId(docsData[catParam][0].id)
      }
      setExpandedCategories(prev => ({
        ...prev,
        [catParam]: true
      }))
    } else {
      setSelectedCategory('general')
      if (docsData.general.length > 0) {
        setSelectedModuleId(docsData.general[0].id)
      }
      setExpandedCategories(prev => ({
        ...prev,
        general: true
      }))
    }
  }, [searchParams])

  const selectModule = (category: keyof DocsData, moduleId: string) => {
    setSelectedCategory(category)
    setSelectedModuleId(moduleId)
    setIsSidebarOpen(false)
    setExpandedCategories(prev => ({
      ...prev,
      [category]: true
    }))

    const newUrl = `${window.location.pathname}?category=${category}&module=${moduleId}`
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const toggleCategory = (category: keyof DocsData) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const activeModule = docsData[selectedCategory]?.find(m => m.id === selectedModuleId) || docsData.general[0]

  const getFilteredData = () => {
    if (!searchQuery) return docsData

    const filtered: DocsData = {
      general: [],
      visual: [],
      combat: [],
      movement: [],
      utility: [],
      core: [],
    }

    Object.keys(docsData).forEach((key) => {
      const cat = key as keyof DocsData
      filtered[cat] = docsData[cat].filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

    return filtered
  }

  const filteredData = getFilteredData()
  const hasMatches = (cat: keyof DocsData) => filteredData[cat].length > 0

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle navigation sidebar"
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? '✕ Close Sidebar' : '☰ Open Sidebar'}
      </button>

      {/* Sidebar Panel */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarSticky}>
          <div className={styles.searchWrapper}>
            <input
              type="search"
              placeholder="Search modules..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className={styles.searchClear}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <nav className={styles.navMenu} aria-label="Documentation navigation">
            {(Object.keys(CATEGORY_LABELS) as Array<keyof DocsData>).map((catKey) => {
              if (searchQuery && !hasMatches(catKey)) return null
              const list = filteredData[catKey]
              const isExpanded = searchQuery ? hasMatches(catKey) : !!expandedCategories[catKey]

              return (
                <div key={catKey} className={styles.navSection}>
                  <button
                    className={styles.sectionHeader}
                    onClick={() => toggleCategory(catKey)}
                    aria-expanded={isExpanded}
                  >
                    <span>{CATEGORY_LABELS[catKey]}</span>
                    <span className={`${styles.arrow} ${isExpanded ? styles.arrowExpanded : ''}`}>▾</span>
                  </button>

                  {isExpanded && (
                    <ul className={styles.moduleList}>
                      {list.map((mod) => {
                        const isActive = selectedCategory === catKey && selectedModuleId === mod.id
                        return (
                          <li key={mod.id}>
                            <button
                              onClick={() => selectModule(catKey, mod.id)}
                              className={`${styles.moduleButton} ${isActive ? styles.moduleButtonActive : ''}`}
                            >
                              {mod.name}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area: Retains the design, but renders Coming Soon */}
      <main className={styles.contentArea}>
        {activeModule ? (
          <article className={styles.docArticle}>
            <header className={styles.articleHeader}>
              <div className={styles.categoryBreadcrumb}>
                Documentation / {CATEGORY_LABELS[selectedCategory]}
              </div>
              <h1 className={styles.articleTitle}>{activeModule.name}</h1>
              {activeModule.description && (
                <p className={styles.articleDescription}>{activeModule.description}</p>
              )}
            </header>

            <div className={styles.comingSoonBox}>
              <p className={styles.comingSoonSimple}>Documentation is Coming Soon...</p>
            </div>
          </article>
        ) : (
          <div className={styles.emptyState}>
            <h2>No Module Selected</h2>
            <p>Please select a documentation topic from the sidebar.</p>
          </div>
        )}
      </main>
    </>
  )
}

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />

      <div className={styles.background} />
      <div className={styles.gridOverlay} />

      <div className={styles.docsContainer}>
        <Suspense fallback={
          <>
            <aside className={styles.sidebar}>
              <div className={styles.searchWrapper}>
                <input
                  type="search"
                  placeholder="Search modules..."
                  className={styles.searchInput}
                  disabled
                />
              </div>
            </aside>
            <main className={styles.contentArea}>
              <div className={styles.emptyState}>
                <p>Loading documentation...</p>
              </div>
            </main>
          </>
        }>
          <DocsContent />
        </Suspense>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2025 - 2026 TorioGhost Client</p>
      </footer>
    </div>
  )
}