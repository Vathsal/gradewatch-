import React, { useState, useCallback } from 'react'
import GradeBadge from './GradeBadge'

const API = 'https://data.cityofnewyork.us/resource/43nn-pn8j.json'

function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function SearchScreen({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const doSearch = useCallback(async () => {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const url = `${API}?$where=upper(dba) like '%25${encodeURIComponent(q.toUpperCase())}%25'&$order=inspection_date DESC&$limit=50`
      const res = await fetch(url)
      const data = await res.json()
      const seen = {}
      const unique = []
      data.forEach(r => { if (!seen[r.camis]) { seen[r.camis] = true; unique.push(r) } })
      setResults(unique)
    } catch {
      setError('Could not reach NYC Open Data. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [query])

  const onKeyDown = (e) => { if (e.key === 'Enter') doSearch() }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Restaurant name or neighborhood..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10,
            border: '0.5px solid #d3d1c7', fontSize: 14,
            background: '#fff', outline: 'none',
          }}
        />
        <button
          onClick={doSearch}
          style={{
            padding: '0 16px', borderRadius: 10, border: '0.5px solid #d3d1c7',
            background: '#1a1a18', color: '#fff', fontSize: 14, fontWeight: 500,
          }}
        >
          <i className="ti ti-search" style={{ fontSize: 16 }} />
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888780', fontSize: 14 }}>
          Checking NYC health records…
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#791F1F', fontSize: 14 }}>
          {error}
        </div>
      )}

      {results && !loading && (
        <>
          <div style={{ fontSize: 12, color: '#888780', marginBottom: 8 }}>
            {results.length} restaurant{results.length !== 1 ? 's' : ''} found
          </div>
          {results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888780', fontSize: 14 }}>
              No results for "{query}". Try a different name or neighborhood.
            </div>
          )}
          {results.map(r => (
            <div
              key={r.camis}
              onClick={() => onSelect(r.camis)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#fff', border: '0.5px solid #d3d1c7',
                borderRadius: 12, padding: '12px 14px', marginBottom: 8,
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#888780'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#d3d1c7'}
            >
              <GradeBadge grade={r.grade} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.dba}
                </div>
                <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>
                  {r.cuisine_description} · {r.boro}
                </div>
                <div style={{ fontSize: 12, color: '#888780' }}>
                  Last inspected {formatDate(r.inspection_date)}
                </div>
              </div>
              <i className="ti ti-chevron-right" style={{ fontSize: 16, color: '#b4b2a9', flexShrink: 0 }} />
            </div>
          ))}
        </>
      )}

      {!results && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#b4b2a9' }}>
          <i className="ti ti-shield-check" style={{ fontSize: 40, display: 'block', marginBottom: 12 }} />
          <div style={{ fontSize: 14 }}>Search any NYC restaurant to see its health inspection grade and violation history.</div>
        </div>
      )}
    </div>
  )
}
