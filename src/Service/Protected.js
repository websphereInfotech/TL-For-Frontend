
import React from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({children}) => {

    const auth = localStorage.getItem(process.env.REACT_APP_KEY)
  if (!auth) {
    return <Navigate to="/" replace />
  } else {
    return children
  }
};

export default Protected;
