import React, { useEffect, useState, useCallback } from "react";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import Header from "../../components/Header";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";

let BaseUrl = process.env.REACT_APP_BASEURL;

function Carpenterform() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    carpentersName: "",
    mobileNo: "",
    address: "",
    message: "",
    showModal: false,
  }); // Create New Carpenter

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);

      axios
        .get(`${BaseUrl}/carpenter/viewdata/${id}`, {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        })
        .then(function (response) {
          const carpenterData = response.data.data;
          setFormData((prevData) => ({
            ...prevData,
            carpentersName: carpenterData.carpentersName,
            mobileNo: carpenterData.mobileNo,
            address: carpenterData.address,
          }));
        })
        .catch(function (error) {
          console.log(error);
          setFormData((prevData) => ({
            ...prevData,
            message: error.response.data.message,
            showModal: true,
          }));
        });
    }
  }, [id]);

  const handleCarpenter = (e) => {
    e.preventDefault();

    const { carpentersName, mobileNo, address } = formData;

    if (!carpentersName && !mobileNo) {
      setFormData((prevData) => ({
        ...prevData,
        message: "Please Fill Required Fields",
        showModal: true,
      }));
      return;
    }
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);

    if (id) {
      axios
        .put(
          `${BaseUrl}/carpenter/data/update/${id}`,
          {
            carpentersName,
            mobileNo,
            address,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        )
        .then(function (response) {
          if (response.data && response.data.status === "Success") {
            setFormData((prevData) => ({
              ...prevData,
              message: "Carpenter Update successful",
              showModal: true,
            }));
          } else {
            setFormData((prevData) => ({
              ...prevData,
              message: response.data.message,
              showModal: true,
            }));
          }
        })
        .catch(function (error) {
          console.log(error);
          setFormData((prevData) => ({
            ...prevData,
            message: error.response.data.message,
            showModal: true,
          }));
        });
    } else {
      axios
        .post(
          `${BaseUrl}/carpenter/data/create`,
          {
            carpentersName,
            mobileNo,
            address,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        )
        .then(function (response) {
          if (response.data && response.data.status === "Success") {
            const saved = response.data.token;
            localStorage.setItem(process.env.REACT_APP_KEY, saved);
            setFormData((prevData) => ({
              ...prevData,
              message: "Carpenter Create successful",
              showModal: true,
            }));
          } else {
            setFormData((prevData) => ({
              ...prevData,
              message: response.data.message,
              showModal: true,
            }));
          }
        })
        .catch(function (error) {
          console.log(error);
          setFormData((prevData) => ({
            ...prevData,
            message: error.response.data.message,
            showModal: true,
          }));
        });
    }
  };

  const handleClose = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      showModal: false,
    }));
    if (formData.message.includes("successful")) {
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
            linkProps={{ to: routeUrls.CARPENTERFORM }}
          >
            CarpenterForm
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <p className="md:text-4xl text-2xl color font-bold text-center mb-3">
        {id ? "Update  CarpenterForm" : "Create CarpenterForm"}
      </p>
      <Container>
        <Form className="w-50 mx-auto" onSubmit={handleCarpenter}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold color">
              Carpenter Name
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Carpenter Name"
              value={formData.carpentersName}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  carpentersName: e.target.value,
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
          <button type="submit" className="btn n-color md:py-1 bg-black text-white w-full">
            Submit
          </button>
        </Form>
      </Container>
      <Modal show={formData.showModal} onHide={handleClose}>
        <Modal.Body
          className={
            formData.message.includes("successful")
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

export default Carpenterform;
