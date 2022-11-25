import React, { useEffect, useState } from 'react'

import SetupForm from './components/SetupForm'
import Loading from './components/Loading'
import Modal from './components/Modal'
import Questions from './components/Question'
import Quizz from './components/Quizz'

const API_ENDPOINT = 'https://opentdb.com/api.php?type=multiple';

const initialQueryData = {
  amount: 10,
  category: '',
  difficulty: 'easy'
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [queryData, setQueryData] = useState(initialQueryData);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!isPlaying)
      return;

    let ignore = false;
    
    async function fetchQuestions() {
      try {
        setLoading(true);

        let url = API_ENDPOINT;
        for(let key in queryData)
          url += queryData[key] ? `&${key}=${queryData[key]}` : '';
  
        const data = await fetch(url);
        const json = await data.json();

        if(ignore)
          return;

        const { results } = json;
        if(!results.length)
          throw new Error('There was a problem when fetching questions. Possibly wrong search (query) parameters.');

        const questions = results.map((q) => {
          const { question, correct_answer, incorrect_answers } = q;
          const correct = { answer: correct_answer, isCorrect: true };
          const incorrect = incorrect_answers.map(ans => ({ answer: ans, isCorrect: false }));
          const answers = [correct, ...incorrect].sort(() => Math.random() >= 0.5 ? 1 : -1);
          return { question, answers };
        });

        setLoading(false);
        setQuestions(questions);

      } catch(e) {
        console.error(e);
        setLoading(false);
      }

    }
    fetchQuestions();

    return () => ignore = true;
  }, [isPlaying, queryData]);

  if(!isPlaying)
    return (
      <main>
        <SetupForm
          setIsPlaying={setIsPlaying}
          queryData={queryData}
          setQueryData={setQueryData}
        />
      </main>
    );

  if(loading || questions.length === 0)
      return <Loading/>

  return (
    <main>

      <Quizz
        questions={questions}
        setIsPlaying={setIsPlaying}
      />

    </main>
  );
}

export default App
