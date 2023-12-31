import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import { FaPlus, FaPowerOff } from "react-icons/fa";
import routeUrls from "../../constants/routeUrls";
let BaseUrl = process.env.REACT_APP_BASEURL

function Dashboard() {
  const navigate = useNavigate(); 
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
 
  const [data, setData] = useState({
    quotationCount: 0,
    shopCount: 0,
    carpenterCount: 0,
    architecCount: 0,
    salespersonCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);
        const timestamp = Date.now();

        const [quotationResponse, shopResponse, carpenterResponse, architecResponse, salespersonResponse] = await Promise.all([
          axios.get(`${BaseUrl}/quotation/listdata?timestamp=${timestamp}`, { headers: { Authorization: `Bearer ${saved}` } }),
          axios.get(`${BaseUrl}/shop/list?timestamp=${timestamp}`, { headers: { Authorization: `Bearer ${saved}` } }),
          axios.get(`${BaseUrl}/carpenter/list?timestamp=${timestamp}`, { headers: { Authorization: `Bearer ${saved}` } }),
          axios.get(`${BaseUrl}/architec/list?timestamp=${timestamp}`, { headers: { Authorization: `Bearer ${saved}` } }),
          axios.get(`${BaseUrl}/salesperson/AllList?timestamp=${timestamp}`, { headers: { Authorization: `Bearer ${saved}` } }),
        ]);

        setData({
          quotationCount: quotationResponse.data.count,
          shopCount: shopResponse.data.count,
          carpenterCount: carpenterResponse.data.count,
          architecCount: architecResponse.data.count,
          salespersonCount: salespersonResponse.data.count,
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };
  const handleLogoutConfirm = (event) => {
    event.stopPropagation();
    localStorage.clear();
    setLogoutModalOpen(false);
    navigate(routeUrls.LOGIN);
  };
  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  return (
    <>
      {loading ? (
       <div className="d-flex justify-content-center align-items-center vh-100">
       <h1 className="color font-bold text-4xl">
      TIMBERLAND
     </h1>
     </div>
      ) : ( 
        <>
        <div className="n-color text-white flex justify-between items-center mb-3 rounded-br-full">
        <div className="md:pl-12 pr-6 md:py-4 py-3 pl-2">
          <p className="md:text-2xl text-1xl font-bold">TIMBERLAND</p>
        </div>
        <div className="md:pr-10 pr-6 md:py-4 py-2 ">
          <button
            className="bg-light text-black mx-1 px-3 py-1 rounded-full"
            onClick={handleLogout}
          >
            <FaPowerOff />
          </button>
        </div>
      </div>
      <div className="container nameinfo">
        <div className="n-color text-white rounded-md">
          <ul className="flex	align-middle	justify-around">
            <Link to={routeUrls.QUOTATIONLIST}>
              <li>
                Quotation
                <p className="text-center">{data.quotationCount}</p>
              </li>
            </Link>
            <Link to={routeUrls.SHOPLIST}>
              <li>
                Shop
                <p className="text-center">{data.shopCount}</p>
              </li>
            </Link>
            <Link to={routeUrls.CARPENTERLIST}>
              <li>
                Carpenter
                <p className="text-center">{data.carpenterCount}</p>
              </li>
            </Link>
            <Link to={routeUrls.ARCHITECTURELIST}>
              <li>
                Architec
                <p className="text-center">{data.architecCount}</p>
              </li>
            </Link>
            <Link to={routeUrls.SALELIST}>
              <li className="break-words">
                Sales Person
                <p className="text-center">{data.salespersonCount}</p>
              </li>
            </Link>
          </ul>
        </div>
      </div>
      <Container>
        <Row>
          <Col md={6} sm={12}>
            <Link to={isLogoutModalOpen ? '#' :routeUrls.QUOTATION}>
              <div className="bg-[#71675E] md:m-10 sm:m-0 my-3 rounded-lg py-8 xl:px-44 lg:px-32 md:px-8 md:py-6 px-24 create">
                <div>
                  <img
                    src={require("../../Images/q-3.jpg")}

                    // src={require("../../Images/q-3.jpg")}
                    alt=""
                    // className="w-40"
                    style={{width:'300px',height:'180px'}}

                  />
                  <p className="form  px-4 py-3 font-bold text-white bg-[#49413C] rounded-md">
                    Quotation
                  </p>
                  <div className="plus bg-[#49413C] text-white">
                    <FaPlus className="ms-3 my-3  text-2xl " />
                  </div>
                </div>
              </div>
            </Link>
          </Col>
          <Col md={6} sm={12}>
            <Link to={isLogoutModalOpen ? '#' :routeUrls.SHOPFORM}>
              <div className="bg-[#71675E] md:m-10 sm:m-0 my-3 rounded-lg py-8 xl:px-44 lg:px-32 md:px-8 md:py-6 px-24 create">
                <div>
                  <img
                    src={require("../../Images/shop3.webp")}
                    // src={require("../../Images/shop-2.jpg")}
                    alt=""
                    // className="w-40"
                    style={{width:'300px',height:'180px'}}
                  />
                </div>
                <p className="form text-white px-4 py-3 font-bold bg-[#49413C] rounded-md">
                  Shop
                </p>
                <div className="plus  bg-[#49413C] text-white">
                  <FaPlus className="ms-3 my-3 text-2xl" />
                </div>
              </div>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md={6} sm={12}>
                <Link to={isLogoutModalOpen ? '#' :routeUrls.CARPENTERFORM}>
            <div className="bg-[#71675E] md:m-10 my-3 sm:m-0  rounded-lg py-8 xl:px-44 lg:px-32 md:px-10 md:py-6 px-24 create">
              <div>
                {" "}
                <img
                  src={require("../../Images/carpenter4.jpg")}
                  // src={require("../../Images/carpenter5.webp")}
                  alt=""
                  // className="w-62"
                  style={{width:'300px',height:'180px'}}

                />
              </div>
              <p className="form text-white px-4 py-3 font-bold bg-[#49413C] rounded-md">
                Carpenter
              </p>
                <div className="plus  bg-[#49413C] text-white">
                  <FaPlus className="ms-3 my-3 text-2xl" />
                </div>
            </div>
              </Link>
          </Col>
          <Col md={6} sm={12}>
              <Link to={isLogoutModalOpen ? '#' :routeUrls.ARCHITECTURE}>
            <div className="bg-[#71675E] md:m-10 sm:m-0 my-3 rounded-lg py-8 xl:px-44 lg:px-32 md:px-8 md:py-6 px-24 create">
              <div>
                {" "}
                <img
                  src={require("../../Images/archite..2.png")}
                  // src={require("../../Images/architec2.jpg")}
                  alt=""
                  style={{width:'300px',height:'180px'}}
                  // className="w-72"
                />
              </div>
              <p className="form text-white px-4 py-3 font-bold bg-[#49413C] rounded-md">
                Architecture
              </p>
                <div className="plus text-white  bg-[#49413C]">
                  <FaPlus className="ms-3 my-3 text-2xl" />
                </div>
            </div>
              </Link>
          </Col>
        </Row>
      </Container>
      {isLogoutModalOpen && (
        <div className="logout-modal ">
          <div className="logout color">
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button className=" rounded-full n-color" onClick={(e)=>{handleLogoutConfirm (e)}}>
                OK
              </button>
              <button className=" rounded-full n-color" onClick={handleLogoutCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </>
  );
}
export default Dashboard;
