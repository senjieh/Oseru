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
    <div>
      <div>
        <h1>Sign up for a free account</h1>
        <p className='py-2'>
          Already have an account yet?{' '}
          <Link to='/'>
            Sign in.
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        {step === 0 && (
          <div>
            <div>
              <label>Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type='email'
              />
            </div>
            <button onClick={nextPage}>
              Next
            </button>
          </div>
        )}
        {step === 1 && (
          <div>
            <div>
              <label >Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
      
                type='password'
              />
            </div>
            <button onClick={previousPage}>
              Back
            </button>
            <button>
              Sign Up
            </button>
          </div>
        )}
      
  
    
      </form>
    </div>
  );
};

export default Signup;