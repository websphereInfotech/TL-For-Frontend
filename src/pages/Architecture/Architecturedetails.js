
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { Container } from 'react-bootstrap';

function Architecturedetails() {
    const { id } = useParams();
    const [architecture, setArchitecture] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(process.env.KEY);

        axios.get(`http://localhost:2002/api/architec/viewdata/${id}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data.data);
                setArchitecture(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }, [id]);

  
    if (architecture.length === 0) {
        return <p>Loading...</p>;
    }
  return (
        <>
            
            <Header />
           <Container>
           <h2 className='text-center fs-3 font-bold'>Architecture Detalis</h2>
            <table className='mx-auto lg:w-1/2 w-full  table-bordered border mt-5' align='center'>
                <tr>
                    <td className='font-bold'>Architecture Name:</td>
                    <td>{architecture.architecsName}</td>
                </tr>
                <tr>
                    <td className='font-bold'>MOBILE NO.:</td>
                    <td>{architecture.mobileNo}</td>
                </tr>
                <tr>
                    <td className='font-bold'>ADDRESS:</td>
                    <td>{architecture.address}</td>
                </tr>
            </table>
           </Container>
        </>
  )
}

export default Architecturedetails