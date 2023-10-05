import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Col, Container, Modal, Row } from 'react-bootstrap'
import { BiSearch, BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';
import {FaStreetView} from "react-icons/fa";

function Shoplist() {
  const [shop, setShop] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShopID, setSelectedShopId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedShopDetails, setSelectedShopDetails] = useState(null);
  
  useEffect(() => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios.get(`http://localhost:2002/api/shop/listdata`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
      .then(function (response) {
        console.log(response.data.data);
        setShop(response.data.data)
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      })
  }, []);

  const handleDelete = () => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios.delete(`http://localhost:2002/api/shop/data/delete/${selectedShopID}`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
    .then(function (response) {
      console.log(response.data.data);
      setShop((prevShop) =>
      prevShop.filter((shop) => shop._id !== selectedShopID)
      );
      setShowDeleteConfirmation(false); 
    })
      .catch(function (error) {
        console.log(error);
      })
  }
  const handleSearch = (shopName) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios.get(`http://localhost:2002/api/shop/searchdata?shopName=${shopName}`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
      .then(function (response) {
        console.log(response.data.data)
        setShop(response.data.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const confirmDelete = (id) => {
    setSelectedShopId(id);
    setShowDeleteConfirmation(true);
  }

  const handleviewdata = (id) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
  
    axios.get(`http://localhost:2002/api/shop/viewdata/${id}`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
    .then(function (response) {
      console.log(response.data.data);
      setSelectedShopDetails(response.data.data);
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
              <p className="md:text-2xl text-xl font-bold">TIMBERLAND</p>
            </Col>
            <Col md={6} sm={12} className='lg:pl-40'>
              <div className="relative ">
                <input type="search" name="" id="" className="search-input py-1 ps-10 md:w-80 w-40 rounded-md	text-black" onChange={(e) => handleSearch(e.target.value)} />
                <div className="absolute fs-5 bottom-1 left-2 text-black">
                  <BiSearch />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div >
      <div className='md:ps-24 ps-10'>
        <Breadcrumb className='font-bold'>
          <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item href="/shoplist">Shop List</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='container text-center md:mx-auto mx-auto'>
      <h1 className=' text-4xl font-bold my-4'>Shop List</h1>
        <table className=' mx-auto  w-full table-fixed ' cellPadding={'10px'}>
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Detalis</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {
              shop.map((user) => {
                return (
                  <tr key={user._id} className=' my-10 '>
                    <td>{user.shopName}</td>
                    <td><FaStreetView className='mx-auto'
                    
                    onClick={()=>handleviewdata(user._id)}
                    />
                    
                    </td>
                    <td className='fs-4'><MdDeleteForever className='mx-auto' onClick={() => confirmDelete(user._id)} /></td>
                    <td className='fs-4'><Link to={`/shopform/${user._id}`}><BiEdit className='mx-auto' /></Link></td>
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

<Modal show={selectedShopDetails !== null} onHide={() => setSelectedShopDetails(null)}>
  
  <Modal.Body className='bg-white rounded pl-10 pr-10'>
    {selectedShopDetails  ?(
      <div className=' pl-10 md:pl-24' >
        <table className='w-full table-fixed'>
          <tr >
            <th className='py-2 '>Shop Name</th>
            <td className='break-words '> {selectedShopDetails.shopName}</td>
          </tr>
          <tr>
            <th className='py-2 ' >Mobile No</th>
            <td> {selectedShopDetails.mobileNo}</td>
            </tr>
            <tr  >
            <th className='py-2 '>Address</th>
            <td className='break-words '> {selectedShopDetails.address}</td>
            </tr>
        </table>
       
      </div>
    ):(
      <p>....Loading</p>
    )}
   <div className='flex justify-center mt-2'>
   <div className='btn bg-black text-white rounded-full py-2 px-4 mt-2 ' onClick={() => setSelectedShopDetails(null)}>
      Close
    </div>
   </div>
  </Modal.Body>
  
</Modal>
    </>
  )
}

export default Shoplist