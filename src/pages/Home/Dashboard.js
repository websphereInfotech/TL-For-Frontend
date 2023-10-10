import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaPowerOff } from "react-icons/fa";
import routeUrls from "../../constants/routeUrls";

function Dashboard() {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [architecCount, setArchitectureCount] = useState(0);
  const [carpenterCount, setCarpenterCount] = useState(0);
  const [shopCount, setShopCount] = useState(0);
  const [quotation, setQuotation] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    async function fetchData() {
      try {
        const timestamp = Date.now();
        const architecCountRes = await axios.get(
          `http://localhost:2002/api/architec/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        setArchitectureCount(architecCountRes.data.count);
        const carpenterCountRes = await axios.get(
          `http://localhost:2002/api/carpenter/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        setCarpenterCount(carpenterCountRes.data.count);
        const shopCountRes = await axios.get(
          `http://localhost:2002/api/shop/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        setShopCount(shopCountRes.data.count);
        const quotationRes = await axios.get(
          `http://localhost:2002/api/quotation/listdata?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        setQuotation(quotationRes.data.count);
      }
      catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   const saved = localStorage.getItem(process.env.REACT_APP_KEY);
  //   axios
  //     .get(`http://localhost:2002/api/quotation/listdata`, {
  //       headers: {
  //         Authorization: `Bearer ${saved}`,
  //       },
  //     })
  //     .then(function (response) {
  //       setQuotation(response.data.data.length);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }, []);
  const handleLogout = () => {
    setLogoutModalOpen(true);
  };
  const handleLogoutConfirm = () => {
    localStorage.clear();
    setLogoutModalOpen(false);
    window.location.href = routeUrls.LOGIN;
  };
  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  return (
    <>
      <div className="bg-dark text-white flex justify-between items-center mb-3 rounded-br-full">
        <div className="md:pl-12 pr-6 md:py-4 py-2 pl-2">
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
      <div className="container">
        <div className="bg-dark text-white rounded-md">
          <ul className="flex	align-middle	justify-around">
            <Link to={routeUrls.QUOTATIONLIST}>
              <li>
                Quotation
                <p className="text-center">{quotation}</p>
              </li>
            </Link>
            <Link to={routeUrls.SHOPLIST}>
              <li>
                Shop
                <p className="text-center">{shopCount}</p>
              </li>
            </Link>
            <Link to={routeUrls.CARPENTERLIST}>
              <li>
                Carpenter
                <p className="text-center">{carpenterCount}</p>
              </li>
            </Link>
            <Link to={routeUrls.ARCHITECTURELIST}>
              <li>
                Architecture
                <p className="text-center">{architecCount}</p>
              </li>
            </Link>
          </ul>
        </div>
      </div>
      <Container>
        <Row>
          <Col md={6} sm={12}>
            <Link to={routeUrls.QUOTATION}>
              <div className="bg-zinc-600 md:m-10 sm:m-0 my-3 rounded-lg py-8 xl:px-44 lg:px-32 md:px-8 md:py-6 px-24 create">
                <div>
                  {" "}
                  <img
                    src={require("../../Images/form-1.jpg")}
                    alt=""
                    className="w-40"
                  />
                  <p className="form border-1 px-4 py-2 font-bold bg-white rounded-md">
                    Quotation
                  </p>
                  <div className="plus border-1 bg-white">
                    <FaPlus className="ms-3 my-3  text-2xl " />
                  </div>
                </div>
              </div>
            </Link>
          </Col>
          <Col md={6} sm={12}>
            <Link to={routeUrls.SHOPFORM}>
              <div className="bg-zinc-600 md:m-10 sm:m-0 my-3 rounded-lg py-8 xl:px-44 lg:px-32 md:px-8 md:py-6 px-24 create">
                <div>
                  <img
                    src={require("../../Images/shop-1.png")}
                    alt=""
                    className="w-40"
                  />
                </div>
                <p className="form border-1 px-4 py-2 font-bold bg-white rounded-md">
                  Shop
                </p>
                <div className="plus border-1 bg-white">
                  <FaPlus className="ms-3 my-3 text-2xl" />
                </div>
              </div>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md={6} sm={12}>
            <div className="bg-zinc-600 md:m-10 my-3 sm:m-0  rounded-lg py-8 xl:px-44 lg:px-32 md:px-10 md:py-6 px-24 create">
              <div>
                {" "}
                <img
                  src={require("../../Images/images.png")}
                  alt=""
                  className="w-40"
                />
              </div>
              <p className="form border-1 px-4 py-2 font-bold bg-white rounded-md">
                Carpenter
              </p>
              <Link to={routeUrls.CARPENTERFORM} class="stretched-link">
                <div className="plus border-1 bg-white">
                  <FaPlus className="ms-3 my-3 text-2xl" />
                </div>
              </Link>
            </div>
          </Col>
          <Col md={6} sm={12}>
            <div className="bg-zinc-600 md:m-10 sm:m-0 my-3 rounded-lg py-8 xl:px-44 lg:px-32 md:px-8 md:py-6 px-24 create">
              <div>
                {" "}
                <img
                  src={require("../../Images/architecture.jpg")}
                  alt=""
                  className="w-40"
                />
              </div>
              <p className="form border-1 px-4 py-2 font-bold bg-white rounded-md">
                Architecture
              </p>
              <Link to={routeUrls.ARCHITECTURE} class="stretched-link">
                <div className="plus border-1 bg-white">
                  <FaPlus className="ms-3 my-3 text-2xl" />
                </div>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
      {isLogoutModalOpen && (
        <div className="logout-modal ">
          <div className="logout">
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button className=" rounded-full" onClick={handleLogoutConfirm}>
                OK
              </button>
              <button className=" rounded-full" onClick={handleLogoutCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Dashboard;
