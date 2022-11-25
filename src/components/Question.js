import React from 'react'

const Question = ({ question, answers, answerQuestion }) => {
  return (
    <article className="container">

      <h2>{question}</h2>

      <div className="btn-container">
        
        {
          answers.map(answer => 
            <button 
              key={answer.answer}
              className="answer-btn"
              onClick={() => answerQuestion(answer.isCorrect)}
            >
              {answer.answer}
            </button>
          )
        }
          
      </div>

    </article>
  );
}

export default Question
