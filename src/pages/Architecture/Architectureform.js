import React, { useEffect, useState, useCallback } from "react";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import Header from "../../components/Header";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";

let BaseUrl = process.env.REACT_APP_BASEURL;

function Architectureform() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    architecsName: "",
    mobileNo: "",
    address: "",
    message: "",
    showModal: false,
  }); // Create New Architecs

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const saved = localStorage.getItem(process.env.REACT_APP_KEY);
          console.log(saved);
  
          const response = await axios.get(`${BaseUrl}/architec/viewdata/${id}`, {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          });
  
          const architecData = response.data.data;
          setFormData((prevData) => ({
            ...prevData,
            architecsName: architecData.architecsName,
            mobileNo: architecData.mobileNo,
            address: architecData.address,
          }));
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
  
    fetchData();
  }, [id]);
  
  const handleArchitecture = async (e) => {
    e.preventDefault();
    const { architecsName, mobileNo, address } = formData;
  
    if (!architecsName && !mobileNo) {
      setFormData((prevData) => ({
        ...prevData,
        message: "Please Fill Required Fields",
        showModal: true,
      }));
      return;
    }
  
    try {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      console.log(saved);
  
      if (id) {
        const response = await axios.put(
          `${BaseUrl}/architec/data/update/${id}`,
          {
            architecsName,
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
            message: "Architecture Update successfully",
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
          `${BaseUrl}/architec/data/create`,
          {
            architecsName,
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
          const saved = response.data.token;
          localStorage.setItem(process.env.REACT_APP_KEY, saved);
          setFormData((prevData) => ({
            ...prevData,
            message: "Architecture Create successfully",
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
            linkProps={{ to: routeUrls.ARCHITECTURE }}
          >
            ArchitecForm
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <p className="md:text-4xl text-2xl color font-bold text-center mb-3">
        {id ? "Update  ArchitecForm" : "Create ArchitecForm"}
      </p>
      <Container>
        <Form className="w-50 mx-auto" onSubmit={handleArchitecture}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold color">
              Architec Name
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Architec Name"
              value={formData.architecsName}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  architecsName: e.target.value,
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

export default Architectureform;
