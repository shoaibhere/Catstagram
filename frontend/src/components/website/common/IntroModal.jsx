import { useState } from 'react';
import Modal from 'react-modal';
import ReactTypingEffect from 'react-typing-effect';

const customStyles = {
  overlay: {zIndex: '11', backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(5px)',},
  content: {
    position: 'relative',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(35, 5, 23, 0.85)',
    color: '#fff',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    animation: 'fadeIn 0.5s ease-in-out',
  },
};

const fadeInAnimation = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -45%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(fadeInAnimation, styleSheet.cssRules.length);

function IntroModal() {
  const [modalIsOpen, setIsOpen] = useState(true); 

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Welcome"
        shouldCloseOnOverlayClick={false}
      >
        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.color = 'white')}
          onMouseOut={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.7)')}
        >
          &#10007;
        </button>

        <div
          style={{
            textAlign: 'center',
            fontFamily: 'Fantasy',
            fontSize: '22px',
            color: 'rgb(147 51 234)',
            marginBottom: '20px',
          }}
        >
          <ReactTypingEffect
            text={["Welcome to Catstagram Website!"]}
            speed={80}
            eraseSpeed={50}
            eraseDelay={2000}
            typingDelay={500}
          />
        </div>

        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            lineHeight: '1.5',
            marginBottom: '1rem',
          }}
        >
          Explore the world of cats with us. Enjoy a purr-fect experience!
        </p>

        <button
          onClick={closeModal}
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '10px 20px',
            background: 'rgb(147 51 234)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)',
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Get Started
        </button>
      </Modal>
    </div>
  );
}

export default IntroModal;
