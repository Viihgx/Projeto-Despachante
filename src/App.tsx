import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './routes/Login';
import Home from './routes/Home';

function App() {
  return (
    <>
    <BrowserRouter>
       <Routes>
          <Route path="/" element={<Login />} />
          <Route path="home" element={<Home />} />
      </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;


