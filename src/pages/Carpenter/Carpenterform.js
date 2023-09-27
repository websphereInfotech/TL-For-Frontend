import React, { useState } from 'react'
import { Breadcrumb, Container, Form } from 'react-bootstrap'
import Header from '../../components/Header'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Carpenterform() {
    const [carpentersName,setCarpenter] = useState('');
    const [mobileNo,setMobileNo] = useState('');
    const [Address,setAddress] = useState('');
    const navigate = useNavigate();
    
    const handleCarpenter = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:2002/api/carpenter/data/create`, {
            carpentersName: carpentersName,
            mobileNo:  mobileNo,
            Address: Address
        })
            .then(function (response) {
                console.log(response.data.data);
                if (response.data.status === "Success") {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    return (
        <>
            <Header />
            <div className='md:ps-24 ps-10'>
                <Breadcrumb className='font-bold'>
                    <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="/carpenterform">Carpenter Form</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <p className='md:text-4xl text-2xl font-bold text-center mb-3'>Create CarpenterForm</p>
            <Container>
                <Form className='w-50 mx-auto' onSubmit={handleCarpenter}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>Carpenter Name :</Form.Label>
                        <Form.Control type="text" placeholder="Carpenter Name" value={carpentersName} onChange={(e)=> setCarpenter(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Moblie No. :</Form.Label>
                        <Form.Control type="text" placeholder="Moblie No" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Address :</Form.Label>
                        <Form.Control type="text" placeholder="Address" value={Address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                    <button type="submit" className='btn bg-black text-white w-full'>Submit</button>
                </Form>
            </Container>
        </>
    )
}

export default Carpenterform