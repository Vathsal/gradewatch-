import React, { useState, useEffect } from 'react'
import SearchScreen from './components/SearchScreen'
import DetailScreen from './components/DetailScreen'
import SavedScreen from './components/SavedScreen'

const STORAGE_KEY = 'gradewatch_saved'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

export default function App() {
  const [tab, setTab] = useState('search')
  const [detailCamis, setDetailCamis] = useState(null)
  const [prevTab, setPrevTab] = useState('search')
  const [savedSpots, setSavedSpots] = useState(loadSaved)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSpots))
  }, [savedSpots])

  const goTo = (newTab) => {
    setPrevTab(tab)
    setTab(newTab)
  }

  const showDetail = (camis) => {
    setPrevTab(tab)
    setDetailCamis(camis)
    setTab('detail')
  }

  const goBack = () => {
    setTab(prevTab === 'detail' ? 'search' : prevTab)
  }

  const toggleSave = (restaurant) => {
    setSavedSpots(prev => {
      const exists = prev.some(s => s.camis === restaurant.camis)
      if (exists) return prev.filter(s => s.camis !== restaurant.camis)
      return [...prev, {
        camis: restaurant.camis,
        dba: restaurant.dba,
        boro: restaurant.boro,
        cuisine_description: restaurant.cuisine_description,
        grade: restaurant.grade || 'N/A',
        score: restaurant.score,
        inspection_date: restaurant.inspection_date,
      }]
    })
  }

  const removeSaved = (camis) => setSavedSpots(prev => prev.filter(s => s.camis !== camis))

  const NAV_TABS = [
    { id: 'search', icon: 'ti-search', label: 'Search' },
    { id: 'saved', icon: 'ti-bookmark', label: 'Saved', count: savedSpots.length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f3', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: '#fff', borderBottom: '0.5px solid #d3d1c7',
        padding: '0 16px', height: 52,
        display: 'flex', alignItems: 'center', gap: 8,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{
          width: 28, height: 28, background: '#EAF3DE', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className="ti ti-shield-check" style={{ fontSize: 16, color: '#27500A' }} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a18' }}>GradeWatch</span>
        <span style={{ fontSize: 11, color: '#b4b2a9', marginLeft: 2 }}>NYC</span>
      </header>

      <main style={{ flex: 1, maxWidth: 480, width: '100%', margin: '0 auto', padding: '16px 16px 80px' }}>
        {tab === 'search' && <SearchScreen onSelect={showDetail} />}
        {tab === 'detail' && detailCamis && (
          <DetailScreen
            camis={detailCamis}
            savedSpots={savedSpots}
            onToggleSave={toggleSave}
            onBack={goBack}
          />
        )}
        {tab === 'saved' && (
          <SavedScreen
            savedSpots={savedSpots}
            onSelect={showDetail}
            onRemove={removeSaved}
          />
        )}
      </main>

      {tab !== 'detail' && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#fff', borderTop: '0.5px solid #d3d1c7',
          display: 'flex', height: 60,
          maxWidth: 480, margin: '0 auto',
        }}>
          {NAV_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => goTo(t.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
                background: 'none', border: 'none',
                color: tab === t.id ? '#1a1a18' : '#888780',
                fontSize: 11, fontWeight: tab === t.id ? 500 : 400,
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div style={{ position: 'relative' }}>
                <i className={`ti ${t.icon}`} style={{ fontSize: 20 }} />
                {t.count > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -6,
                    background: '#1a1a18', color: '#fff',
                    fontSize: 9, fontWeight: 600, borderRadius: 99,
                    width: 14, height: 14, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>{t.count}</span>
                )}
              </div>
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
