import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/app.css';
import AdminLogin from './pages/Login/AdminLogin';
import Formdata from './pages/Home/Formdata';

function App() {
  return (
   <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AdminLogin/>}/>
          <Route path='/formdata' element={<Formdata/>}/>
        </Routes>
      </BrowserRouter>
   </>
  );
  }

export default App;
