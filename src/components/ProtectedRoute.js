import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/userContext';

const ProtectedRoute = ({ children }) => {
  const { user, userInfo } = UserAuth();
  const navigate = useNavigate();

  //check if the user id exists if not redirect to sign in
  useEffect(() => {
    if (!user) {
      console.log("no user so we redirect to signin");
      navigate('/signin');
    }
    else if (user === undefined) {
      console.log("no user so we redirect to signin");

      navigate('/signin');
    }
    else if (!user.uid) {
      console.log("no user so we redirect to signin");

      navigate('/signin');
    }
    else if (user.uid === undefined) {
      console.log("no user so we redirect to signin");

      navigate('/signin');
    }
  }, [user]);

  // check if the user conditions if not redirect
  if (!user) {
    return <Navigate to='/signin' />;
  }
  else if (user === undefined) {
    return <Navigate to='/signin' />;
  }
  else if (user.uid === undefined) {
    return <Navigate to='/signin' />;
  }
  if (!userInfo) {
    return <></>;
  }
  else if (userInfo === undefined) {
    return <></>;
  }
  
  return children;
};

export default ProtectedRoute;