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
  const [address, setaddress] = useState(""); // create salesperson
  const [addressTwo, setaddressTwo] = useState(""); // create salesperson
  const [date, setDate] = useState(""); // create salesperson
  const [nextEmergingDate, setNextEmergingDate] = useState(""); // create salesperson
  const [remark, setRemark] = useState(""); // create salesperson
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
          `${BaseUrl}/marketing/create`,
          {
            date: date,
            name: Name,
            mobileNo: mobileNo,
            address: address,
            addressTwo: addressTwo,
            nextEmergingDate: nextEmergingDate,
            remark: remark,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );

        if (response.data && response.data.status === "Success") {
          setMessage("Marketing Person Created successfully");
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
            Marketing Form
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <p className="md:text-4xl text-2xl font-bold color text-center mb-3">
        {id ? "Update Marketing Form" : "Create Marketing Form"}
      </p>
      <Container>
        <Form className="w-50 mx-auto" onSubmit={handleSalesperson}>
          <Form.Group className="mb-3" controlId="formBasicEmail">

            <div className="d-flex gap-3">
              <Form.Group className="mb-3 w-100" controlId="formDate">
                <Form.Label className="font-bold color">
                  Date<span className="text-red-600">*</span>:
                </Form.Label>
                <Form.Control
                  type="date"
                  min={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Yesterday's date
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>


              <Form.Group className="mb-3 w-100" controlId="formNextEmergingDate">
                <Form.Label className="font-bold color">
                  Next Emerging Date<span className="text-red-600"> </span>:
                </Form.Label>
                <Form.Control
                  type="date"
                  value={nextEmergingDate}
                  onChange={(e) => setNextEmergingDate(e.target.value)}
                />
              </Form.Group>
            </div>

            <Form.Label className="font-bold color">
              Name
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Name :"
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
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold color">
              Address
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Address :"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold color">
              Address Two
              <span className="text-red-600"> </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Address Two :"
              value={addressTwo}
              onChange={(e) => setaddressTwo(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold color">
              Remark
              <span className="text-red-600"> </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Remark :"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
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