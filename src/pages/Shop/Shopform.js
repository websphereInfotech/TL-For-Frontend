import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";
let BaseUrl = process.env.REACT_APP_BASEURL;
function Shopform() {
  const [shopName, setShopName] = useState("");
  const [mobileNo, setMoblieNo] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      axios
        .get(`${BaseUrl}/api/shop/viewdata/${id}`, {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        })
        .then(function (response) {
          const shopData = response.data.data;
          setShopName(shopData.shopName);
          setMoblieNo(shopData.mobileNo);
          setAddress(shopData.address);
        })
        .catch(function (error) {
          console.log(error);
          setMessage(error.message);
          setShowModal(true);
        });
    }
  }, [id]);

  const handleShop = (e) => {
    e.preventDefault();
    if (!shopName && !mobileNo) {
      setMessage("Please Fill Required Fields");
      setShowModal(true);
      return;
    }
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    if (id) {
      console.log(id);
      axios
        .put(
          `${BaseUrl}/shop/data/update/${id}`,
          {
            shopName: shopName,
            mobileNo: mobileNo,
            address: address,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        )
        .then(function (response) {
          if (response.data && response.data.status === "Success") {
            setMessage("Shop  Update successful");
            setShowModal(true);
          } else {
            setMessage(response.data.message);
            setShowModal(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          setMessage(error.response.data.message);
          setShowModal(true);
        });
    } else {
      axios
        .post(
          `${BaseUrl}/shop/data/create`,
          {
            shopName: shopName,
            mobileNo: mobileNo,
            address: address,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        )
        .then(function (response) {
          if (response.data && response.data.status === "Success") {
            setMessage("Shop Create successful");
            setShowModal(true);
          } else {
            setMessage(response.data.message);
            setShowModal(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          setMessage(error.response.data.message);
          setShowModal(true);
        });
    }
  };
  const handleClose = useCallback(() => {
    setShowModal(false);
    if (message.includes("successful")) {
      navigate(routeUrls.DASHBOARD);
    }
  }, [message, navigate]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showModal, handleClose]);
  return (
    <>
      <Header />
      <div className="md:ps-24 ps-10">
        <Breadcrumb className="font-bold">
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.DASHBOARD }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: routeUrls.SHOPFORM }}>
            ShopForm
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <p className="md:text-4xl text-2xl font-bold text-center mb-3">
        {id ? "Update ShopForm" : "Create ShopForm"}
      </p>
      <Container>
        <Form className="w-50 mx-auto" onSubmit={handleShop}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold">
              Shop Name
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Shop Name :"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold">
              Moblie No.
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Moblie No :"
              value={mobileNo}
              onChange={(e) => setMoblieNo(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold">Address :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address :"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <button type="submit" className="btn bg-black text-white w-full">
            Submit
          </button>
        </Form>
      </Container>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body
          className={
            message.includes("successful") ? "modal-success" : "modal-error"
          }
        >
          {message}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Shopform;
