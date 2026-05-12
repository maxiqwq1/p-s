import { useState, useEffect } from 'react'

const API = 'https://revision-sistematica-api.onrender.com/api'
const PER_PAGE = 25

function tagTipo(tipo) {
  if (tipo === 'Article') return <span className="tag tag-Article">Article</span>
  if (tipo?.includes('Review')) return <span className="tag tag-Review">Review</span>
  return <span className="tag tag-other">{tipo || '—'}</span>
}

function tagRepo(repo) {
  if (repo === 'Scopus') return <span className="tag tag-Scopus">Scopus</span>
  if (repo === 'PubMed') return <span className="tag tag-PubMed">PubMed</span>
  return <span className="tag tag-WoS">WoS</span>
}

export default function Biblioteca() {
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [buscar, setBuscar] = useState('')
  const [repo, setRepo] = useState('')
  const [anio, setAnio] = useState('')
  const [tipo, setTipo] = useState('')
  const [estado, setEstado] = useState('')

  const cargar = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (buscar) params.set('buscar', buscar)
    if (repo) params.set('repositorio', repo)
    if (anio) params.set('anio', anio)
    if (tipo) params.set('tipo', tipo)
    if (estado) params.set('estado', estado)
    fetch(`${API}/articulos?${params}`)
      .then(r => r.json())
      .then(data => { setArticulos(data); setPage(1); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const totalPages = Math.ceil(articulos.length / PER_PAGE)
  const paginados = articulos.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="panel">
      <div className="section-title">Biblioteca de artículos</div>
      <div className="section-sub">Filtrar, buscar y explorar artículos</div>

      <div className="filters">
        <input
          placeholder="Buscar título, autores, revista..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && cargar()}
          style={{ minWidth: '220px' }}
        />
        <select value={repo} onChange={e => setRepo(e.target.value)}>
          <option value="">Todos los repositorios</option>
          <option>Scopus</option>
          <option>PubMed</option>
          <option>Web of Science</option>
        </select>
        <select value={anio} onChange={e => setAnio(e.target.value)}>
          <option value="">Todos los años</option>
          {[2019,2020,2021,2022,2023,2024,2025,2026].map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option>Article</option>
          <option>Review</option>
          <option>Editorial</option>
          <option>Letter</option>
        </select>
        <select value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="incluido">Incluido</option>
          <option value="excluido">Excluido</option>
        </select>
        <button className="btn btn-primary" onClick={cargar}>Aplicar</button>
        <button className="btn" onClick={() => { setBuscar(''); setRepo(''); setAnio(''); setTipo(''); setEstado(''); setTimeout(cargar, 0) }}>↺ Limpiar</button>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px', fontFamily: 'monospace' }}>
        {articulos.length} artículos encontrados
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Autores</th>
              <th>Año</th>
              <th>Revista</th>
              <th>Tipo</th>
              <th>Repo</th>
              <th>Citas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9}><div className="loading"><div className="spinner" />Cargando...</div></td></tr>
            ) : paginados.map((a, i) => (
              <tr key={a.id}>
                <td style={{ color: 'var(--text3)', fontFamily: 'monospace' }}>{(page-1)*PER_PAGE+i+1}</td>
                <td style={{ maxWidth: '320px', lineHeight: '1.4' }}>
                  {a.link ? <a href={a.link} target="_blank" rel="noreferrer">{a.titulo}</a> : a.titulo}
                  {a.razon_exclusion && (
                    <div style={{ fontSize: '11px', color: a.estado === 'excluido' ? 'var(--accent3)' : 'var(--accent2)', marginTop: '3px' }}>
                      {a.razon_exclusion}
                    </div>
                  )}
                </td>
                <td style={{ maxWidth: '160px', color: 'var(--text3)', fontSize: '12px' }}>{a.autores || '—'}</td>
                <td style={{ fontFamily: 'monospace' }}>{a.anio || '—'}</td>
                <td style={{ fontSize: '12px', color: 'var(--text2)', maxWidth: '140px' }}>{a.fuente_revista || '—'}</td>
                <td>{tagTipo(a.tipo_documento)}</td>
                <td>{tagRepo(a.repositorio)}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--accent5)' }}>{a.citado_por || 0}</td>
                <td><span className={`estado-btn estado-${a.estado}`}>{a.estado}</span></td>
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
                {idx > 0 && arr[idx-1] !== i-1 && <span key={`dots-${i}`} style={{ color: 'var(--text3)' }}>…</span>}
                <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i}</button>
              </>
            ))}
          <button className="page-btn" onClick={() => setPage(p => p+1)} disabled={page === totalPages}>›</button>
        </div>
      )}
    </div>
  )
}