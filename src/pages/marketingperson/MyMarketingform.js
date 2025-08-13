import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";

let BaseUrl = process.env.REACT_APP_BASEURL;

function Salesform() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [Name, setName] = useState(""); // create salesperson
  const [mobileNo, setMoblieNo] = useState(""); // create salesperson
  const [message, setMessage] = useState(""); // show error message and create 
  const [showModal, setShowModal] = useState(false); // show model
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const saved = localStorage.getItem(process.env.REACT_APP_KEY);
          const response = await axios.get(`${BaseUrl}/marketingPerson/view/${id}`, {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          });

          const SalespersonData = response.data.data;
          setName(SalespersonData.login_id);
          setMoblieNo(SalespersonData.mobileNo);
        } catch (error) {
          console.log(error);
          setMessage(error.message);
          setShowModal(true);
        }
      }
    };

    fetchData();

  }, [id]);


  const handleSalesperson = async (e) => {
    e.preventDefault();
    if (!Name && !mobileNo) {
      setMessage("Please Fill Required Fields");
      setShowModal(true);
      return;
    }

    const saved = localStorage.getItem(process.env.REACT_APP_KEY);

    try {
      if (id) {
        console.log(id);
        const response = await axios.put(
          `${BaseUrl}/marketingPerson/update/${id}`,
          {
            login_id: Name,
            mobileNo: mobileNo,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );

        if (response.data && response.data.status === "Success") {
          setMessage("Marketing person Update successfully");
          setShowModal(true);
        } else {
          setMessage(response.data.message);
          setShowModal(true);
        }
      } else {
        if (typeof Name !== 'string' || Name.trim() === '') {
          alert('Name must be a non-empty string');
          return;
        }

        if (!/^\d{10}$/.test(mobileNo)) {
          alert('Mobile number must be exactly 10 digits');
          return;
        }
        const response = await axios.post(
          `${BaseUrl}/marketingPerson/create`,
          {
            login_id: Name,
            password: mobileNo,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );

        if (response.data && response.data.status === "Success") {
          setMessage("Marketing Created successfully");
          setShowModal(true);
        } else {
          setMessage(response.data.message);
          setShowModal(true);
        }
      }
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
      setShowModal(true);
    }
  };

  const handleClose = useCallback(() => {
    setShowModal(false);
    if (message.includes("successfully")) {
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
        <Breadcrumb className="font-bold color">
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.DASHBOARD }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: routeUrls.MRAKETINGFORM }}>
            Marketing Person Form
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <p className="md:text-4xl text-2xl font-bold color text-center mb-3">
        {id ? "Update SalepersonForm" : "Create Marketing Person Form"}
      </p>
      <Container>
        <Form className="w-50 mx-auto" onSubmit={handleSalesperson}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold color">
              Name
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Marketing Person Name :"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold color">
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

          <button type="submit" className="btn n-color text-white w-full">
            Submit
          </button>
        </Form>
      </Container>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body
          className={
            message.includes("successfully") ? "modal-success" : "modal-error"
          }
        >
          {message}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Salesform;