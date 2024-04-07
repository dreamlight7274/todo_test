import React, { useState, useEffect } from 'react';

const GyroscopeScroll = () => {
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);

  useEffect(() => {
    const handleOrientation = (event) => {
      const { beta } = event;
      if (gyroscopeEnabled) {
        window.scrollBy(0, beta * 0.5);
      }
    };

    if (gyroscopeEnabled) {
      // 请求陀螺仪权限
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((permissionStatus) => {
            if (permissionStatus === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            }
          })
          .catch(console.error);
      } else {
        // 浏览器不支持请求权限
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [gyroscopeEnabled]);

  const toggleGyroscope = () => {
    setGyroscopeEnabled(!gyroscopeEnabled);
  };

  return (
    <div>
      <h1>使用陀螺仪滚动页面</h1>
      <p>试试移动你的设备来滚动页面！</p>
      <button onClick={toggleGyroscope}>
        {gyroscopeEnabled ? '关闭陀螺仪' : '打开陀螺仪'}
      </button>
    </div>
  );
};

export default GyroscopeScroll;