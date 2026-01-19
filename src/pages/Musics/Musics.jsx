import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

const Musics = () => {

    const location = useLocation();
    const { trackList } = location.state;
    console.log(trackList);
    
  return (
    <div>
        <h1>opa</h1>
    </div>
  )
}

export default Musics