import React from 'react';
import BellImage from './../assests/image 11.png'

const NoAlertsState = ({message}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <img 
        src={BellImage}
        alt="No alerts bell icon"
        className="w-[96px] h-[96px] mb-4 opacity-50" 
      />
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default NoAlertsState;