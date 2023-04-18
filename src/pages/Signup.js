import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/userContext';
import ErrorContext from '../context/errorContext';

const Signup = () => {
  // create state for steps of login
  const [step, setStep] = useState(0);

  // create states for inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //obtain function from user context
  const { createUser } = UserAuth();

  //error context function in case of erros
  const { updateError } = useContext(ErrorContext);

  //create redirect function (done this way because directly calling it wouldn't work and a quick google explained this would work and tbh it kinda seems like magic but hey it works)
  const navigate = useNavigate()

  //handle the submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(email, password);
      navigate('/dash')
    } catch (e) {
      updateError(e);
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
    <div className="userAuthSplit">
      <div className='userAuthOpp'>
        <h2>Sign up for a free account</h2>
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
              <button className='dark-button'onClick={nextPage}>
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
                <button className="dark-button" onClick={previousPage}>
                  Back
                </button>
                <button className='dark-button'>
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="userAuthMain">
        <h2>Already have an account?</h2>
          <Link to='/signin'>
            <button className='light-button'>Sign in.</button>
          </Link>
      </div>
    </div>
  );
};

export default Signup;