import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path='/' element={<Home/>}/>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

export default App