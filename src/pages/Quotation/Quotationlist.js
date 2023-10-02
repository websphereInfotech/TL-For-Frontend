import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { MdDeleteForever } from 'react-icons/md';
import { BiEdit, BiSearch } from 'react-icons/bi';
import { Link } from 'react-router-dom';

function Quotationlist() {
    const [quotation, setQuotation] = useState([]);
    useEffect(() => {
        const saved = localStorage.getItem(process.env.KEY);
        axios.get(`http://localhost:2002/api/quotation/listdata`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data.data);
                setQuotation(response.data.data)

            })
            .catch(function (error) {
                console.log(error);
            })
    }, []);

    const handleDelete = (id) => {
        const saved = localStorage.getItem(process.env.KEY);
        id = id._id
        axios.delete(`http://localhost:2002/api/quotation/delete/data/${id}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data.data)
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    const handleSearch = (userName) => {
        const saved = localStorage.getItem(process.env.KEY);
        axios.get(`http://localhost:2002/api/quotation/searchdata?userName=${userName}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
        .then(function(response) {
            console.log(response.data.data)
            setQuotation(response.data.data)
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    return (
        <>
            <div className="bg-dark text-white rounded-br-full">
                <Container>
                    <Row className="mb-3 py-3 lg:mx-0 ms-12">
                        <Col md={6} sm={12} >
                            <p className="text-2xl font-bold">TIMBERLAND</p>
                        </Col>
                        <Col md={6} sm={12}>
                            <div className="relative">
                                <input type="search" name="" id="" className="search-input py-1 ps-10 md:w-80 w-48 rounded-md	text-black" onChange={(e) => handleSearch(e.target.value)} />
                                <div className="absolute fs-5 bottom-1 left-2 text-black">
                                    <BiSearch />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='md:ps-24 ps-10'>
                <Breadcrumb className='font-bold'>
                    <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="/quotationlist">Quotation List</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <h1 className='text-center text-4xl font-bold my-4'>Quotation List</h1>
            <Container>
                <table className='w-full text-center' cellPadding={'5px'}>
                    <thead>
                        <tr>
                            <th>SR No.</th>
                            <th>User Name</th>
                            <th>Detalis</th>
                            <th>Delete</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            quotation.map((user) => {
                                return (
                                    <tr key={user._id} className=' my-10'>
                                        <td>{user.serialNumber}</td>
                                        <td>{user.userName}</td>
                                        <td><Link to={`userdetails/${user._id}`}>User</Link></td>
                                        <td className='fs-4'><MdDeleteForever className='mx-auto' onClick={() => handleDelete(user)} /></td>
                                        <td className='fs-4'><Link to={`/quotation/${user._id}`} ><BiEdit className='mx-auto'/></Link></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </Container>
        </>
    )
}

export default Quotationlist