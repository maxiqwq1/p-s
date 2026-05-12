import { useState, useEffect } from 'react'

const API = 'https://revision-sistematica-api.onrender.com/api'
const PER_PAGE = 25

export default function Clasificacion() {
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filtroEstado, setFiltroEstado] = useState('pendiente')
  const [modal, setModal] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState('')
  const [razon, setRazon] = useState('')

  const cargar = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filtroEstado) params.set('estado', filtroEstado)
    fetch(`${API}/articulos?${params}`)
      .then(r => r.json())
      .then(data => { setArticulos(data); setPage(1); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [filtroEstado])

  const abrirModal = (art) => {
    setModal(art)
    setNuevoEstado(art.estado)
    setRazon(art.razon_exclusion || '')
  }

  const guardar = async () => {
    await fetch(`${API}/articulos/${modal.id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado, razon_exclusion: razon })
    })
    setModal(null)
    cargar()
  }

  const totalPages = Math.ceil(articulos.length / PER_PAGE)
  const paginados = articulos.slice((page-1)*PER_PAGE, page*PER_PAGE)

  return (
    <div className="panel">
      <div className="section-title">Clasificación</div>
      <div className="section-sub">Marcar artículos como incluidos o excluidos</div>

      <div className="filters">
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="pendiente">Pendientes</option>
          <option value="incluido">Incluidos</option>
          <option value="excluido">Excluidos</option>
          <option value="">Todos</option>
        </select>
        <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'monospace' }}>
          {articulos.length} artículos
        </span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Año</th>
              <th>Repositorio</th>
              <th>Estado</th>
              <th>Razón</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="loading"><div className="spinner" />Cargando...</div></td></tr>
            ) : paginados.map((a, i) => (
              <tr key={a.id}>
                <td style={{ color: 'var(--text3)', fontFamily: 'monospace' }}>{(page-1)*PER_PAGE+i+1}</td>
                <td style={{ maxWidth: '380px', lineHeight: '1.4' }}>{a.titulo}</td>
                <td style={{ fontFamily: 'monospace' }}>{a.anio || '—'}</td>
                <td>
                  <span className={`tag tag-${a.repositorio === 'Web of Science' ? 'WoS' : a.repositorio}`}>
                    {a.repositorio === 'Web of Science' ? 'WoS' : a.repositorio}
                  </span>
                </td>
                <td><span className={`estado-btn estado-${a.estado}`}>{a.estado}</span></td>
                <td style={{ fontSize: '11px', color: a.estado === 'excluido' ? 'var(--accent3)' : 'var(--accent2)', maxWidth: '160px' }}>
                  {a.razon_exclusion || '—'}
                </td>
                <td>
                  <button className="btn btn-primary" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => abrirModal(a)}>
                    Clasificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => p-1)} disabled={page === 1}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i+1)
            .filter(i => i === 1 || i === totalPages || Math.abs(i - page) <= 2)
            .map((i, idx, arr) => (
              <>
                {idx > 0 && arr[idx-1] !== i-1 && <span key={`d${i}`} style={{ color: 'var(--text3)' }}>…</span>}
                <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i}</button>
              </>
            ))}
          <button className="page-btn" onClick={() => setPage(p => p+1)} disabled={page === totalPages}>›</button>
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '24px', minWidth: '340px', maxWidth: '500px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 300, marginBottom: '12px' }}>Clasificar artículo</div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px', lineHeight: '1.5' }}>
              {modal.titulo}
            </div>
            <select
              value={nuevoEstado}
              onChange={e => setNuevoEstado(e.target.value)}
              style={{
                width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                color: 'var(--text)', borderRadius: '7px', padding: '8px 12px',
                fontSize: '13px', outline: 'none', marginBottom: '10px'
              }}
            >
              <option value="pendiente">Pendiente</option>
              <option value="incluido">Incluido</option>
              <option value="excluido">Excluido</option>
            </select>
            <textarea
              value={razon}
              onChange={e => setRazon(e.target.value)}
              placeholder="Razón (opcional)"
              style={{
                width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                color: 'var(--text)', borderRadius: '7px', padding: '8px 12px',
                fontSize: '13px', outline: 'none', resize: 'vertical',
                minHeight: '70px', marginBottom: '16px', fontFamily: 'inherit'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}