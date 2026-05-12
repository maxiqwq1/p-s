import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const API = 'http://localhost:5000/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner"></div>Cargando...</div>
  if (!stats) return <div className="loading">Error conectando con el backend</div>

  const repoColors = { 'Scopus': '#d2a8ff', 'PubMed': '#3fb950', 'Web of Science': '#f78166' }

  return (
    <div className="panel">
      <div className="section-title">Dashboard</div>
      <div className="section-sub">Resumen general · Síndrome Nefrótico y Comorbilidades</div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        {[
          { label: 'Total artículos', value: stats.total, color: 'var(--accent)' },
          { label: 'Incluidos', value: stats.por_estado.incluido || 0, color: 'var(--accent2)' },
          { label: 'Excluidos', value: stats.por_estado.excluido || 0, color: 'var(--accent3)' },
          { label: 'Pendientes', value: stats.por_estado.pendiente || stats.total, color: 'var(--accent5)' },
          { label: 'Repositorios', value: stats.por_repositorio.length, color: 'var(--accent4)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-num" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div className="chart-section">
          <div className="chart-title">Artículos por año</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.por_anio}>
              <XAxis dataKey="anio" stroke="var(--text3)" fontSize={11} />
              <YAxis stroke="var(--text3)" fontSize={11} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              <Bar dataKey="total" fill="var(--accent)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <div className="chart-title">Artículos por tipo</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.por_tipo}>
              <XAxis dataKey="tipo" stroke="var(--text3)" fontSize={10} />
              <YAxis stroke="var(--text3)" fontSize={11} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              <Bar dataKey="total" fill="var(--accent4)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REPO CARDS */}
      <div className="chart-title" style={{ marginBottom: '12px' }}>Por repositorio</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {stats.por_repositorio.map(r => (
          <div key={r.repositorio} className="chart-section">
            <div style={{ color: repoColors[r.repositorio] || 'var(--accent)', fontSize: '15px', marginBottom: '8px' }}>{r.repositorio}</div>
            <div style={{ fontSize: '2rem', color: repoColors[r.repositorio] || 'var(--accent)', fontWeight: 300 }}>{r.total}</div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>artículos únicos</div>
            <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginTop: '12px' }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                background: repoColors[r.repositorio] || 'var(--accent)',
                width: `${(r.total / stats.total) * 100}%`
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}