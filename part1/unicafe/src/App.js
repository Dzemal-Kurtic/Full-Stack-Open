import React, { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [numberOfClicks, SetNumberOfClicks] = useState(0)
  const [allClicksSum, setAllClickSum] = useState(0)
  const [average, setAverage] = useState(0)
  const [percentGood, setPercentGood] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1)
    SetNumberOfClicks(numberOfClicks + 1)
    setAllClickSum(allClicksSum + 1)
    setAverage((allClicksSum + 1) / (numberOfClicks + 1))
    setPercentGood((good + 1) / (numberOfClicks + 1) * 100)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    SetNumberOfClicks(numberOfClicks + 1)
    setAverage(allClicksSum / (numberOfClicks + 1))
    setPercentGood(good / (numberOfClicks + 1) * 100)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    SetNumberOfClicks(numberOfClicks + 1)
    setAllClickSum(allClicksSum - 1)
    setAverage((allClicksSum - 1) / (numberOfClicks + 1))
    setPercentGood(good / (numberOfClicks + 1) * 100)
  }

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <Statistics
        goodRating={good}
        neutralRating={neutral}
        badRating={bad}
        numOfClicks={numberOfClicks}
        avg={average}
        percentPositive={percentGood} />
    </div>
  )
}

const Statistics = ({ goodRating, neutralRating, badRating, numOfClicks, avg, percentPositive }) => {
  if (goodRating === 0 && neutralRating === 0 && badRating === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <>
      <h2>statistics</h2>
      <table>
        <StatisticLine text="good" value={goodRating} />
        <StatisticLine text="neutral" value={neutralRating} />
        <StatisticLine text="bad" value={badRating} />
        <StatisticLine text="all" value={numOfClicks} />
        <StatisticLine text="average" value={avg} />
        <StatisticLine text="positive" value={percentPositive} percent="%" />
      </table>
    </>
  )
}

const StatisticLine = ({ text, value, percent = "" }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
      <td>{percent}</td>
    </tr>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

export default App