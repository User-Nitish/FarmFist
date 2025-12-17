import React from 'react';

const TestComponent = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      backgroundColor: 'red',
      color: 'white',
      zIndex: 10000,
      fontSize: '24px',
      fontWeight: 'bold',
      borderRadius: '8px',
      boxShadow: '0 0 20px rgba(0,0,0,0.5)'
    }}>
      TEST COMPONENT - You should see this!
    </div>
  );
};

export default TestComponent;
