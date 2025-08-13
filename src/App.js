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
import Salesform from './pages/salesperson/Salesfom';
import Marketingform from './pages/marketingperson/Marketingform';
import MyMarketingform from './pages/marketingperson/MyMarketingform';
import Marketinglist from './pages/marketingperson/Marketinglist';
import Saleslist from './pages/salesperson/Saleslist';
import QuotationForm from './pages/Quotation/QuotationForm'

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

          <Route path={`${routeUrls.SALEFORM}`} element={<Protected><Salesform /></Protected>} />
          <Route path={`${routeUrls.SALEFORM}/:id`} element={<Protected><Salesform /></Protected>} />
          <Route path={routeUrls.SALELIST} element={<Protected><Saleslist /></Protected>} />



          <Route path={`${routeUrls.MRAKETINGFORM}`} element={<Protected><Marketingform /></Protected>} />
          <Route path={`${routeUrls.MRAKETINGFORM}/:id`} element={<Protected><Marketingform /></Protected>} />
          <Route path={routeUrls.MARKETINGLIST} element={<Protected><Marketinglist/></Protected>} />

          
          <Route path={`${routeUrls.MYMRAKETINGFORM}`} element={<Protected><MyMarketingform /></Protected>} />
          <Route path={`${routeUrls.MYMRAKETINGFORM}/:id`} element={<Protected><MyMarketingform /></Protected>} />
          




        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
