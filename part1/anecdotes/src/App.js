import { useState } from 'react';
import './App.css';

function App() {

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(7).fill(0));

  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const handleClick = () => {
    setSelected(getRandomIntInclusive(0, 6))
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const handleVote = (index) => {
    const coppyArray = [...votes]
    coppyArray[index] += 1

    setVotes(coppyArray)
  }

  const max = votes.reduce((a, b) => Math.max(a, b), 0)

  const maxIndex = votes.findIndex(num => num === max)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button onClick={() => handleVote(selected)} text="vote" />
      <Button onClick={handleClick} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[maxIndex]}</p>
    </div>
  );
}

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

export default App;
