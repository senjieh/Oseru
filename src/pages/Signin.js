
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/userContext';


const Signin = () => {
  
  //create states for input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const { signIn, user } = UserAuth();

  const navigate = useNavigate();

  // handle the submit button for sign in
  // on sucessfull login this should call the use effect below
  // and redirect to dashboard
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/dash');
    } catch (e) {
      console.log(e.message);
    }
  };

  //establish useEffect onMount and when user var is changed
  //allows redirect if the user is updated due to an async request being fulfilled
  useEffect(() => {
    if (user) {
      console.log("redirecting to dash");
      navigate('/dash');
    }
  }, [user])

  return (
    <div className='signinsplit'>
      <div className='signinbox'>
        <div className='signincontentleft'>
          <h1>Sign in</h1>
          <form className='signinform' onSubmit={handleSubmit}>
            <div className='inputformdiv'>
              <input className='inputbox' onChange={(e) => setEmail(e.target.value)} type='email' placeholder="Email Address" />
            </div>
            <div className='inputformdiv'>
              <input className='inputbox' onChange={(e) => setPassword(e.target.value)}  type='password' placeholder="Password"/>
            </div>
            <button className='submit-button'>
              Sign In.
            </button>
          </form>
        </div>
      </div>
      <div className='signupbox'>
        <div className='signincontentright'>
          <h1>Don't have an account yet?</h1>
          <Link to='/signup'>
            <button className='submitsignup-button'>Sign up.</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;