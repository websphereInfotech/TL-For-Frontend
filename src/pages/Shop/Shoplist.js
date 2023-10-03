import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { BiSearch, BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';


function Shoplist() {
  const [shop, setShop] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShopID, setSelectedShopId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(process.env.KEY);
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

  const handleDelete = (id) => {
    const saved = localStorage.getItem(process.env.KEY);
    axios.delete(`http://localhost:2002/api/shop/data/delete/${selectedShopID}`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
    .then(function (response) {
      console.log(response.data.data);
      setShop((prevShop) =>
      prevShop.filter((shop) => shop._id !== setSelectedShopId)
      );
      setShowDeleteConfirmation(false); 
    })
      .catch(function (error) {
        console.log(error);
      })
  }
  const handleSearch = (shopName) => {
    const saved = localStorage.getItem(process.env.KEY);
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
          <Breadcrumb.Item href="/shoplist">Shop List</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <h1 className='text-center text-4xl font-bold my-4'>Shop List</h1>
      <Container>
        <table className='w-full text-center' cellPadding={'5px'}>
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
                  <tr key={user._id} className=' my-10'>
                    <td>{user.shopName}</td>
                    <td><Link to={`shopdetails/${user._id}`}>Shop</Link></td>
                    <td className='fs-4'><MdDeleteForever className='mx-auto' onClick={() => confirmDelete(user._id)} /></td>
                    <td className='fs-4'><Link to={`/shopform/${user._id}`}><BiEdit className='mx-auto' /></Link></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </Container>
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Body>
          Are you sure you want to delete this item?
        </Modal.Body>
        <div className="modal-buttons">
          <Button onClick={() => setShowDeleteConfirmation(false)}>
            No
          </Button>
          <Button onClick={handleDelete}>
            Yes
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default Shoplist