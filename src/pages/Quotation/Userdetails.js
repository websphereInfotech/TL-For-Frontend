import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';

function Userdetails() {
    const { id } = useParams();
    const [user, setUser] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(process.env.KEY);

        axios.get(`http://localhost:2002/api/quotation/viewdata/${id}`, {
            headers: {
                "Authorization": `Bearer ${saved}`
            }
        })
            .then(function (response) {
                console.log(response.data);
                setUser(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }, [id]);

    if (user.length === 0) {
        return <p>Loading...</p>;
    }
    return (
        <>
            <Header />
           <Container>
           <h2 className='text-center fs-3 font-bold'>USER DETAILS</h2>
            <table className='w-full md:w-50 table-bordered border mt-5' align='center'>
                <tr>
                    <td className='font-bold'>SR NO.:</td>
                    <td>{user.serialNumber}</td>
                </tr>
                <tr>
                    <td className='font-bold'>USER NAME:</td>
                    <td>{user.userName}</td>
                </tr>
                <tr>
                    <td className='font-bold'>MOBILE NO.:</td>
                    <td>{user.mobileNo}</td>
                </tr>
                <tr>
                    <td className='font-bold'>ADDRESS:</td>
                    <td>{user.address}</td>
                </tr>
                <tr>
                    <td className='font-bold'>RATE:</td>
                    <td>{user.rate}</td>
                </tr>
                <tr>
                    <td className='font-bold'>DESCRIPTION:</td>
                    <td>{user.description}</td>
                </tr>
                <tr>
                    <td className='font-bold'>QUANTITY:</td>
                    <td>{user.quantity}</td>
                </tr>
                <tr>
                    <td className='font-bold'>ARCHITECTURE NAME:</td>
                    <td>{user.architecture_id}</td>
                </tr>
                <tr>
                    <td className='font-bold'>CARPENTER NAME:</td>
                    <td>{user.carpenter_id}</td>
                </tr>
                <tr>
                    <td className='font-bold'>SHOP NAME:</td>
                    <td>{user.shop_id}</td>
                </tr>
            </table>
           </Container>
        </>
    )
}

export default Userdetails