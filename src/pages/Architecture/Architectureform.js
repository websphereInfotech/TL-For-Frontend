import React, { useEffect, useState, useCallback } from 'react'
import { Breadcrumb, Container, Form } from 'react-bootstrap'
import Header from '../../components/Header'
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Modal } from 'react-bootstrap';

function Architectureform() {
    const [architecsName, setArchitecs] = useState('');
    const [mobileNo, setMoblieNo] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);
            console.log(saved);
            axios
                .get(`http://localhost:2002/api/architec/viewdata/${id}`, {
                    headers: {
                        Authorization: `Bearer ${saved}`,
                    },
                })
                .then(function (response) {
                    const architecData = response.data.data;
                    setArchitecs(architecData.architecsName);
                    setMoblieNo(architecData.mobileNo);
                    setAddress(architecData.address);
                })
                .catch(function (error) {
                    console.log(error);
                    setMessage('An error occurred while fetching carpenter data.');
                    setShowModal(true);
                });
        }
    }, [id]);
    const handleArchitecture = (e) => {
        e.preventDefault();
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);
        console.log(saved);
        if (id) {
            axios
                .put(`http://localhost:2002/api/architec/data/update/${id}`, {
                    architecsName: architecsName,
                    mobileNo: mobileNo,
                    address: address,
                }, {
                    headers: {
                        Authorization: `Bearer ${saved}`,
                    },
                })
                .then(function (response) {
                    if (response.data && response.data.status === 'Success') {
                        setMessage('Architecture Data Update successful');
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
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);
            axios.post(`http://localhost:2002/api/architec/data/create`, {
                architecsName: architecsName,
                mobileNo: mobileNo,
                address: address
            }, {
                headers: {
                    "Authorization": `Bearer ${saved}`
                }
            })
                .then(function (response) {
                    if (response.data && response.data.status === 'Success') {
                        const saved = response.data.token;
                        localStorage.setItem(process.env.REACT_APP_KEY, saved);
                        setMessage('Architecture Data Create successful');
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
                    <Breadcrumb.Item href="/architecture">ArchitectureForm</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <p className='md:text-4xl text-2xl font-bold text-center mb-3'>
                {id ? 'Update  ArchitectureForm' : 'Create ArchitectureForm'}
            </p>
            <Container>
                <Form className='w-50 mx-auto' onSubmit={handleArchitecture}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-bold'>Architecture Name :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Architecture Name"
                            value={architecsName}
                            onChange={(e) => setArchitecs(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Moblie No. :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Moblie No"
                            value={mobileNo}
                            onChange={(e) => setMoblieNo(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='font-bold'>Address :</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Address"
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

export default Architectureform