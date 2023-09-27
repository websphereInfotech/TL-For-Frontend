import React, { useState } from 'react'
import Header from '../../components/Header'
import { Breadcrumb, Container, Form } from 'react-bootstrap'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Shopform() {
    const [shopName, setShopName] = useState('');
    const [mobileNo, setMoblieNo] = useState('');
    const [Address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleShop = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:2002/api/shop/data/create`, {
            shopName: shopName,
            mobileNo: mobileNo,
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
                    <Breadcrumb.Item href="/Shopform">Shopform</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <p className='md:text-4xl text-2xl font-bold text-center mb-3'>Create Shop From</p>
            <Container>
                <Form className='w-50 mx-auto' onSubmit={handleShop}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>Shop Name :</Form.Label>
                        <Form.Control type="text" placeholder="Shop Name :" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Moblie No. :</Form.Label>
                        <Form.Control type="text" placeholder="Moblie No :" value={mobileNo} onChange={(e) => setMoblieNo(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Address :</Form.Label>
                        <Form.Control type="text" placeholder="Address :" value={Address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                    <button type="submit" className='btn bg-black text-white w-full'>Submit</button>
                </Form>
            </Container>
        </>
    )
}

export default Shopform