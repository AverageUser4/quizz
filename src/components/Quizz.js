import React, { useState } from 'react';

import Modal from './Modal';
import Question from './Question';

export default function Quizz({ questions, endQuizz }) {
  const [gameData, setGameData] = useState({
    currentQuestion: 0,
    answeredIndex: -1,
    maxQuestion: questions.length - 1,
    isOver: false,
    correctAnswers: 0,
    allAnswers: 0
  });

  function answerQuestion(isCorrect, index) {
    if(gameData.answeredIndex >= 0)
      return;

    setGameData(prev => ({
      ...prev,
      answeredIndex: index,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      allAnswers: prev.allAnswers + 1,
    }));
  }

  function nextQuestion() {
    if(gameData.answeredIndex < 0)
      return;

    setGameData(prev => ({
      ...prev,
      answeredIndex: -1,
      currentQuestion: Math.min(prev.maxQuestion, prev.currentQuestion + 1),
      isOver: prev.currentQuestion + 1 > prev.maxQuestion
    }));
  }

  const { question, answers, category, difficulty } = questions[gameData.currentQuestion];

  return (  
    <>
    
      <Modal
        show={gameData.isOver}
        endQuizz={endQuizz}
        correctAnswers={gameData.correctAnswers}
        allAnswers={gameData.allAnswers}
      />

      <section className="quiz">

        <p className="quizz-data">
          <span className="quizz-data__category">{category}</span>
          <span className={`quizz-data__${difficulty}`}>{difficulty}</span>
        </p>

        <p className="quizz-data">
          <span>question: {gameData.currentQuestion + 1}/{gameData.maxQuestion + 1}</span>
          <span>correct answers: {gameData.correctAnswers}</span>
        </p>

        <Question
          question={question}
          answers={answers}
          answerQuestion={answerQuestion}
          answeredIndex={gameData.answeredIndex}
        />

        <button 
          className="next-question"
          onClick={() => nextQuestion(false)}
        >
          next question
        </button>

      </section>

    </>
  );
}