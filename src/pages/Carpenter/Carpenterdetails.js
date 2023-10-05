import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { Container } from 'react-bootstrap';

function Carpenterdetails() {
    const { id } = useParams();
    const [carpenter, setCarpenter] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);

        axios.get(`http://localhost:2002/api/carpenter/viewdata/${id}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data.data);
                setCarpenter(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }, [id]);

  
    if (carpenter.length === 0) {
        return <p>Loading...</p>;
    }
  return (
        <>
            
            <Header />
           <Container>
           <h2 className='text-center fs-3 font-bold'>Carpenter Detalis</h2>
            <table className='mx-auto lg:w-1/2 w-full  table-bordered border mt-5' align='center'>
                <tr>
                    <td className='font-bold'>Carpenter Name:</td>
                    <td>{carpenter.carpentersName}</td>
                </tr>
                <tr>
                    <td className='font-bold'>MOBILE NO.:</td>
                    <td>{carpenter.mobileNo}</td>
                </tr>
                <tr>
                    <td className='font-bold'>ADDRESS:</td>
                    <td>{carpenter.address}</td>
                </tr>
            </table>
           </Container>
        </>
  )
}

export default Carpenterdetails