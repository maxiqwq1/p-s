import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/biblioteca', icon: '📄', label: 'Artículos' },
  { to: '/clasificacion', icon: '🏷️', label: 'Clasificación' },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: '220px', minWidth: '220px',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto'
    }}>
      <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '22px', color: 'var(--accent)', fontWeight: 300 }}>PRISMA</div>
        <div style={{ fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>
          Revisión Sistemática
        </div>
      </div>

      <nav style={{ padding: '10px 0', flex: 1 }}>
        <div style={{ padding: '8px 18px 4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text3)', fontFamily: 'monospace' }}>
          Navegación
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '8px 18px', cursor: 'pointer',
              color: isActive ? 'var(--accent)' : 'var(--text2)',
              background: isActive ? 'rgba(88,166,255,0.08)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              textDecoration: 'none', fontSize: '13px',
              transition: 'all 0.15s'
            })}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text3)', marginBottom: '4px' }}>
          Síndrome Nefrótico
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text3)' }}>
          2019 – 2026
        </div>
      </div>
    </aside>
  )
}