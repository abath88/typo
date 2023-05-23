import { useEffect, useState } from 'react';
import styles from './Stats.module.scss';

const Stats = ({ setGameEnd, codeMap }) => {
  const [timer, setTimer] = useState(45);
  useEffect( () => {
    setInterval(()=> {
      setTimer(prev => {
        if(prev-1 <= 0) setGameEnd(true);
        return prev - 1
      });
    }, 1000);
  }, [setGameEnd]);

  const countGood = () => {
    let count = 0;
    codeMap.forEach(el => {
      if(el.type === 'good') count++;
    })
    return count
  }
  const countWrong = () => {
    let count = 0;
    codeMap.forEach(el => {
      if(el.type === 'wrong') count++;
    })
    return count
  }
  return (
    <pre className={styles.stats}>
      Remaining time: {timer}<br />
      Good: {countGood()}<br />
      Wrong: {countWrong()}
    </pre>
  )
}

export default Stats