import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap'
import { BiSearch,BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';


function Shoplist() {
  const [shop, setShop] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [shopName, setShopName] = useState('');
  // const [mobileNo, setMoblieNo] = useState('');
  // const [address, setAddress] = useState('');
  // const { id } = useParams('')

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
    id = id._id
    axios.delete(`http://localhost:2002/api/shop/data/delete/${id}`, {
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
//   const handleUpdate = () => {
//     const saved = localStorage.getItem(process.env.KEY);

//     axios.put(`http://localhost:2002/api/shop/data/update/${id}`,{
//       shopName: shopName,
//       mobileNo: mobileNo,
//       address: address
//   }, {
//   headers: {
//       "Authorization": `Bearer ${saved}`
//   }
// }
//     .then(function (response) {
//       console.log("Data updated:",response.data.data);
//       setShopName(response.data.data.setShopName)
//       setMoblieNo(response.data.data.setMoblieNo)
//       setAddress(response.data.data.setAddress)
//     })
//     .catch(function (error) {
//       console.log(error);
//     })
//   )}
  if (isLoading) {
    return <div>Loading...</div>;
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
                    <td className='fs-4'><MdDeleteForever className='mx-auto' onClick={() => handleDelete(user)} /></td>
                    <td className='fs-4'><Link to={`/shopform/${user._id}`}><BiEdit className='mx-auto'/></Link></td>
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

export default Shoplist