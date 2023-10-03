import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Userdetails from './pages/Quotation/Userdetails';
import Carpenterdetails from './pages/Carpenter/Carpenterdetails';
import Architecturedetails from './pages/Architecture/Architecturedetails';
import Shopdetails from './pages/Shop/Shopdetails';

function App() {
 
  return (
   <>
      <BrowserRouter>
        <Routes>
          <Route path='/login'  element={<AdminLogin />}/>
          <Route path='/dashboard' element={ <Dashboard />}/>
          <Route path='/Shopform' element={<Shopform/>}/>
          <Route path='/Shopform/:id' element={<Shopform/>}/>
          <Route path='/architecture' element={<Architectureform/>}/>
          <Route path='/architecture/:id' element={<Architectureform/>}/>
          <Route path='/carpenterform' element={<Carpenterform/>}/>
          <Route path='/carpenterform/:id' element={<Carpenterform/>}/>
          <Route path='/quotation' element={<QuotationFrom/>}/>
          <Route path='/quotation/:id' element={<QuotationFrom/>}/>
          <Route path='/quotationlist' element={<Quotationlist/>}/>
          <Route path='/architecturelist' element={<Architecturelist/>}/>
          <Route path='/carpenterlist' element={<Carpenterlist/>}/>
          <Route path='/shoplist' element={<Shoplist/>}/>
          <Route path='/quotationlist/userdetails/:id' element={<Userdetails/>}/>
          <Route path='/carpenterlist/carpenterdetails/:id' element={<Carpenterdetails/>}/>
          <Route path='/architecturelist/architecturedetails/:id' element={<Architecturedetails/>}/>
          <Route path='/shoplist/shopdetails/:id' element={<Shopdetails/>}/>
        </Routes>
      </BrowserRouter>
   </>
  );
  }

export default App;
