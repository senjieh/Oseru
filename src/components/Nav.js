import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UserAuth } from '../context/userContext';

export default function Nav() {
  const [ navState, setNavState] = useState(0);
  const { user, logout  } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message);
    }
  };

  const redirectAccount = async () => {
    if ( navState === 0 ){
      setNavState(0);
    }
    else {
      setNavState(1);
      navigate('/account');
    }
  };


  return (
    <div>
      {!user ? (
        <div className="header">
          <h2 className="oseru-logo"><Link to="/">oseru.</Link></h2>
          <nav>
            <ul className="nav">
              <li className="nav-item">
                <Link to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about">About</Link>
              </li>
              <li className="button-link">
                <Link to="/signup">Get Started</Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : (
        <div className="header">
          <h2 className="oseru-logo"><Link to="/dash">oseru.</Link></h2>
          <nav>
            <ul className="nav">
              <li className="nav-item">
                <Link to="/songs">Songs</Link>
              </li>
              <li className="nav-item">
                <Link to="/browse">Browse</Link>
              </li>
              <li className="button-link" onClick={handleLogout}>Logout</li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}