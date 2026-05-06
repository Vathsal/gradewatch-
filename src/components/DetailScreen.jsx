import React, { useEffect, useState } from 'react'
import GradeBadge from './GradeBadge'

const API = 'https://data.cityofnewyork.us/resource/43nn-pn8j.json'

function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ViolationCard({ violation }) {
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const explain = async () => {
    if (open) { setOpen(false); return }
    if (explanation) { setOpen(true); return }
    setLoading(true)
    setOpen(true)
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violationCode: violation.code,
          violationDescription: violation.desc,
        }),
      })
      const data = await res.json()
      setExplanation(data.explanation || 'Could not generate explanation.')
    } catch {
      setExplanation('Could not reach explanation service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#fff', border: '0.5px solid #d3d1c7',
      borderRadius: 10, padding: '10px 12px', marginBottom: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#b4b2a9' }}>{violation.code}</span>
        {violation.critical === 'Critical' && (
          <span style={{
            fontSize: 10, padding: '1px 7px', borderRadius: 99,
            background: '#FCEBEB', color: '#791F1F', fontWeight: 500,
          }}>Critical</span>
        )}
      </div>
      <div style={{ fontSize: 13, color: '#1a1a18', lineHeight: 1.5 }}>
        {violation.desc || 'No description available.'}
      </div>
      <button
        onClick={explain}
        style={{
          marginTop: 6, fontSize: 11, padding: '3px 10px',
          borderRadius: 99, border: '0.5px solid #d3d1c7',
          background: 'transparent', color: '#5F5E5A',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        <i className="ti ti-sparkles" style={{ fontSize: 11 }} />
        {open ? 'Hide explanation' : 'Explain in plain English'}
      </button>
      {open && (
        <div style={{
          marginTop: 6, background: '#EAF3DE', borderRadius: 8,
          padding: '8px 10px', fontSize: 12, color: '#27500A', lineHeight: 1.6,
        }}>
          {loading ? (
            <span style={{ color: '#3B6D11' }}>Thinking…</span>
          ) : (
            <><i className="ti ti-sparkles" style={{ fontSize: 11, marginRight: 4 }} />{explanation}</>
          )}
        </div>
      )}
    </div>
  )
}

export default function DetailScreen({ camis, savedSpots, onToggleSave, onBack }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${API}?camis=${camis}&$order=inspection_date DESC&$limit=100`)
      .then(r => r.json())
      .then(rows => {
        if (!rows.length) { setError('No inspection data found.'); return }
        const grouped = {}
        rows.forEach(row => {
          const key = row.inspection_date ? row.inspection_date.split('T')[0] : 'unknown'
          if (!grouped[key]) grouped[key] = { date: row.inspection_date, grade: row.grade, score: row.score, violations: [] }
          if (row.violation_code) grouped[key].violations.push({ code: row.violation_code, desc: row.violation_description, critical: row.critical_flag })
        })
        setData({ meta: rows[0], inspections: Object.values(grouped).slice(0, 8) })
      })
      .catch(() => setError('Could not load inspection data.'))
      .finally(() => setLoading(false))
  }, [camis])

  const dotColor = (g) => g === 'A' ? '#639922' : g === 'B' ? '#BA7517' : '#E24B4A'
  const saved = savedSpots.some(s => s.camis === camis)

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#888780', fontSize: 14 }}>Loading inspection history…</div>
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#791F1F', fontSize: 14 }}>{error}</div>

  const { meta, inspections } = data
  const score = parseInt(meta.score) || 0

  return (
    <div>
      <button onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'none', border: 'none', color: '#888780',
        fontSize: 13, marginBottom: 16, padding: 0,
      }}>
        <i className="ti ti-arrow-left" style={{ fontSize: 14 }} /> Back
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2, marginBottom: 3 }}>{meta.dba}</h1>
          <div style={{ fontSize: 13, color: '#888780' }}>{meta.cuisine_description}</div>
          <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>
            <i className="ti ti-map-pin" style={{ fontSize: 12 }} /> {meta.building} {meta.street}, {meta.boro} {meta.zipcode}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <GradeBadge grade={meta.grade} size="lg" />
          <div style={{ fontSize: 10, color: '#888780' }}>score: {score}</div>
        </div>
      </div>

      <button
        onClick={() => onToggleSave(meta)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 12, padding: '6px 14px', borderRadius: 99,
          border: '0.5px solid #d3d1c7',
          background: saved ? '#EAF3DE' : 'transparent',
          color: saved ? '#27500A' : '#5F5E5A',
          marginBottom: 20, fontWeight: 500,
        }}
      >
        <i className={`ti ti-bookmark${saved ? '-filled' : ''}`} style={{ fontSize: 13 }} />
        {saved ? 'Saved' : 'Save spot'}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        {[
          { val: meta.grade || '?', label: 'Current grade', color: meta.grade === 'A' ? '#27500A' : meta.grade === 'B' ? '#633806' : '#791F1F' },
          { val: score, label: 'Score (lower = better)', color: '#1a1a18' },
          { val: inspections.length, label: 'Inspections on record', color: '#1a1a18' },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ background: '#f1efe8', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600, color }}>{val}</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2, lineHeight: 1.3 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 500, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Inspection history
      </div>

      {inspections.map((ins, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor(ins.grade), flexShrink: 0 }} />
            {i < inspections.length - 1 && <div style={{ width: 1, background: '#d3d1c7', flex: 1, minHeight: 16, margin: '4px 0' }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: i < inspections.length - 1 ? 16 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#888780' }}>{formatDate(ins.date)}</span>
              {ins.grade && <GradeBadge grade={ins.grade} size="sm" />}
              <span style={{ fontSize: 11, color: '#888780' }}>Score: {ins.score || 'N/A'}</span>
            </div>
            {ins.violations.map((v, vi) => <ViolationCard key={vi} violation={v} />)}
            {ins.violations.length === 0 && (
              <div style={{ fontSize: 12, color: '#888780', marginBottom: 8 }}>No violations recorded.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
