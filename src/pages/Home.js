import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const header = "Practice \n Makes \n Perfect";
    
    return (
        <div className='home-background'>
            <section className="jumbotron">
                <div className="jumbotron-content">
                        <h1><span className="highlight-container"><span className="highlight">practice</span></span></h1>
                        <h1><span className="highlight-container"><span className="highlight">makes</span></span></h1>
                        <h1><span className="highlight-container"><span className="highlight">perfect</span></span></h1>
                        <p><span className="highlight-container"><span className="highlight">make practicing music fun through oseru’s drop down music system to help you learn, track, and share your progress.</span></span></p>
                </div>
            </section>
        </div>
    );
}

export default Home;