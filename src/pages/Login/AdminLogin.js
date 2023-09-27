  import React, { useState } from 'react'
  import { Col, Container, Form, Row } from 'react-bootstrap'
  import axios from 'axios';
  import { Modal, Button } from 'react-bootstrap';
  import { useNavigate } from 'react-router-dom'; 

  function AdminLogin() {
    const emoji = String.fromCodePoint(128075);
    const [login_id, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [apiMessage, setApiMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post(`http://localhost:2002/api/login`, {
        login_id: login_id,
        password: password
      })
      .then(function (response) {
        console.log(response.data.token);
        localStorage.setItem( process.env.KEY,response.data.token)
        if (response.status === 200) {
          if (response.data.status === "Success") {
            setApiMessage("Login successfully !");
            setShowModal(true);
          } else {
            setApiMessage("Login failed. Check your login_id or password.");
            setShowModal(true);
          }
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setApiMessage("Enter Valid Login_id");
            setShowModal(true);
          } else if (error.response.status === 400) {
            setApiMessage("Enter Valid Password");
            setShowModal(true);
          }
        } else {
          setApiMessage("An error occurred while processing your request.");
          setShowModal(true);
        }
      });
  }
    const handleClose = () => {
      setShowModal(false);
      if (apiMessage.includes('successfully')) {
        navigate('/dashboard');
      }
    };
    return (
      <>
        <Container>
          <Row>
            <Col lg={4} md={6} sm={12} className='my-10 p-0 rounded-md bg-dark text-white'>
              <div className='text-left text-3xl xl:px-24 lg:px-14 md:px-20 px-24 md:my-48 my-10'>
                <p>Timberland</p>
                <p>Super</p>
                <p>Admin Login</p>
              </div>
            </Col>
            <Col lg={8} md={6} sm={12} className='mx-auto my-32'>
              <p className='text-4xl mb-4 font-bold text-center'>Welcome,back!<span className='text-2xl'>{emoji}</span></p>
              <Form className='w-50 md:w-72 sm:w-96 mx-auto' onSubmit={handleSubmit} >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className='font-bold'>Login Id :</Form.Label>
                  <Form.Control type="text" placeholder="abc@gmail.com" value={login_id} onChange={(e) => setLogin(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className='font-bold'>Password :</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
               <input type="submit" value="Login" className='btn bg-black text-white lg:w-60 md:w-40 w-36  xl:mx-20 lg:mx-10 md:mx-1 sm:mx-0' />
              </Form>
            </Col>
          </Row>
          <Modal show={showModal} onHide={handleClose} >
            <Modal.Body  className={apiMessage.includes('successfully') ? 'modal-success' : 'modal-error'}>{apiMessage}</Modal.Body>
            <Modal.Footer  className={apiMessage.includes('successfully') ? 'modal-success' : 'modal-error'}>
              <Button variant="light" onClick={handleClose} className='mx-auto'>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </>
    )
  }

  export default AdminLogin