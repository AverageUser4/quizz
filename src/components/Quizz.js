import React, { useState } from 'react';

import Modal from './Modal';
import Question from './Question';

export default function Quizz({ questions, endQuizz }) {
  const [gameData, setGameData] = useState({
    currentQuestion: 0,
    maxQuestion: questions.length - 1,
    isOver: false,
    correctAnswers: 0,
    allAnswers: 0
  });

  function answerQuestion(isCorrect) {
    setGameData(prev => ({
      ...prev,
      currentQuestion: Math.min(prev.maxQuestion, prev.currentQuestion + 1),
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      allAnswers: prev.allAnswers + 1,
      isOver: prev.currentQuestion + 1 > prev.maxQuestion
    }));
  }

  return (  
    <>
    
      <Modal
        show={gameData.isOver}
        endQuizz={endQuizz}
        correctAnswers={gameData.correctAnswers}
        allAnswers={gameData.allAnswers}
      />

      <section className="quiz">

        <p className="correct-answers">correct answers : {gameData.correctAnswers}/{gameData.allAnswers}</p>

        <Question
          question={questions[gameData.currentQuestion].question}
          answers={questions[gameData.currentQuestion].answers}
          answerQuestion={answerQuestion}
        />

        <button 
          className="next-question"
          onClick={() => answerQuestion(false)}
        >
          next question
        </button>

      </section>

    </>
  );
}