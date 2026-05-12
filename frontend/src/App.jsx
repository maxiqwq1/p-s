import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Biblioteca from './components/Biblioteca'
import Clasificacion from './components/Clasificacion'
import './App.css'

function App() {
  return (
    <BrowserRouter basename="/p-s">
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/clasificacion" element={<Clasificacion />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App