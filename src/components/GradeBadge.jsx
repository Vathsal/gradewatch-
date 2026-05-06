import React from 'react'

const GRADE_STYLES = {
  A: { bg: '#EAF3DE', color: '#27500A' },
  B: { bg: '#FAEEDA', color: '#633806' },
  C: { bg: '#FCEBEB', color: '#791F1F' },
  P: { bg: '#FCEBEB', color: '#791F1F' },
  Z: { bg: '#F1EFE8', color: '#5F5E5A' },
}

export default function GradeBadge({ grade, size = 'md' }) {
  const g = grade && GRADE_STYLES[grade] ? grade : 'Z'
  const { bg, color } = GRADE_STYLES[g]
  const dim = size === 'lg' ? 48 : size === 'sm' ? 22 : 34
  const fs = size === 'lg' ? 24 : size === 'sm' ? 11 : 17

  return (
    <div style={{
      width: dim, height: dim, borderRadius: 7,
      background: bg, color, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontWeight: 600, fontSize: fs, flexShrink: 0,
    }}>
      {g === 'Z' ? '?' : g}
    </div>
  )
}
