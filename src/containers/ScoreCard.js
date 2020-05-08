import React from 'react'
import './ScoreCard.css'

export default function ScoreCard({ correctWordCount, inCorrectWordCount }) {

  return (
  <div className='score-card' >
    <div className="score-element">
      <li className="score-label" >SPEED</li>
      <li>
        <span className="score-value">
          { correctWordCount * 2 }
        </span>
        <span className="score-unit">
          [wpm]
        </span>
        </li>
    </div>
    <div className="score-element">
      <li className="score-label">ACCURACY</li>
      <li>
        <span className="score-value">
          { correctWordCount * 2 }
        </span>
        <span className="score-unit">
          [wpm]
        </span>
        </li>
    </div>
  </div>
  )
}
