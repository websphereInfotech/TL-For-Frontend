import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import Select from 'react-select';
import { Breadcrumb, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from 'react-bootstrap';

function QuotationForm() {
    const { id } = useParams();
    const [formValues, setFormValues] = useState({
        userName: '',
        mobileNo: '',
        address: '',
        rate: '',
        description: '',
        quantity: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const [architecture, setArchitecture] = useState([]);
    const [selectedArchitecture, setSelectedArchitecture] = useState([]);
    const [carpenter, setCarpenter] = useState([]);
    const [selectCarpenter, selectsetCarpenter] = useState([]);
    const [shop, setShop] = useState([]);
    const [selectShop, selectsetShop] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);
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
    useEffect(() => {
        if (id) {
            console.log(id);
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);
            axios.get(`http://localhost:2002/api/quotation/viewdata/${id}`, {
                headers: {
                    Authorization: `Bearer ${saved}`,
                },
            })
                .then(function (response) {
                    const quotationData = response.data.data;
                    console.log('Quotation Data:', quotationData);
                    setFormValues({
                        userName: quotationData.userName,
                        mobileNo: quotationData.mobileNo,
                        address: quotationData.address,
                        serialNumber: quotationData.serialNumber,
                        rate: quotationData.rate,
                        description: quotationData.description,
                        quantity: quotationData.quantity,
                    });
                    const architectureData = quotationData.architecture_id ? quotationData.architecture_id.split(', ').map(name => ({ label: name, value: name })) : [];
                    const carpenterData = quotationData.carpenter_id ? quotationData.carpenter_id.split(', ').map(name => ({ label: name, value: name })) : [];
                    const shopData = quotationData.shop_id ? quotationData.shop_id.split(', ').map(name => ({ label: name, value: name })) : [];

                    setSelectedArchitecture(architectureData);
                    selectsetCarpenter(carpenterData);
                    selectsetShop(shopData);
                })
                .catch(function (error) {
                    console.log(error);
                    setMessage(error.response.data.message);
                    setShowModal(true);
                });
        }
    }, [id]);
    const handleQuotation = (e) => {
        e.preventDefault();
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);
        const architectureIds = selectedArchitecture.map(item => item.value).join(', ');
        const carpenterIds = selectCarpenter.map(item => item.value).join(', ');
        const shopIds = selectShop.map(item => item.value).join(', ');

        if (id) {
            axios.put(`http://localhost:2002/api/quotation/update/${id}`, {
                ...formValues,
                architecture_id: architectureIds,
                carpenter_id: carpenterIds,
                shop_id: shopIds
            }, {
                headers: {
                    "Authorization": `Bearer ${saved}`
                }
            })
                .then(function (response) {
                    if (response.data && response.data.status === 'Success') {
                        setMessage('Quotation  Update successful');
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
                });
        } else {
            axios.post(`http://localhost:2002/api/quotation/cerate`, {
                ...formValues,
                architecture_id: architectureIds,
                carpenter_id: carpenterIds,
                shop_id: shopIds
            }, {
                headers: {
                    "Authorization": `Bearer ${saved}`
                }
            })
                .then(function (response) {
                    if (response.data && response.data.status === 'Success') {
                        setMessage('Quotation  Create successful');
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
            <Header />
            <div className='md:ps-24 ps-10'>
                <Breadcrumb className='font-bold'>
                    <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="/quotation">Quotation</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <p className='md:text-4xl text-2xl font-bold text-center mb-3'>
                {id ? 'Update QuotationForm' : 'Create QuotationForm'}
            </p>
            <Container>
                <Form className='w-50 mx-auto' onSubmit={handleQuotation}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>User Name
                            <span className='text-red-600'> &#8727; </span>
                            :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="User Name :"
                            value={formValues.userName}
                            onChange={(e) => setFormValues({ ...formValues, userName: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Mobile No.
                            <span className='text-red-600'> &#8727; </span>
                            :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Mobile No. :"
                            value={formValues.mobileNo}
                            onChange={(e) => setFormValues({ ...formValues, mobileNo: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Address
                            <span className='text-red-600'> &#8727; </span>
                            :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Address :"
                            value={formValues.address}
                            onChange={(e) => setFormValues({ ...formValues, address: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>Sr No.
                            <span className='text-red-600'> &#8727; </span>
                            :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Sr No. :"
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Description
                            <span className='text-red-600'> &#8727; </span>
                            :</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Description :"
                            style={{ height: '100px' }}
                            value={formValues.description}
                            onChange={(e) => setFormValues({ ...formValues, description: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Quantity
                            <span className='text-red-600'> &#8727; </span>
                            :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Quantity :"
                            value={formValues.quantity}
                            onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Rate
                            <span className='text-red-600'> &#8727; </span>
                            :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Rate :"
                            value={formValues.rate}
                            onChange={(e) => setFormValues({ ...formValues, rate: e.target.value })} />
                    </Form.Group>
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
                        onChange={(selectedOptions) => selectsetCarpenter(selectedOptions)}
                    />
                    <p className='font-bold'>Shop Name</p>
                    <Select
                        isMulti
                        options={shop.map(name => ({ label: name, value: name }))}
                        value={selectShop}
                        onChange={(selectedOptions) => selectsetShop(selectedOptions)}
                    />
                    <button type="submit" className='btn mt-3 bg-black text-white w-full'>Submit</button>
                </Form>
            </Container>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Body className={message.includes('successful') ? 'modal-success' : 'modal-error'}>{message}</Modal.Body>

            </Modal>
        </>
    );
}
export default QuotationForm;

