import React from 'react'
import GradeBadge from './GradeBadge'

export default function SavedScreen({ savedSpots, onSelect, onRemove }) {
  if (!savedSpots.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#b4b2a9' }}>
        <i className="ti ti-bookmark" style={{ fontSize: 40, display: 'block', marginBottom: 12 }} />
        <div style={{ fontSize: 14 }}>No saved spots yet.</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Search for a restaurant and tap "Save spot."</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: '#888780', marginBottom: 8 }}>
        {savedSpots.length} saved spot{savedSpots.length !== 1 ? 's' : ''}
      </div>
      {savedSpots.map(r => (
        <div
          key={r.camis}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#fff', border: '0.5px solid #d3d1c7',
            borderRadius: 12, padding: '12px 14px', marginBottom: 8,
            cursor: 'pointer', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#888780'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#d3d1c7'}
        >
          <div onClick={() => onSelect(r.camis)} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <GradeBadge grade={r.grade} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.dba}
              </div>
              <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>
                {r.cuisine_description} · {r.boro}
              </div>
              <div style={{ fontSize: 12, color: '#888780' }}>
                Last seen grade: <strong>{r.grade || 'N/A'}</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => onRemove(r.camis)}
            style={{ background: 'none', border: 'none', padding: 4, color: '#b4b2a9', flexShrink: 0 }}
            aria-label={`Remove ${r.dba} from saved`}
          >
            <i className="ti ti-trash" style={{ fontSize: 16 }} />
          </button>
        </div>
      ))}
    </div>
  )
}
