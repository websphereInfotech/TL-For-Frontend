import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/app.css';
import AdminLogin from './pages/Login/AdminLogin';
import Shopform from './pages/Shop/Shopform';
import Architectureform from './pages/Architecture/Architectureform';
import Carpenterform from './pages/Carpenter/Carpenterform';
import Dashboard from './pages/Home/Dashboard';
import QuotationFrom from './pages/Quotation/Quotationfrom';
import Quotationdetails from './pages/Quotation/Quotationdetails';


function App() {
  return (
   <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/login'  element={<AdminLogin />}/>
          <Route path='/dashboard' element={ <Dashboard />}/>
          <Route path='/Shopform' element={<Shopform/>}/>
          <Route path='/architecture' element={<Architectureform/>}/>
          <Route path='/carpenterform' element={<Carpenterform/>}/>
          <Route path='/quotation' element={<QuotationFrom/>}/>
          <Route path='/details' element={<Quotationdetails/>}/>
        </Routes>
      </BrowserRouter>
   </>
  );
  }

export default App;
