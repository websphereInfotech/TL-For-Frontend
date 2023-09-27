
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Select from 'react-select';
import { Breadcrumb, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function QuotationForm() {
    const [userName, setUserName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const [architecture, setArchitecture] = useState([]);
    const [carpenter, setCarpenter] = useState([]);
    const [shop, setShop] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [architectureResponse, carpenterResponse, shopResponse] = await Promise.all([
                    axios.get('http://localhost:2002/api/architec/listdata'), 
                    axios.get('http://localhost:2002/api/carpenter/listdata'),
                    axios.get('http://localhost:2002/api/shop/listdata') 
                ]);
                setArchitecture(architectureResponse.data);
                setCarpenter(carpenterResponse.data);
                setShop(shopResponse.data);
            } catch (error) {
                console.log('Multiple fetch failed');
            }
        };
        fetchData();
    }, []);

    const handleQuotation = (e) => {
        e.preventDefault();
        axios.post('http://localhost:2002/api/quotation/create', {
            userName: userName,
            mobileNo: mobileNo,
            address: address,
            architecture:architecture,
            carpenter:carpenter,
            shop:shop
        })
            .then(function (response) {
                console.log(response.data.data);
                if (response.data.status === 'Success') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            <Header />
            <div className='md:ps-24 ps-10'>
                <Breadcrumb className='font-bold'>
                    <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="/quotation">Quotation</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <p className='md:text-4xl text-2xl font-bold text-center mb-3'>Create Quotation</p>
            <Container>
                <Form className='w-50 mx-auto' onSubmit={handleQuotation}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>User Name :</Form.Label>
                        <Form.Control type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Mobile No. :</Form.Label>
                        <Form.Control type="text" placeholder="Mobile No" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Address :</Form.Label>
                        <Form.Control type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                </Form>
                <div className='w-50 mx-auto'>
                    <p className='font-bold'>Architecture Name</p>
                        <Select
                            isMulti
                            options={architecture}
                            value={architecture}
                            onChange={(selectedOptions) => setArchitecture(selectedOptions)}
                        />
                    <p className='font-bold'>Carpenter Name</p>
                    <Select
                        isMulti
                        options={carpenter}
                        value={carpenter}
                        onChange={(selectedOptions) =>setCarpenter(selectedOptions)}
                    />
                    <p className='font-bold'>Shop Name</p>
                    <Select
                        isMulti
                        options={shop}
                        value={shop}
                        onChange={(selectedOptions)=> setShop(selectedOptions)}
                    />
                    <button type="submit" className='btn mt-3 bg-black text-white w-full' >Submit</button>
                </div>
            </Container>
        </>
    );
}

export default QuotationForm;
