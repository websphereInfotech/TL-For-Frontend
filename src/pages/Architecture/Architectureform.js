import React, { useState } from 'react'
import { Breadcrumb, Container, Form } from 'react-bootstrap'
import Header from '../../components/Header'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Architectureform() {
    const [architecsName,setArchitecs] = useState('');
    const [mobileNo,setMoblieNo] = useState('');
    const [Address,setAddress] = useState('');
    const navigate = useNavigate();

    const handleArchitecture = (e) => {
        e.preventDefault();
        const saved = localStorage.getItem( process.env.KEY);
        console.log('Token from localStorage:', saved); 
        axios.post(`http://localhost:2002/api/architec/data/create`, {
            architecsName: architecsName,
            mobileNo: mobileNo,
            Address: Address
        }, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
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
                    <Breadcrumb.Item href="/architecture">ArchitectureForm</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <p className='md:text-4xl text-2xl font-bold text-center mb-3'>Create  Architecture Form</p>
            <Container>
                <Form className='w-50 mx-auto' onSubmit={handleArchitecture}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>Architecture Name :</Form.Label>
                        <Form.Control type="text" placeholder="Architecture Name" value={architecsName} onChange={(e) => setArchitecs(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Moblie No. :</Form.Label>
                        <Form.Control type="text" placeholder="Moblie No" value={mobileNo} onChange={(e) => setMoblieNo(e.target.value)} />
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

export default Architectureform