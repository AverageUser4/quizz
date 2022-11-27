import React, { useEffect, useState } from 'react'

import { parseHTMLEntities, shuffleArray } from './utils.js';

import SetupForm from './components/SetupForm'
import Loading from './components/Loading'
import Quizz from './components/Quizz'

const API_ENDPOINT = 'https://opentdb.com/api.php?type=multiple';

const initialQueryData = {
  amount: 10,
  category: '',
  difficulty: ''
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [queryData, setQueryData] = useState(initialQueryData);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if(!isPlaying)
      return;

    let ignore = false;
    
    async function fetchQuestions() {
      try {
        setLoading(true);
        setError('');

        let url = API_ENDPOINT;
        for(let key in queryData)
          url += queryData[key] ? `&${key}=${queryData[key]}` : '';
  
        const data = await fetch(url);
        const json = await data.json();

        if(ignore)
          return;

        const { results } = json;
        const responseCode = json.response_code;

        switch(responseCode) {
          case 0:
            break;

          case 1:
            throw {
              textForUser: 'There is not enough questions for chosen category and difficulty. Please, change category, difficulty, or reduce the number of questions.'
            };

          case 2:
            throw {
              textForUser: 'Oops. Looks like something went different than expected. If this keeps happening, please contact us.',
              textForDeveloper: `Code 2: Invalid Parameter. Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)`
            };

          default:
            throw {
              textForUser: 'Oops. Looks like something went different than expected. If this keeps happening, please contact us.',
              textForDeveloper: `The API returned (error) response_code of '${responseCode}'. Check out API's documentation to find out more.`
            };
        }
          
        const questions = results.map((q) => {
          const { question, correct_answer, incorrect_answers } = q;
          const correct = { answer: parseHTMLEntities(correct_answer), isCorrect: true };
          const incorrect = incorrect_answers.map(ans => ({ answer: parseHTMLEntities(ans), isCorrect: false }));
          const answers = shuffleArray([correct, ...incorrect]);
          return { question: parseHTMLEntities(question), answers };
        });

        setLoading(false);
        setQuestions(questions);

      } catch(e) {
        if(e.textForDeveloper)
          console.error(e.textForDeveloper);
          
        setError(e.textForUser);
        setLoading(false);
        setIsPlaying(false);
      }

    }
    fetchQuestions();

    return () => ignore = true;
  }, [isPlaying, queryData]);

  function endQuizz() {
    setIsPlaying(false);
    setQuestions([]);
  }

  if(!isPlaying)
    return (
      <main className="setup-container">

        <SetupForm
          setIsPlaying={setIsPlaying}
          queryData={queryData}
          setQueryData={setQueryData}
          error={error}
        />

      </main>
    );

  if(loading || questions.length === 0)
      return <Loading/>

  return (
    <main>

      <Quizz
        questions={questions}
        endQuizz={endQuizz}
      />

    </main>
  );
}

export default App
