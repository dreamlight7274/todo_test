import React, { useState, useEffect } from 'react';

const GyroscopeScroll = () => {
  const [isGyroscope, setGyroscope] = useState(false);

  useEffect(() => {
    const handleOrientation = (orientData) => {
      const betaData = orientData.beta;
      const modifyData = betaData-65
      if (isGyroscope) {
        window.scrollBy(0, modifyData * 0.5);
      }
    };

    if (isGyroscope) {
      // if the browser support DeviceOrientationEvent
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // try to get the permission of DeviceOrientationEvent
        DeviceOrientationEvent.requestPermission()
          .then((permissionStatus) => {
            if (permissionStatus === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            }
            else{
              console.log("The user declined the request")
            }
          })
          .catch(console.error);
      } else {
        console.log("the browser don't support DeviceOrientationEvent")
        // browser doesn't support that
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isGyroscope]);

  const toggleGyroscope = () => {
    setGyroscope(!isGyroscope);
  };

  return (
    <div className="btn-group">
      <button onClick={toggleGyroscope} className="btn">
        {isGyroscope ? 'Close Gyroscope' : 'Open Gyroscope'}
      </button>
    </div>
  );
};

export default GyroscopeScroll;