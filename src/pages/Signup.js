import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/userContext';

const Signup = () => {
  // create state for steps of login
  const [step, setStep] = useState(0);

  // create states for inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //obtain function from user context
  const { createUser } = UserAuth();

  //create redirect function (done this way because directly calling it wouldn't work and a quick google explained this would work and tbh it kinda seems like magic but hey it works)
  const navigate = useNavigate()

  //handle the submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(email, password);
      navigate('/dashboard')
    } catch (e) {
      console.log(e.message);
    }
  };

  //handle the next input submission button
  const nextPage = (e) => {
    setStep(step+1);
    e.preventDefault();
  }

  //handle the previous input submission button
  const previousPage = (e) => {
    setStep(step-1);
    e.preventDefault();
  }

  
  return (
    <div className="signupsplit">
      <div className='signupbox'>
        <div className='signincontentleft'>
          <h1>Sign up for a free account</h1>
          <form onSubmit={handleSubmit}>
            {step === 0 && (
              <div className='signupform'>
                <div>
                  <input
                    className='inputbox'
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    placeholder="Email Address"
                  />
                </div>
                <button className='signupnextbutton'onClick={nextPage}>
                  Next
                </button>
              </div>
            )}
            {step === 1 && (
              <div>
                <div>
                  <input
                    className='inputbox'
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    placeholder="Password"
                  />
                </div>
                <div className='signupform2'>
                  <button className="signupbackbutton" onClick={previousPage}>
                    Back
                  </button>
                  <button className='signupbutton'>
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="signinbox">
        <div className='signincontentright'>
          <h1>Already have an account?</h1>
            <Link to='/'>
              <button className='submitsignin-button'>Sign in.</button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;