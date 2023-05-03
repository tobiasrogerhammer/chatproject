import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from './pages/chat'
import Login from './pages/login'


export default function App () {
  return(
    <div>
      <BrowserRouter>
        <Routes>
           <Route index element={<Login  />} />
           <Route path="/login" element={<Login  />} />
           <Route path="/chat" element={<Chat  />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}