import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";

/////Pages
import Home from './pages/Home/Home';
import AboutArtist from "./pages/AboutArtist/AboutArtist";
import Musics from './pages/Musics/Musics';
/////Elements

function App() {
  return (
      <div>
        <BrowserRouter>
          <Routes>

            <Route path='/' element={<Home/>}/>
            <Route path='/aboutArtist' element={<AboutArtist/>}/>
            <Route path='/musics' element={<Musics/>}/>
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App
