import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Historia from './pages/Historia'
import GaleriaFotos from './pages/GaleriaFotos'
import GaleriaMusica from './pages/GaleriaMusica'
import Feedbacks from './pages/Feedbacks'
import Sobre from './pages/Sobre'
import Login from './pages/Login'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                index element={<Home />} />
        <Route path="/historia"        element={<Historia />} />
        <Route path="/galeria-fotos"   element={<GaleriaFotos />} />
        <Route path="/galeria-musica"  element={<GaleriaMusica />} />
        <Route path="/feedbacks"       element={<Feedbacks />} />
        <Route path="/sobre"       element={<Sobre />} />
        <Route path="/login"           element={<Login />} />
      </Routes>
    </>
  )
}
