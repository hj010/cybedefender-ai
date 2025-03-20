import React from 'react';
import BellImage from './../assests/image 12.png'

const NoReportState = ({message}) => {
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

export default NoReportState;