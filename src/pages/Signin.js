import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/userContext';
import ErrorContext from '../context/errorContext';

const Signin = () => {
  
  //create states for input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, user } = UserAuth();

  const navigate = useNavigate();

  //error context function in case of erros
  const { updateError } = useContext(ErrorContext);

  // handle the submit button for sign in
  // on sucessfull login this should call the use effect below
  // and redirect to dashboard
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/dash');
    } catch (e) {
      updateError(e);
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
    <div className='userAuthSplit'>
      <div className='userAuthMain'>
        <h2>Sign in</h2>
        <form className='signinform' onSubmit={handleSubmit} onKeyDown={(event) => {if (event.keyCode === 13) {handleSubmit();}}}>
          <div className='inputformdiv'>
            <input className='inputbox' onChange={(e) => setEmail(e.target.value)} type='email' placeholder="Email Address" />
          </div>
          <div className='inputformdiv'>
            <input className='inputbox' onChange={(e) => setPassword(e.target.value)}  type='password' placeholder="Password"/>
          </div>
          <button className='light-button'>
            Sign In.  
          </button>
        </form>
      </div>
      <div className='userAuthOpp'>
        <h2>Don't have an account yet?</h2>
        <Link to='/signup'>
          <button className='light-button'>Sign up.</button>
        </Link>
      </div>
    </div>
  );
};

export default Signin;