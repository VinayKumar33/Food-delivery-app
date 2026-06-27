import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';

const SplashScreen = ({ onFinished }) => {
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    // Stage 1: Play logo scale and loading animations, then trigger fade out
    const fadeTimeout = setTimeout(() => {
      setFadeClass('fade-out-splash');
    }, 2200);

    // Stage 2: Trigger completion callback
    const finishTimeout = setTimeout(() => {
      onFinished();
    }, 2600);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onFinished]);

  return (
    <div 
      className={fadeClass}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#e23744', 
        backgroundImage: 'linear-gradient(135deg, #e23744 0%, #801018 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'splash-scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        }}
      >
        <img 
          src={logo} 
          alt="Vinay's Heaven Logo" 
          style={{ 
            width: '130px', 
            height: '130px', 
            marginBottom: '16px',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))'
          }} 
        />
        <h1 
          style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '2.6rem', 
            color: 'white', 
            fontWeight: '800',
            fontStyle: 'italic',
            letterSpacing: '1px',
            textShadow: '0 4px 10px rgba(0,0,0,0.15)'
          }}
        >
          Vinay's Heaven
        </h1>
        <p 
          style={{ 
            fontSize: '0.85rem', 
            color: '#FFDF00', 
            fontWeight: '600', 
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginTop: '8px',
            opacity: 0.9
          }}
        >
          Heavenly Taste Delivered
        </p>
      </div>

      {/* Gold Ring Loading Spinner */}
      <div 
        style={{
          marginTop: '40px',
          width: '32px',
          height: '32px',
          border: '3px solid rgba(255, 223, 0, 0.2)',
          borderTop: '3px solid #FFDF00',
          borderRadius: '50%',
          animation: 'splash-spin 1s linear infinite'
        }}
      />
    </div>
  );
};

export default SplashScreen;
