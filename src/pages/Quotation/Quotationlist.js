import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Col, Container, Modal, Row } from 'react-bootstrap';
import { MdDeleteForever } from 'react-icons/md';
import { BiEdit, BiSearch } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { FaStreetView } from "react-icons/fa";


function Quotationlist() {
    const [quotation, setQuotation] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQuotationID, setSelectedQuotationId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedQuotationDetails, setselectedQuotationDetails] = useState(null);


    useEffect(() => {
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);
        axios.get(`http://localhost:2002/api/quotation/listdata`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data.data);
                setQuotation(response.data.data)
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);
            })
    }, []);

    const handleDelete = () => {
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);
        axios.delete(`http://localhost:2002/api/quotation/delete/data/${selectedQuotationID}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
        .then(function (response) {
            console.log(response.data.data);
            setQuotation((prevQuotation) =>
            prevQuotation.filter((quotation) => quotation._id !== selectedQuotationID)
            );
            setShowDeleteConfirmation(false); 
          })
            .then(function (response) {
                console.log(response.data.data);
                setQuotation((prevQuotation) =>
                    prevQuotation.filter((quotation) => quotation._id !== selectedQuotationID)
                );
                setShowDeleteConfirmation(false);
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    const handleSearch = (userName) => {
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);
        axios.get(`http://localhost:2002/api/quotation/searchdata?userName=${userName}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data.data)
                setQuotation(response.data.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const confirmDelete = (id) => {
        setSelectedQuotationId(id);
        setShowDeleteConfirmation(true);
    }
    const handleviewdata = (id) => {
        const saved = localStorage.getItem(process.env.KEY);

        axios.get(`http://localhost:2002/api/quotation/viewdata/${id}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data.data);
                setselectedQuotationDetails(response.data.data); // Set the shop details
            })
            .catch(function (error) {
                console.log(error);
            });
    };
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
            <div className='container text-center md:mx-auto mx-auto'>
                <h1 className=' text-4xl font-bold my-4'>Quotation List</h1>
                <table className='mx-auto  w-full  table-fixed' cellPadding={'10px'}>
                    <thead>
                        <tr>
                            <th>SR No.</th>
                            <th>Name</th>
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
                                        <td><FaStreetView className='mx-auto'
                                            onClick={() => handleviewdata(user._id)}/>
                                         </td>
                                        <td className='fs-4'><MdDeleteForever className='mx-auto' onClick={() => confirmDelete(user._id)} /></td>
                                        <td className='fs-4'><Link to={`/quotation/${user._id}`} ><BiEdit className='mx-auto' /></Link></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
              
                <div className='logout-model'>
                    <div className="logout">

                        <p >
                            Are you sure you want to delete this item?
                        </p>
                        <div className="modal-buttons">
                            <button className=" rounded-full" onClick={() => setShowDeleteConfirmation(false)}>
                                No
                            </button>
                            <button className=" rounded-full" onClick={handleDelete}>
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal show={selectedQuotationDetails !== null} onHide={() => setselectedQuotationDetails(null)}>

                <Modal.Body className='bg-white rounded'>
                    {selectedQuotationDetails ? (
                        <div  className=' pl-10 md:pl-24'>
                            <table className='  m-auto w-full table-fixed'>
                            <tr >
                                    <th className='py-2 '>Sr No</th>
                                    <td > {selectedQuotationDetails.serialNumber}</td>
                                </tr>
                                <tr >
                                    <th className='py-2'>User Name</th>
                                    <td> {selectedQuotationDetails.userName}</td>
                                </tr>
                                <tr>
                                    <th className='py-2'>Mobile No</th>
                                    <td> {selectedQuotationDetails.mobileNo}</td>
                                </tr>
                                <tr  >
                                    <th className='py-2'>Address</th>
                                    <td> {selectedQuotationDetails.address}</td>
                                </tr>
                                <tr >
                                    <th className='py-2'>Quantity</th>
                                    <td className='overflow-scroll'> {selectedQuotationDetails.quantity}</td>
                                </tr>
                                <tr >
                                    <th className='py-2'>Rate</th>
                                    <td> {selectedQuotationDetails.rate}</td>
                                </tr>
                                <tr >
                                    <th className='py-2'>Description</th>
                                    <td> {selectedQuotationDetails.description}</td>
                                </tr> <tr >
                                    <th className='py-2'>Architecture Id</th>
                                    <td> {selectedQuotationDetails.architecture_id}</td>
                                </tr> <tr >
                                    <th className='py-2'>Carpenter Id</th>
                                    <td> {selectedQuotationDetails.carpenter_id}</td>
                                </tr> <tr >
                                    <th className='py-2'>shop Id</th>
                                    <td> {selectedQuotationDetails.shop_id}</td>
                                </tr>
                            </table>

                        </div>
                    ) : (
                        <p>....Loading</p>
                    )}
                    <div className='flex justify-center mt-2'>
                        <div className='btn bg-black text-white rounded-full py-2 px-4 mt-2 ' onClick={() => setselectedQuotationDetails(null)}>
                            Close
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default Quotationlist