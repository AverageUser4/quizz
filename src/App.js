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

const initialSetupData = {
  isPlaying: false,
  isLoading: false,
  error: ''
};

function App() {
  const [queryData, setQueryData] = useState(initialQueryData);
  const [questions, setQuestions] = useState([]);
  const [setupData, setSetupData] = useState(initialSetupData);

  useEffect(() => {
    if(!setupData.isPlaying)
      return;

    let ignore = false;
    
    async function fetchQuestions() {
      try {
        setSetupData(prev => ({ ...prev, isLoading: true, error: '' }));

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
          const { question, correct_answer, incorrect_answers, category, difficulty } = q;
          const correct = { answer: parseHTMLEntities(correct_answer), isCorrect: true };
          const incorrect = incorrect_answers.map(ans => ({ answer: parseHTMLEntities(ans), isCorrect: false }));
          const answers = shuffleArray([correct, ...incorrect]);
          return { question: parseHTMLEntities(question), answers, category, difficulty };
        });

        setSetupData(prev => ({ ...prev, isLoading: false }));
        setQuestions(questions);

      } catch(e) {
        if(e.textForDeveloper)
          console.error(e.textForDeveloper);
          
        setSetupData(prev => ({ ...prev, isPlaying: false, isLoading: false, error: e.textForUser }));
      }

    }
    fetchQuestions();

    return () => ignore = true;
  }, [setupData.isPlaying, queryData]);


  function startQuizz() {
    setSetupData(prev => ({ ...prev, isPlaying: true }));
  }

  function endQuizz() {
    setSetupData(prev => ({ ...prev, isPlaying: false }));
    setQuestions([]);
  }

  if(!setupData.isPlaying)
    return (
      <main className="setup-container">

        <SetupForm
          startQuizz={startQuizz}
          error={setupData.error}
          queryData={queryData}
          setQueryData={setQueryData}
        />

      </main>
    );

  if(setupData.isLoading || questions.length === 0)
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
