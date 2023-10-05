import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { Container } from 'react-bootstrap';

function Shopdetails() {
    const { id } = useParams();
    const [shop, setShop] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);

        axios.get(`http://localhost:2002/api/shop/viewdata/${id}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data.data);
                setShop(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }, [id]);

  
    if (shop.length === 0) {
        return <p>Loading...</p>;
    }
  return (
        <>
            
            <Header />
           <Container>
           <h2 className='text-center fs-3 font-bold'>Shop Detalis</h2>
            <table className='mx-auto lg:w-1/2 w-full  table-bordered border mt-5' align='center'>
                <tr>
                    <td className='font-bold'>Shop Name:</td>
                    <td>{shop.shopName}</td>
                </tr>
                <tr>
                    <td className='font-bold'>MOBILE NO.:</td>
                    <td>{shop.mobileNo}</td>
                </tr>
                <tr>
                    <td className='font-bold'>ADDRESS:</td>
                    <td>{shop.address}</td>
                </tr>
            </table>
           </Container>
        </>
  )
}

export default Shopdetails