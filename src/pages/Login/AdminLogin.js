import React, { useState, useCallback, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";

function AdminLogin() {
  const emoji = String.fromCodePoint(128075); //icon of hand
  const [login_id, setLogin] = useState(""); //set login id foe login
  const [password, setPassword] = useState(""); //set password for login
  const [showModal, setShowModal] = useState(false); //message model which is show when login success or not
  const [message, setMessage] = useState(""); //set message when login is success or not
  const navigate = useNavigate(); // for navigate page

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = process.env.REACT_APP_BASEURL;
      const response = await axios.post(`${url}/login`, {
        login_id: login_id,
        password: password,
      });
      if (response.data && response.data.status === "Success") {
              const saved = response.data.token;
              localStorage.setItem(process.env.REACT_APP_KEY, saved);
              setMessage("Login successful");
              setShowModal(true);
            } else {
              setMessage(message.response.data.message);
              setShowModal(true);
            }
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
      setShowModal(true);
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
      <div className="px-10 container mx-auto">
        <div className="lg:shadow-2xl lg:shadow-black lg:mt-10">
          <Row className="lg:pl-12 xl:pl-12 lg:pr-10 px-0 d-flex justify-center">
            <Col
              lg={4}
              md={6}
              sm={12}
              className="my-10 p-0 rounded-md text-white"
              style={{ position: "relative" }}
            >
              <div className="">
                <img
                  src={require("../../Images/timberland3.avif")}
                  alt=""
                  style={{ height: "500px", width: "500px" }}
                />
              </div>
              <div className="text-left text-3xl  lg:px-14 md:px-20 px-20 md:my-48 my-10 f-img">
                <p>Timberland</p>
                <p>Super</p>
                <p>Admin Login</p>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12} className=" md:my-32">
              <div className="mx-auto ">
                <p className="text-xl xl:text-4xl md:text-3xl mb-4 font-bold text-center md:ml-12 xl:ml-14 color">
                  Welcome,back!<span className="text-2xl">{emoji}</span>
                </p>
              </div>
              <Form
                className="w-50 md:w-72 sm:w-96 mx-auto "
                onSubmit={handleSubmit}
              >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="font-bold color">
                    Login Id
                    <span className="text-red-600"> &#8727; </span>:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="abc@gmail.com"
                    value={login_id}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="font-bold color">
                    Password
                    <span className="text-red-600"> &#8727; </span>:
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <input
                  type="submit"
                  value="Login"
                  className="btn n-color text-white w-full  md:mx-1 sm:mx-0 border-1 py-1"
                />
              </Form>
            </Col>
          </Row>
        </div>
      </div>
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

export default AdminLogin;
