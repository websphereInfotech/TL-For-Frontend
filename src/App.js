import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/app.css';
import AdminLogin from './pages/Login/AdminLogin';
import Shopform from './pages/Shop/Shopform';
import Architectureform from './pages/Architecture/Architectureform';
import Carpenterform from './pages/Carpenter/Carpenterform';
import Dashboard from './pages/Home/Dashboard';
import Architecturelist from './pages/Architecture/Architecturelist';
import Carpenterlist from './pages/Carpenter/Carpenterlist';
import Shoplist from './pages/Shop/Shoplist';
import Protected from './Service/Protected';
import routeUrls from './constants/routeUrls';
import Quotationlist from './pages/Quotation/Quotationlist';
<<<<<<< HEAD
import QuotationForm from './pages/Quotation/Quotationfrom';
=======
import Salesform from './pages/salesperson/Salesfom';
import Saleslist from './pages/salesperson/Saleslist';
>>>>>>> aa0ee3c09f5aa8f5bdd9346e8099f0c5d08ee3b3


function App() {
 
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exct path={routeUrls.LOGIN} element={<AdminLogin />} />
          <Route path="/" element={<Navigate to={routeUrls.LOGIN} />} />
  
          <Route path={routeUrls.DASHBOARD} element={<Protected><Dashboard /></Protected>} />

          <Route path={routeUrls.SHOPFORM} element={<Protected><Shopform /></Protected>} />
          <Route path={`${routeUrls.SHOPFORM}/:id`} element={<Protected><Shopform /></Protected>} />
          <Route path={routeUrls.SHOPLIST} element={<Protected><Shoplist /></Protected>} />

          <Route path={routeUrls.ARCHITECTURE} element={<Protected><Architectureform /></Protected>} />
          <Route path={`${routeUrls.ARCHITECTURE}/:id`} element={<Protected><Architectureform /></Protected>} />
          <Route path={routeUrls.ARCHITECTURELIST} element={<Protected><Architecturelist /></Protected>} />

          <Route path={routeUrls.CARPENTERFORM} element={<Protected><Carpenterform /></Protected>} />
          <Route path={`${routeUrls.CARPENTERFORM}/:id`} element={<Protected><Carpenterform /></Protected>} />
          <Route path={routeUrls.CARPENTERLIST} element={<Protected><Carpenterlist /></Protected>} />

          <Route path={routeUrls.QUOTATION} element={<Protected><QuotationForm /></Protected>} />
          <Route path={`${routeUrls.QUOTATION}/:id`} element={<Protected><QuotationForm /></Protected>} />
          <Route path={routeUrls.QUOTATIONLIST} element={<Protected><Quotationlist /></Protected>} />

          <Route path={`${routeUrls.SALEFORM}`} element={<Protected><Salesform/></Protected>} />
          <Route path={`${routeUrls.SALEFORM}/:id`} element={<Protected><Salesform/></Protected>} />

          <Route path={routeUrls.SALELIST} element={<Protected><Saleslist /></Protected>} />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
