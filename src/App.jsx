import { Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Home from './routes/Home';
import Cadastro from './routes/Cadastro/Cadastro';

function App() {
  return (
    <>
       <Routes>
          <Route path="/" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="cadastro" element={<Cadastro />} />
      </Routes>
    </>

  );
}

export default App;



