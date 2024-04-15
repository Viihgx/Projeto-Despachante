import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './routes/Login';
import Home from './routes/Home';
import Cadastro from './routes/Cadastro/Cadastro';

function App() {
  return (
    <>
    <BrowserRouter>
       <Routes>
          <Route path="/" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="cadastro" element={<Cadastro />} />
      </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;


