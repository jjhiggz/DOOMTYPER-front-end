import React from 'react';
import BadWords from '../words/BadWords'
import LeftWords from '../WordProcessingComponents/LeftWords'
import RightWords from '../WordProcessingComponents/RightWords'
import ScoreCard from './ScoreCard'
import './AllWordContainer.css'

export default class AllWordContainer extends React.Component{

  state = {
    topic: 'badwords',
    words: [],
    completedWords: [],
    incompletedWords: [],
    currentWord: '',
    currentInput: '',
    currentInputCharacter: '',
    currentCharacter: '',
    characterCount:1,
    correctWordCount: 0,
    incorrectWordCount: 0,
    completedWordCount: 0,
  }
  incrementState = (stateKey) => {
    this.setState({[stateKey]:this.state[stateKey]+1})
  }
  resetState = ( stateKey, defaultValue = 0 ) => {
    this.setState({[stateKey]: defaultValue})
  }
  resetCount = (stateKey) => {
    this.setState({ [stateKey]: 0})
  }
//lifecycle methods
  componentDidUpdate(prevProps){
    if(this.props.words !== prevProps.words){
      this.setState( { words: this.props.words })
      this.populateGameWords(this.props.words)
      this.resetCounts()
      this.changeFocusToInput()
    }
  }
//reset counts upon starting new game
  resetCounts = () => {
    this.resetState('correctWordCount')
    this.resetState('characterCount')
    this.resetState('inCorrectWordCount')
    this.resetState('completedWordCount')
  }
//populates Game Words
  populateGameWords = (words) => {
    this.setState({incompleteWords:[]})
    this.setState({completedWords: []})
    this.setState({incompletedWords:words})
    this.setState({currentWord:words[0]})
  }
// gets last character of a string
  getLastCharacter = (string) => {
    return string.substr(-1);
  }

  handleInputChange = (event) => {
    let input = event.target.value
    this.setState({currentInput: input})
    const currentCharacter = this.getLastCharacter(input)
    this.setState({characterCount:input.split('').length})
    if( currentCharacter === ' ' ){
      this.handleSpace()
    }
    else{
      this.handleCharacter(input)
    }
  }
  handleSpace = () => {
    console.log('handling space')
    if(this.state.characterCount !== 0){
      const newWord = this.state.currentInput.trim()
      // const newWordObj = this.generateCompletedWordObject(newWord)
      const existingCompletedWords = this.state.completedWords
      // existingCompletedWords.push(newWordObj)
      // this.setState({completedWords: existingCompletedWords})
      this.setState({currentInput:''})
      this.nextWord()
      this.incrementStateCounts()
    }
    else{
      this.setState({currentInput:''})
    }
  }

  nextWord = () => {
    let incompleteWords = this.state.incompletedWords
    incompleteWords.shift()
    this.setState({incompletedWords: incompleteWords})
    this.setState({currentWord: incompleteWords[0]})
  }


  incrementStateCounts = () => {
    const {currentInput, currentWord} = this.state
    if(currentInput.trim() !== currentWord){
      this.incrementState('incorrectWordCount')
    }
    else{
      this.incrementState('correctWordCount')
    }
    this.incrementState('completedWordCount')
    this.resetState('characterCount')

  }
  swapLastTermOfStateArray = ( newTerm, stateKey, isSpace ) => {
    let updatedArray = [...this.state.completedWords]
    updatedArray.pop()
    updatedArray.push(newTerm)
    if(isSpace){updatedArray.push({
      text: ' ',
      className: "correct" 
    })}
    this.setState({[stateKey]: updatedArray})
  }
  pushStateArray = ( newTerm, stateKey) => {
    this.setState({[stateKey]: [...this.state[stateKey], newTerm]})
  }
  handleCharacter = (input) => {
    let lastCharacterInput = this.getLastCharacter(input)
    this.handleIncompleteWords(lastCharacterInput)
    this.handleCompleteWords(lastCharacterInput, input)
  }

  handleIncompleteWords = (lastCharacterInput) => {
    let newFirstWord = this.state.incompletedWords[0]
    let newIncompleteWords = this.state.incompletedWords
    let firstLetterOfIncompleteWord = newFirstWord
    firstLetterOfIncompleteWord.split('')
    firstLetterOfIncompleteWord = firstLetterOfIncompleteWord[0]
    if( lastCharacterInput === firstLetterOfIncompleteWord){
      newFirstWord = newFirstWord.split('')
      newFirstWord.shift()
      newFirstWord = newFirstWord.join('')
      newIncompleteWords.shift()
      newIncompleteWords.unshift(newFirstWord)
      this.setState({ incompletedWords: newIncompleteWords })
    }
  }
  handleCompleteWords = (lastCharacterInput , input) => {
    const newLastTerm = this.generatePartiallyCompletedWordObject(input)
    // const isSpace = this.getLastCharacter(input) === ' ' ? true : false
    // console.log(isSpace)
    if( input.length > 1 ){
    this.swapLastTermOfStateArray(newLastTerm, 'completedWords')}
    else{
      this.pushStateArray(newLastTerm,'completedWords')
    }
    
  }

  generatePartiallyCompletedWordObject = (input) => {
    let splitInput = input
    let splitCurrentWord = this.state.currentWord.split('')
    splitInput = splitInput.split('')
    const index = this.indexLastCorrectCharacter(splitInput, splitCurrentWord)
    splitCurrentWord.slice(0,index)
    const isCorrect = this.isInputEqual(splitCurrentWord, splitInput)

    return {
      text: input,
      className: isCorrect ? "correct" : "incorrect"
    }
  }
  indexLastCorrectCharacter = (splitInput, splitWord) => {
    for(let i=0 ; i < splitInput.length; i++){
      if( splitInput[i] != splitWord[i] ){
        return i
      }
    }
    return 'all-correct'
  }


  isInputEqual = ( currentArray, inputArray ) => {
    let inputValue =[...inputArray].join('')
    const cutCurrentToLengthOfInput = (currentArray)  => {
      let returnArray = [...currentArray]
      returnArray = returnArray.slice(0,inputArray.length)
      returnArray = returnArray.join('')
      return returnArray
    }
    if( inputArray.length  > currentArray.length ){
      return false
    }
    else if( inputValue !== cutCurrentToLengthOfInput(currentArray)){
      return false
    }
    else {
      return true
    }
  }
  generateCompletedWordObject = (input) => {
    return {
      text: input,
      className: input === this.state.currentWord ? "correct" : "incorrect"
    }
  }

  
  
  
  inputElement = React.createRef()

  changeFocusToInput = () => {
    this.inputElement.current.focus();
  }

  render(){
    // destructuring state
    const {
      incompletedWords,
      completedWords,
      completedWordCount,
      correctWordCount,
      incorrectWordCount,
      currentWord,
      currentInput,
    } = this.state

    //destructuring functions
    const {
      updateAppStringState,
      handleInputChange,
      
    } = this
    return (
      <section className='game-container'>
        <section id="words">
          <input
            id='input-form'
            value = {this.state.currentInput}
            onChange = { handleInputChange }
            ref = { this.inputElement }
          />
          <LeftWords
            words = { completedWords }  
            onClick = { this.changeFocusToInput }
            changeFocus = { this.changeFocusToInput } 
          />
          <RightWords
            words = { incompletedWords }
            changeFocus = { this.changeFocusToInput }
          />
        </section>
        <section className="scoreCard">

          {this.props.isComplete
            ?
              <ScoreCard
                correctWordCount = { correctWordCount }
                incorrectWordCount = { incorrectWordCount }
              />
            :
              '' }
        </section>
      </section>
    );
  }
}


