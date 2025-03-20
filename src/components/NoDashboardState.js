import React from 'react';
import BellImage from './../assests/image 13.png'

const NoDashboardState = ({message}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img 
        src={BellImage}
        alt="No alerts bell icon"
        className="w-[250px] h-[250px] items-center justify-center mb-4 opacity-50" 
      />
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default NoDashboardState;