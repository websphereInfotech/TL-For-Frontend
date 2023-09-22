import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'

function AdminLogin() {
  const emoji = String.fromCodePoint(128075);
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
            <p className='text-3xl mb-4 font-bold text-center'>Welcome,back!<span className='text-2xl'>{emoji}</span></p>
            <Form className='w-50 md:w-72 sm:w-96 mx-auto' >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className='font-bold'>Email Id</Form.Label>
                <Form.Control type="email" placeholder="abc@gmail.com" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className='font-bold'>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <a href="/formdata">
                <input type="button" value="Login" className='btn bg-black text-white lg:w-60 md:w-40 w-36  xl:mx-20 lg:mx-10 md:mx-1 sm:mx-0' />
              </a>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AdminLogin