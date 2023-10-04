import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/app.css';
import AdminLogin from './pages/Login/AdminLogin';
import Shopform from './pages/Shop/Shopform';
import Architectureform from './pages/Architecture/Architectureform';
import Carpenterform from './pages/Carpenter/Carpenterform';
import Dashboard from './pages/Home/Dashboard';
import QuotationFrom from './pages/Quotation/Quotationfrom';
import Quotationlist from './pages/Quotation/Quotationlist';
import Architecturelist from './pages/Architecture/Architecturelist';
import Carpenterlist from './pages/Carpenter/Carpenterlist';
import Shoplist from './pages/Shop/Shoplist';

function App() {
 
  return (
  
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
          <Route path='/login'  element={<AdminLogin />}/>
          <Route path='/dashboard' element={ <Dashboard />}/>
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path='/Shopform' element={<Shopform/>}/>
          <Route path='/Shopform/:id' element={<Shopform/>}/>
          <Route path='/shoplist' element={<Shoplist/>}/>

          <Route path='/architecture' element={<Architectureform/>}/>
          <Route path='/architecture/:id' element={<Architectureform/>}/>
          <Route path='/architecturelist' element={<Architecturelist/>}/>

          <Route path='/carpenterform' element={<Carpenterform/>}/>
          <Route path='/carpenterform/:id' element={<Carpenterform/>}/>
          <Route path='/carpenterlist' element={<Carpenterlist/>}/>

          <Route path='/quotation' element={<QuotationFrom/>}/>
          <Route path='/quotation/:id' element={<QuotationFrom/>}/>
          <Route path='/quotationlist' element={<Quotationlist/>}/>
        </Routes>
      </BrowserRouter>
   
  );
  }

export default App;
