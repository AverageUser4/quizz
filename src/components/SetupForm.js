import React, { useEffect, useState } from 'react'
import Loading from './Loading';

const SetupForm = ({ queryData, setQueryData, setIsPlaying }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      try {
        setLoading(true);

        const data = await fetch('https://opentdb.com/api_category.php');
        const json = await data.json();
  
        if(ignore)
          return;

        setCategories(json.trivia_categories);
        setLoading(false);

      } catch(e) {
        console.error(e);
        setLoading(false);
      }
    }
    
    fetchCategories();

    return () => ignore = true;
  }, [])

  function handleSubmit(event) {
    event.preventDefault();
    setIsPlaying(true);
  }

  function handleChange(event) {
    let { name, value } = event.target;

    setQueryData(prev => ({...prev, [name]: value}));
  }

  function ensureAmountIsValid(event) {
    const value = parseInt(event.target.value);

    const newValue = Math.max(Math.min(value, 50), 10) || 10;
    
    if(newValue !== value)
      setQueryData(prev => ({ ...prev, amount: newValue }));
  }

  if(loading)
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
            min={1}
            max={50}
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
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          
        </div>
        
        <button type="submit" className="submit-btn">start</button>

      </form>

    </section>
  );
}

export default SetupForm
