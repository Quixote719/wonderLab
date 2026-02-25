import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import ClockPage from '@/pages/clockPage.tsx'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/clockPage" element={<ClockPage />} />
        <Route path="/" element={<ClockPage />} />
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
