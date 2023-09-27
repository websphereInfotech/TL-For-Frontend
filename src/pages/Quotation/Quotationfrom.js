
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Select from 'react-select';
import { Breadcrumb, Container, Form } from 'react-bootstrap';
import axios from 'axios';

function QuotationForm() {
    const [userName, setUserName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [Address, setAddress] = useState('');

    const [ architecture, setArchitecture] = useState([]);
    const [selectedArchitecture, setSelectedArchitecture] = useState([]);
    const [carpenter, setCarpenter] = useState([]);
    const [selectCarpenter, selectsetCarpenter] = useState([]);
    const [shop, setShop] = useState([]);
    const [selectShop, selectsetShop] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem( process.env.KEY);
        async function fetchData() {
            try {
                const timestamp = Date.now();
                const architectureResponse = await axios.get(`http://localhost:2002/api/architec/listdata?timestamp=${timestamp}`, {
                    headers: {
                        "Authorization": `Bearer ${saved}`
                    }
                });
                const carpenterResponse = await axios.get(`http://localhost:2002/api/carpenter/listdata?timestamp=${timestamp}`, {
                    headers: {
                        "Authorization": `Bearer ${saved}`
                    }
                });
                const shopResponse = await axios.get(`http://localhost:2002/api/shop/listdata?timestamp=${timestamp}`, {
                    headers: {
                        "Authorization": `Bearer ${saved}`
                    }
                });
                const architectureData = await architectureResponse.data.data.map(item => item.architecsName);
                const carpenterData = await carpenterResponse.data.data.map(item => item.carpentersName);
                const shopData = await shopResponse.data.data.map(item => item.shopName);

                setArchitecture(architectureData);
                setCarpenter(carpenterData);
                setShop(shopData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);
    const handleQuotation = () => {
        // e.preventDefault();
        const saved = localStorage.getItem( process.env.KEY);
        axios.post(`http://localhost:2002/api/quotation/cerate`, {
            userName: userName,
            mobileNo: mobileNo,
            Address: Address,
            architectureId:selectedArchitecture.map(item => item.value),
            carpenterId:selectCarpenter.map(item => item.value),
            shopId:selectShop.map(item => item.value)
        }, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
        .then(function (response) {
            console.log(response.data.data);
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
                        <Form.Control type="text" placeholder="Address" value={Address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                </Form>
                <div className='w-50 mx-auto'>
                    <p className='font-bold'>Architecture Name</p>
                        <Select
                            isMulti
                            options={architecture.map(name => ({ label: name, value: name }))}
                            value={selectedArchitecture}
                            onChange={(selectedOptions) => setSelectedArchitecture(selectedOptions)}
                        />
                    <p className='font-bold'>Carpenter Name</p>
                    <Select
                        isMulti
                        options={carpenter.map(name => ({ label: name, value: name }))}
                        value={selectCarpenter}
                        onChange={(selectedOptions) =>selectsetCarpenter(selectedOptions)}
                    />
                    <p className='font-bold'>Shop Name</p>
                    <Select
                        isMulti
                        options={shop.map(name => ({ label: name, value: name }))}
                        value={selectShop}
                        onChange={(selectedOptions)=> selectsetShop(selectedOptions)}
                    />
                    <button type="submit" className='btn mt-3 bg-black text-white w-full' onClick={(e)=>handleQuotation(e.target.value)} >Submit</button>
                    {/* <a href="/details" className='btn mt-3 bg-black text-white w-full'>Submit</a> */}
                </div>
            </Container>
        </>
    );
}

export default QuotationForm;

