import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Protected from './Service/Protected';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exct path="/login" element={<AdminLogin />} />
          <Route path="/" element={<Navigate to="/login" />} />
  
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />

          <Route path='/Shopform' element={<Protected><Shopform /></Protected>} />
          <Route path='/Shopform/:id' element={<Protected><Shopform /></Protected>} />
          <Route path='/shoplist' element={<Protected><Shoplist /></Protected>} />
          <Route path='/shoplist/shopdetails/:id' element={<Protected><Shopdetails /></Protected>} />

          <Route path='/architecture' element={<Protected><Architectureform /></Protected>} />
          <Route path='/architecture/:id' element={<Protected><Architectureform /></Protected>} />
          <Route path='/architecturelist' element={<Protected><Architecturelist /></Protected>} />
          <Route path='/architecturelist/architecturedetails/:id' element={<Protected><Architecturedetails /></Protected>} />

          <Route path='/carpenterform' element={<Protected><Carpenterform /></Protected>} />
          <Route path='/carpenterform/:id' element={<Protected><Carpenterform /></Protected>} />
          <Route path='/carpenterlist' element={<Protected><Carpenterlist /></Protected>} />
          <Route path='/carpenterlist/carpenterdetails/:id' element={<Protected><Carpenterdetails /></Protected>} />

          <Route path='/quotation' element={<Protected><QuotationFrom /></Protected>} />
          <Route path='/quotation/:id' element={<Protected><QuotationFrom /></Protected>} />
          <Route path='/quotationlist' element={<Protected><Quotationlist /></Protected>} />
          <Route path='/quotationlist/userdetails/:id' element={<Protected><Userdetails /></Protected>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
