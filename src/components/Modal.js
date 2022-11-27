import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import { getPercent } from '../utils.js';


const Modal = ({ show, endQuizz, correctAnswers, allAnswers }) => {
  const [isShown, setIsShown] = useState(false);
  const correctPercent = getPercent(correctAnswers, allAnswers);

  useEffect(() => {
    if(!show)
      return;

    const timeoutID = setTimeout(() => setIsShown(true), 200);

    return () => clearTimeout(timeoutID);
  }, [show]);

  let modalClasses = 'modal-container';
  if(show)
    modalClasses += ' isDisplayFlex';
  if(isShown)
    modalClasses += ' isOpen';

  return (
    <div className={modalClasses}>

      <div className="modal-content">

        <h2>congrats!</h2>

        <p>You answered {correctPercent}% of questions correctly</p>

        <button 
          className="close-btn"
          onClick={endQuizz}
        >
          play again
        </button>

      </div>

    </div>
  );
}

Modal.propTypes = {
  show: PropTypes.bool,
  endQuizz: PropTypes.func,
  correctAnswers: PropTypes.number,
  allAnswers: PropTypes.number
}

export default Modal
