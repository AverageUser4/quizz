import React from 'react'

const Question = ({ question, answers, answerQuestion, answeredIndex }) => {
  return (
    <article>

      <h2 className="question">{question}</h2>

      <div className="btn-container">
        
        {
          answers.map((answer, index) => {
            let buttonClass = 'answer-btn';

            if(answeredIndex >= 0) {
              buttonClass += ' answer-btn--disabled';

              if(index === answeredIndex || answer.isCorrect)
                buttonClass += answer.isCorrect ? ' answer-btn--correct' : ' answer-btn--incorrect';
            }
            
            return (
              <button 
                key={answer.answer}
                className={buttonClass}
                onClick={() => answerQuestion(answer.isCorrect, index)}
              >
                {answer.answer}
              </button>
            );
          })
        }
          
      </div>

    </article>
  );
}

export default Question
