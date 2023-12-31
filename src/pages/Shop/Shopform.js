import React, { useEffect, useState, useCallback } from "react";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import Header from "../../components/Header";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";

let BaseUrl = process.env.REACT_APP_BASEURL;

function Shopform() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    shopName: "",
    mobileNo: "",
    address: "",
    message: "",
    showModal: false,
  }); // Create New Shop

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const saved = localStorage.getItem(process.env.REACT_APP_KEY);
  
          const response = await axios.get(`${BaseUrl}/shop/viewdata/${id}`, {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          });
  
          const shopData = response.data.data;
          setFormData((prevData) => ({
            ...prevData,
            shopName: shopData.shopName,
            mobileNo: shopData.mobileNo,
            address: shopData.address,
          }));
        } catch (error) {
          console.log(error);
          setFormData((prevData) => ({
            ...prevData,
            message: error.response.data.message,
            showModal: true,
          }));
        }
      }
    };
  
    fetchData();
  
  }, [id]);
  
  const handleShop = async (e) => {
    e.preventDefault();
  
    const { shopName, mobileNo, address } = formData;
  
    if (!shopName && !mobileNo) {
      setFormData((prevData) => ({
        ...prevData,
        message: "Please Fill Required Fields",
        showModal: true,
      }));
      return;
    }
  
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
  
    try {
      if (id) {
        const response = await axios.put(
          `${BaseUrl}/shop/data/update/${id}`,
          {
            shopName,
            mobileNo,
            address,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
  
        if (response.data && response.data.status === "Success") {
          setFormData((prevData) => ({
            ...prevData,
            message: "Shop Update successfully",
            showModal: true,
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            message: response.data.message,
            showModal: true,
          }));
        }
      } else {
        const response = await axios.post(
          `${BaseUrl}/shop/data/create`,
          {
            shopName,
            mobileNo,
            address,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
  
        if (response.data && response.data.status === "Success") {
          const newSaved = response.data.token;
          localStorage.setItem(process.env.REACT_APP_KEY, newSaved);
          setFormData((prevData) => ({
            ...prevData,
            message: "Shop Create successfully",
            showModal: true,
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            message: response.data.message,
            showModal: true,
          }));
        }
      }
    } catch (error) {
      console.log(error);
      setFormData((prevData) => ({
        ...prevData,
        message: error.response.data.message,
        showModal: true,
      }));
    }
  };
  
  const handleClose = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      showModal: false,
    }));
    if (formData.message.includes("successfully")) {
      navigate(routeUrls.DASHBOARD);
    }
  }, [formData.message, navigate]);

  useEffect(() => {
    if (formData.showModal) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [formData.showModal, handleClose]);

  return (
    <>
      <Header />
      <div className="md:ps-24 ps-10">
        <Breadcrumb className="font-bold color">
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.DASHBOARD }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.SHOPFORM }}
          >
            ShopForm
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <p className="md:text-4xl text-2xl color font-bold text-center mb-3">
        {id ? "Update  ShopForm" : "Create ShopForm"}
      </p>
      <Container>
        <Form className="w-50 mx-auto" onSubmit={handleShop}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold color">
              Shop Name
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Shop Name"
              value={formData.shopName}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  shopName: e.target.value,
                }))
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold color">
              Moblie No.
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Moblie No"
              value={formData.mobileNo}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  mobileNo: e.target.value,
                }))
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold color">Address :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  address: e.target.value,
                }))
              }
            />
          </Form.Group>
          <button type="submit" className="btn n-color md:py-1 text-white w-full">
            Submit
          </button>
        </Form>
      </Container>
      <Modal show={formData.showModal} onHide={handleClose}>
        <Modal.Body
          className={
            formData.message.includes("successfully")
              ? "modal-success"
              : "modal-error"
          }
        >
          {formData.message}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Shopform;
