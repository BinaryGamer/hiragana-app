import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const hiraganaDictionary = require(".//texts/hiragana.json")["contents"];
const vocabDictionary = require(".//texts/vocab.json")["contents"];

const answers=[];

function HiraganaCharacter({value, mode}) {
  let classname = "";
  switch (mode) {
    case "Hiragana":
      classname="hiraganaCharacter";
      break;
    case "Vocab":
      classname="vocabPhrase";
      break;
    default:
      classname="unknown";
  }
  return <p className={classname}>{value}</p>;
}

function AnswerBox({ onChangeFunction, value, onKeyDownFunction, currentMode, submitAnswer, sourceBook, currentAnswer }) {
  console.log(sourceBook);
  const [currentVal, setCurrentVal] = useState("nice");
  switch (currentMode) {
    case "Hiragana":
      return <input value={value} onChange={onChangeFunction} onKeyDown={onKeyDownFunction} type="text" className='romajiBox'></input>;
    case "Vocab":
      console.log("1");
      if (currentAnswer !== currentVal) {
        let newAnswer = sourceBook[Math.floor(Math.random()*sourceBook.length)]["answer"];
        answers.splice(0, answers.length);
        answers.push(currentAnswer);
        console.log(currentAnswer);
        while (answers.length !== 4) {
          console.log(answers);
          while (newAnswer === currentAnswer || answers.includes(newAnswer)) {
            newAnswer = sourceBook[Math.floor(Math.random()*sourceBook.length)]["answer"];
          }
          console.log(newAnswer);
          if (Math.random() >= 0.5) {
            answers.push(newAnswer);
          } else {
            answers.unshift(newAnswer);
          }
        }
        console.log("nice");
        setCurrentVal(currentAnswer);
      }
      return <div className="multiChoiceDiv">
        <button className="multiChoice" value={answers[0]} onClick={submitAnswer}>{answers[0]}</button>
        <button className="multiChoice" value={answers[1]} onClick={submitAnswer}>{answers[1]}</button>
        <button className="multiChoice" value={answers[2]} onClick={submitAnswer}>{answers[2]}</button>
        <button className="multiChoice" value={answers[3]} onClick={submitAnswer}>{answers[3]}</button>
      </div>;
      default:
        return <p>something has gone wrong somewhere</p>;
  }
}

function AttemptCounter({value}) {
  return <p className="attemptCrosses">{"X".repeat(value)}</p>
}

function GameModeSelector({ settingDict, gameMode, currentMode, setCurrentMode, setCurrentIndex, setSourceBook, setWrongAnswers, setAttempts }) {
  function changeGameMode() {
    setCurrentMode(gameMode);
    setCurrentIndex(0);
    setSourceBook(settingDict);
    setWrongAnswers([]);
    setAttempts(0);
  }
  if (currentMode === gameMode) {
    return <button className="modeSelector activeMode" onClick={changeGameMode}>{gameMode}</button>;
  }
  return <button className="modeSelector" onClick={changeGameMode}>{gameMode}</button>;
}

function WrongAnswers({value}) {
  let output = "";
  for (let i = 0; i < 10; i++) {
    if (i < value.length) {
      if (i !== 0) {
        output += ", ";
      }
      output += value[i];
    }
  }
  return <p>{output}</p>
}

function HiraganaGame() {

  const [sourceBook, setSourceBook] = useState(hiraganaDictionary);
  const [currentMode, setCurrentMode] = useState("Hiragana");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  function answerSubmit(submittedAnswer) {
    if (submittedAnswer === sourceBook[index]["answer"]) {
      let newIndex = Math.round(Math.random()*(sourceBook.length-1));
      while (newIndex === index) {
        newIndex = Math.round(Math.random()*(sourceBook.length-1));
      }
      setIndex(newIndex);
      setAnswer("");
      setAttempts(0);
    } else {
      setAnswer("");
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        setAnswer(sourceBook[index]["answer"]);
        let newWrong = sourceBook[index]["question"] + ":" + sourceBook[index]["answer"];
        if (!wrongAnswers.includes(newWrong)) {
          wrongAnswers.unshift(newWrong);
        }
      }
    }
  }

  const romajiKeyDown = (event) => {
    if (event.key === "Enter") {
      answerSubmit(answer);
    }
  }

  const vocabSelect = (event) => {
    answerSubmit(event.target.value);
  }

  const romajiInput = (event) => {
    setAnswer(event.target.value);
  }

  return <div className="hiraganaGame">
    <GameModeSelector settingDict={hiraganaDictionary} gameMode={"Hiragana"} currentMode={currentMode} setCurrentMode={setCurrentMode} setCurrentIndex={setIndex} setSourceBook={setSourceBook} setWrongAnswers={setWrongAnswers} setAttempts={setAttempts} />
    <GameModeSelector settingDict={vocabDictionary} gameMode={"Vocab"} currentMode={currentMode} setCurrentMode={setCurrentMode} setCurrentIndex={setIndex} setSourceBook={setSourceBook} setWrongAnswers={setWrongAnswers} setAttempts={setAttempts} />
    <HiraganaCharacter value={sourceBook[index]["question"]} mode={currentMode}/>
    <AnswerBox onChangeFunction={romajiInput} value={answer} onKeyDownFunction={romajiKeyDown} submitAnswer={vocabSelect} sourceBook={sourceBook} currentMode={currentMode} currentAnswer={sourceBook[index]["answer"]} />
    <AttemptCounter value={attempts} />
    <WrongAnswers value={wrongAnswers} />
  </div>;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <HiraganaGame />
      </header>
    </div>
  );
}

export default App;
