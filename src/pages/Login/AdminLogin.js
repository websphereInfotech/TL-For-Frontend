import React, { useState, useCallback, useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

function AdminLogin() {
  const emoji = String.fromCodePoint(128075);
  const [login_id, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:2002/api/login`, {
      login_id: login_id,
      password: password
    })
      .then(function (response) {
        if (response.data && response.data.status === 'Success') {
          const saved = response.data.token;
          localStorage.setItem(process.env.REACT_APP_KEY, saved);
          setMessage('Login successful');
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
      })
  }
  const handleClose = useCallback(() => {
    setShowModal(false);
    if (message.includes('successful')) {
      navigate('/dashboard');
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
      <div className='px-10 container mx-auto'>
        <Row className='lg:pl-12 xl:pl-12 lg:pr-10 px-0'>
          <Col lg={4} md={6} sm={12} className='my-10 p-0 rounded-md bg-dark text-white'>
            <div className='text-left text-3xl xl:px-24 lg:px-14 md:px-20 px-20 md:my-48 my-10'>
              <p>Timberland</p>
              <p>Super</p>
              <p>Admin Login</p>
            </div>
          </Col>
          <Col lg={8} md={6} sm={12} className='mx-auto md:my-32'>
            <p className='text-2xl md:text-4xl mb-4 font-bold text-center'>Welcome,back!<span className='text-2xl'>{emoji}</span></p>
            <Form className='w-50 md:w-72 sm:w-96 mx-auto' onSubmit={handleSubmit} >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className='font-bold'>Login Id
                  <span className='text-red-600'> &#8727; </span>
                  :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="abc@gmail.com"
                  value={login_id}
                  onChange={(e) => setLogin(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className='font-bold'>Password
                  <span className='text-red-600'> &#8727; </span>
                  :</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <input type="submit" value="Login" className='btn bg-black text-white lg:w-60 md:w-40 w-36  xl:mx-20 lg:mx-10 md:mx-1 sm:mx-0' />
            </Form>
          </Col>
        </Row>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body className={message.includes('successful') ? 'modal-success' : 'modal-error'}>{message}</Modal.Body>
      </Modal>
    </>
  )
}

export default AdminLogin