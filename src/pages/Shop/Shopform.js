import React, { useEffect, useState ,useCallback} from 'react'
import Header from '../../components/Header'
import { Breadcrumb, Container, Form } from 'react-bootstrap'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from 'react-bootstrap';

function Shopform() {
    const [shopName, setShopName] = useState('');
    const [mobileNo, setMoblieNo] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);
            axios
                .get(`http://localhost:2002/api/shop/viewdata/${id}`, {
                    headers: {
                        Authorization: `Bearer ${saved}`,
                    },
                })
                .then(function (response) {
                    const shopData = response.data.data;
                    setShopName(shopData.shopName);
                    setMoblieNo(shopData.mobileNo);
                    setAddress(shopData.address);
                })
                .catch(function (error) {
                    console.log(error);
                    setMessage('An error occurred while fetching shop data.');
                    setShowModal(true);
                });
        }
    }, [id]);

    const handleShop = (e) => {
        e.preventDefault();
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);
        if (id) {
            console.log(id);
            axios
                .put(`http://localhost:2002/api/shop/data/update/${id}`, {
                    shopName: shopName,
                    mobileNo: mobileNo,
                    address: address,
                }, {
                    headers: {
                        Authorization: `Bearer ${saved}`,
                    },
                })
                .then(function (response) {
                    if (response.data && response.data.status === 'Success') {
                        setMessage('Shop Data Update successful');
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
            axios
                .post(`http://localhost:2002/api/shop/data/create`, {
                    shopName: shopName,
                    mobileNo: mobileNo,
                    address: address,
                }, {
                    headers: {
                        Authorization: `Bearer ${saved}`,
                    },
                })
                .then(function (response) {
                    if (response.data && response.data.status === 'Success') {
                        const saved = response.data.token;
                        localStorage.setItem(process.env.REACT_APP_KEY, saved);
                        setMessage('Shop Data Create successful');
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
        }
    };
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
                    <Breadcrumb.Item href="/Shopform">ShopForm</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <p className='md:text-4xl text-2xl font-bold text-center mb-3'>
            {id ? 'Update ShopForm' : 'Create ShopForm'}
            </p>
            <Container>
                <Form className='w-50 mx-auto' onSubmit={handleShop}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>Shop Name :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Shop Name :"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Moblie No. :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Moblie No :"
                            value={mobileNo}
                            onChange={(e) => setMoblieNo(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Address :</Form.Label>
                        <Form.Control type="text" placeholder="Address :"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                    <button type="submit" className='btn bg-black text-white w-full'>Submit</button>
                </Form>
            </Container>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Body className={message.includes('successful') ? 'modal-success' : 'modal-error'}>{message}</Modal.Body>
            </Modal>
        </>
    )
}

export default Shopform