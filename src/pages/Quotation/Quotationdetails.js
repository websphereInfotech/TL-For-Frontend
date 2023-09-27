import React from 'react'
import Header from '../../components/Header'
import { Container, Form } from 'react-bootstrap'

function Quotationdetails() {
  return (
    <>
        <Header />
        <p className='md:text-4xl text-2xl font-bold text-center mb-3'>QuotationDetails</p>
        <Container>
                <Form className='w-50 mx-auto'>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>Sr No. :</Form.Label>
                        <Form.Control type="text" placeholder="Sr No. :" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Description :</Form.Label>
                        <Form.Control type="text" placeholder="Description :" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Quantity :</Form.Label>
                        <Form.Control type="text" placeholder="Quantity :" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Rate:</Form.Label>
                        <Form.Control type="text" placeholder="Rate :" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Info:</Form.Label>
                        <Form.Control type="text" placeholder="Info :" />
                    </Form.Group>
                    <a href="/dashboard">
                        <input type="button" value="Submit" className='btn bg-black text-white w-full' />
                    </a>
                </Form>
            </Container>
    </>
  )
}

export default Quotationdetails