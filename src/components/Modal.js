import React from 'react'

const Modal = ({ show, setIsPlaying, correctAnswers, allAnswers }) => {
  const correctPercent = (correctAnswers / allAnswers * 100).toFixed(2);

  return (
    <div className={'modal-container' + (show ? ' isOpen' : '')}>

      <div className="modal-content">

        <h2>congrats!</h2>

        <p>You answered {correctPercent}% of questions correctly</p>

        <button 
          className="close-btn"
          onClick={() => setIsPlaying(false)}
        >
          play again
        </button>

      </div>

    </div>
  );
}

export default Modal
