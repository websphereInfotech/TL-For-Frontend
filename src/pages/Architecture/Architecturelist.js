import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Col, Container, Modal, Row } from 'react-bootstrap'
import { BiSearch,BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';
import {FaStreetView} from "react-icons/fa";


function Architecturelist() {
  const [architecture, setArchitecture] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArchitectureId, setSelectedArchitectureId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedArchitecDetails, setselectedArchitecDetails] = useState(null);


  useEffect(() => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    console.log(saved);
    axios.get(`http://localhost:2002/api/architec/listdata`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
      .then(function (response) {
        console.log(response.data.data);
        setArchitecture(response.data.data)
        setIsLoading(false);
        
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      })
  }, []);

  const handleDelete = () => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    console.log(saved);
    axios.delete(`http://localhost:2002/api/architec/data/delete/${selectedArchitectureId}`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
    .then(function (response) {
      console.log(response.data.data);
      setArchitecture((prevArchitecture) =>
      prevArchitecture.filter((architec) => architec._id !== selectedArchitectureId)
      );
      setShowDeleteConfirmation(false); 
    })
      .catch(function (error) {
        console.log(error);
      })
  }
  const handleSearch = (architecName) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios.get(`http://localhost:2002/api/architec/searchdata?architecName=${architecName}`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
      .then(function (response) {
        console.log(response.data.data)
        setArchitecture(response.data.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const confirmDelete = (id) => {
    setSelectedArchitectureId(id);
    setShowDeleteConfirmation(true);
  }
  const handleviewdata = (id) => {
    const saved = localStorage.getItem(process.env.KEY);
  
    axios.get(`http://localhost:2002/api/architec/viewdata/${id}`, {
      headers: {
        "Authorization": `Bearer ${saved}`
      }
    })
    .then(function (response) {
      console.log(response.data.data);
      setselectedArchitecDetails(response.data.data); // Set the shop details
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
          <Breadcrumb.Item href="/architecturelist">Architecture List</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='container text-center md:mx-auto mx-auto'>
      <h1 className=' text-4xl font-bold my-4'>Architecture List</h1>
        <table className=' mx-auto  w-full table-fixed ' cellPadding={'10px'}>
          <thead>
            <tr>
              <th>Architecture Name</th>
              <th>Detalis</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {
              architecture.map((user) => {
                return (
                  <tr key={user._id} className=' my-10'>
                    <td>{user.architecsName}</td>
                    <td><FaStreetView className='mx-auto'
                    
                    onClick={()=>handleviewdata(user._id)}
                    />
                    
                    </td>
                    <td className='fs-4'><MdDeleteForever className='mx-auto' onClick={() => confirmDelete(user._id)} /></td>
                    <td className='fs-4'><Link to={`/architecture/${user._id}`}><BiEdit className='mx-auto'/></Link></td>
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

      
<Modal show={selectedArchitecDetails !== null} onHide={() => setselectedArchitecDetails(null)}>
  
  <Modal.Body className='bg-white rounded'>
    {selectedArchitecDetails  ?(
      <div  className='  md:pl-6' >
        <table className='m-auto w-full table-fixed '>
          <tr >
            <th className='py-2'>Architecture Name</th>
            <td> {selectedArchitecDetails.architecsName}</td>
          </tr>
          <tr>
            <th  className='py-2'>Mobile No</th>
            <td> {selectedArchitecDetails.mobileNo}</td>
            </tr>
            <tr  >
            <th className='py-2'>Address</th>
            <td className='overflow-scroll '> {selectedArchitecDetails.address}</td>
            </tr>
        </table>
       
      </div>
    ):(
      <p>....Loading</p>
    )}
   <div className='flex justify-center mt-2'>
   <div className='btn bg-black text-white rounded-full py-2 px-4 mt-2 ' onClick={() => setselectedArchitecDetails(null)}>
      Close
    </div>
   </div>
  </Modal.Body>
  
</Modal>
    </>
  )
}

export default Architecturelist