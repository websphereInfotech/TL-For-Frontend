import React, { useEffect, useState, useCallback } from "react";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import Header from "../../components/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";

function Carpenterform() {
  const [carpentersName, setCarpenter] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      axios
        .get(`http://localhost:2002/api/carpenter/viewdata/${id}`, {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        })
        .then(function (response) {
          const carpenterData = response.data.data;
          setCarpenter(carpenterData.carpentersName);
          setMobileNo(carpenterData.mobileNo);
          setAddress(carpenterData.address);
        })
        .catch(function (error) {
          console.log(error);
          setMessage(error.response.data.message);
          setShowModal(true);
        });
    }
  }, [id]);
  const handleCarpenter = (e) => {
    e.preventDefault();
    if (!carpentersName && !mobileNo) {
      setMessage("Please Fill Required Fields");
      setShowModal(true);
      return;
    }
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    if (id) {
      console.log(id);
      axios
        .put(
          `http://localhost:2002/api/carpenter/data/update/${id}`,
          {
            carpentersName: carpentersName,
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
            setMessage("Carpenter  Update successful");
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
          `http://localhost:2002/api/carpenter/data/create`,
          {
            carpentersName: carpentersName,
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
            setMessage("Carpenter  Create successful");
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
      }, 3000);

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
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.CARPENTERFORM }}
          >
            CarpenterForm
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <p className="md:text-4xl text-2xl font-bold text-center mb-3">
        {id ? "Update CarpenterForm" : "Create CarpenterForm"}
      </p>
      <Container>
        <Form className="w-50 mx-auto" onSubmit={handleCarpenter}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold">
              Carpenter Name
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Carpenter Name"
              value={carpentersName}
              onChange={(e) => setCarpenter(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold">
              Moblie No.
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Moblie No"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold">Address :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
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

export default Carpenterform;
