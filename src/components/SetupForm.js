import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import Loading from './Loading';

const MIN_QUESTIONS = 5;
const MAX_QUESTIONS = 50;

const SetupForm = ({ queryData, setQueryData, startQuizz, error }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      try {
        setIsLoading(true);

        const data = await fetch('https://opentdb.com/api_category.php');
        const json = await data.json();
  
        if(ignore)
          return;

        setCategories(json.trivia_categories || []);
        setIsLoading(false);

      } catch(e) {
        console.error(e);
        setIsLoading(false);
      }
    }
    
    fetchCategories();

    return () => ignore = true;
  }, [])

  function handleSubmit(event) {
    event.preventDefault();
    startQuizz();
  }

  function handleChange(event) {
    let { name, value } = event.target;

    setQueryData(prev => ({...prev, [name]: value}));
  }

  function ensureAmountIsValid(event) {
    const value = parseInt(event.target.value);

    const newValue = Math.max(Math.min(value, MAX_QUESTIONS), MIN_QUESTIONS) || MIN_QUESTIONS;
    
    if(newValue !== value)
      setQueryData(prev => ({ ...prev, amount: newValue }));
  }

  if(isLoading)
    return <Loading/>

  return (
    <section className="quiz quiz-small">

      <form 
        className="setup-form"
        onSubmit={handleSubmit}
      >

        <h2>setup quizz</h2>

        <div className="form-control">

          <label htmlFor="amount">number of questions</label>

          <input 
            type="number"
            name="amount"
            id="amount"
            className="form-input"
            min={MIN_QUESTIONS}
            max={MAX_QUESTIONS}
            value={queryData.amount}
            onChange={handleChange}
            onBlur={ensureAmountIsValid}
          />

        </div>

        <div className="form-control">

          <label htmlFor="category">category</label>

          <select 
            name="category"
            id="category"
            className="form-input"
            value={queryData.category}
            onChange={handleChange}
          >
            <option value="">any</option>
            {
              categories.map(category =>
                <option 
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            }
          </select>

        </div>

        <div className="form-control">

          <label htmlFor="difficulty">select difficulty</label>

          <select 
            name="difficulty"
            id="difficulty"
            className="form-input"
            value={queryData.difficulty}
            onChange={handleChange}
          >
            <option value="">any</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          
        </div>
        
        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-btn">start</button>

      </form>

    </section>
  );
}

SetupForm.propTypes = {
  queryData: PropTypes.object,
  setQueryData: PropTypes.func,
  startQuizz: PropTypes.func,
  error: PropTypes.string
};

export default SetupForm
