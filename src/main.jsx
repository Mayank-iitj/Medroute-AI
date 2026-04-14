import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MedRouteAI from './MedRouteAI.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MedRouteAI />
  </StrictMode>,
)
