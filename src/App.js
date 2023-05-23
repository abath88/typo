import { useState, useEffect } from 'react';
import Terminal from './components/Terminal/Terminal';
import Editor from './components/Editor/Editor';
import Stats from './components/Stats/Stats';

import { fullText } from './data';

function App() {

  const [activeGame, setActiveGame]         = useState(false);
  const [terminal, setTerminal]             = useState(fullText.intro);
  const [terminalPrompt, setTerminalPrompt] = useState('');
  const [terminalReset, setTerminalReset]   = useState(false);
  const [terminalActive, setTerminalActive] = useState(true);
  const [terminalEnd, setTerminalEnd]       = useState(false);

  const [gameEnd, setGameEnd]               = useState(false);
  const [gameStart, setGameStart]           = useState(false);

  const [codeMap, setCodeMap] = useState([]);

  const apiRequestBody = {
    'model' : 'gpt-3.5-turbo',
    'messages': [
      {
        role: 'system',
        content: 'Explain all concepts like I am 10 years old.'
      },
      { 
        role: 'user',
        content: `Write short story about ${terminalPrompt} where max count of chars in one sentence is 50. Minimal 6 sentences.`
      }
    ]
  }

  const getDataFromGPT = async () => {
    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', 
      headers: {
        'Authorization': 'Bearer ' + process.env.API_KEY,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      let text = data.choices[0].message.content.split('').filter((el) => {
          if(el === '\n') return false
          else return true
      })

      text = text.map( (el, index, els) => {
        if(index > 0){
          if(el === ' ' && els[index-1] === '.') return '\n'
          else return el
        }else {
          return el
        }
      })
      setCodeMap(text.map((el, key) => { 
        if(key === 0) return {el: el, type: 'active'}
        else return {el: el, type: 'before'}
      }));
      setActiveGame(true);
    })
  }

  const countStats = () => {
    let count = {good: 0, wrong: 0};
    codeMap.forEach(el => {
      if(el.type === 'wrong') count.wrong++;
      if(el.type === 'good') count.good++;
    })
    return count
  }

  useEffect(() => {
    const stats = countStats();
    if(gameEnd) {
      setTerminalReset(true);
      setTerminal(fullText.afterGame.replace('SCORE',`${(stats.good + stats.wrong) *1.25} chars per min` ).replace('GOODSCORE', stats.good).replace('WRONGSCORE', stats.wrong))
    }
  }, [gameEnd])

  useEffect(() => {
    const keypress = (event) => {
      if (/^[\w\d ]$/.test(event.key)) {
        setTerminalPrompt( prev => prev + event.key )
      } else {
        switch(event.key){
          case 'Enter':
            switch(terminalPrompt) {
              case '':
                break;
              default:
                try {
                  setTerminalReset(true);
                  setTerminalActive(false);
                  setTerminal(fullText.game1);
                  getDataFromGPT();
                }catch(err){
                  console.log(err);
                }
                
                break;
            }
          break;
          case 'Backspace':
            setTerminalPrompt( oldPrompt => oldPrompt.slice(0, -1) );
            break;
          default: break;
        }
      }
    }
    if(terminalActive) window.addEventListener("keydown", keypress, false);
    
    return () => {
      window.removeEventListener('keydown', keypress);
    }
  }, [setTerminalPrompt, terminalActive, terminalPrompt])

  useEffect(() => {
    const keypress = (event) => {
      let active = false;
      if(event.key.length === 1){
        setGameStart(true);
        setCodeMap(prev => {
          return prev.map((el) => {
            if(el.type === 'active') {
              active = true;
              if(el.el === '\n') {
                active = false;
                return el
              }
              if(event.key === el.el) return {el: el.el, type: 'good'};
              else return {el: el.el, type: 'wrong'};
            }
            if(active === true) {
              active = false;
              return {el: el.el, type: 'active'}
            }
            else {
              return el
            }
          })
        })
      }else if(event.key === 'Enter'){
        setCodeMap(prev => {
          return prev.map(el => {
            if(el.type === 'active') {
              active = true;
              if(el.el === '\n') {
                return {el: el.el, type: 'good'}
              }else {
                active = false;
                return el
              }
            }
            if(active === true) {
              if(el.el === ' ') return el
              else {
                active = false;
                return {el: el.el, type: 'active'}
              }
            }
            else {
              return el
            }
          })
        })
      }else if(event.key === 'Backspace'){
        setCodeMap(prev => {
          return prev.map((el, index, elements) => {
            if(elements.length > index +1 && elements[index+1].type === 'active' && elements[index+1] !== '\n') {
              active = true;
              return {el: el.el, type: 'active'}
            }
            if(active === true) {
              active = false;
              return { el: el.el, type: 'before' }
            }
            else {
              return el
            }
          })
        })
      }
    }
    if(terminalEnd && activeGame) {
      window.addEventListener("keydown", keypress, false);
  
      return () => {
        window.removeEventListener('keydown', keypress);
      }
    }
  }, [terminalEnd, activeGame])

  return (
    <div className="App">
      <Terminal setTerminalReset={setTerminalReset} terminalReset={terminalReset} setTerminalEnd={setTerminalEnd} active={terminalActive} fullText={terminal} terminalPrompt={terminalPrompt}/>
      {!gameEnd && terminalEnd && activeGame && <Editor setGameStart={setGameStart} codeMap={codeMap} />}
      {gameStart && !gameEnd && activeGame && <Stats codeMap={codeMap} activeGame={activeGame} setGameEnd={setGameEnd} active={activeGame}/>}
    </div>
  );
}

export default App;
