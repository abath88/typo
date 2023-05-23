import styles from './Terminal.module.scss';
import { useState, useEffect } from 'react';

const Terminal = ({ active, fullText, setTerminalEnd, terminalPrompt, terminalReset, setTerminalReset }) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (terminalReset) {
      setIndex(0);
      setText('');
      setTerminalReset(false);
    }
    if (index < fullText.length) {
      setTerminalEnd(false);
      setTimeout(() => {
        setText(text + fullText[index])
        setIndex(index + 1)
      }, 10)
    } else {
      setTerminalEnd(true);
    }
  }, [index, text, fullText, setTerminalEnd, setTerminalReset, terminalReset]);



  return (
    <pre className={styles.terminal}>
      {text.replace('STORYTHEME', terminalPrompt)} {active && <>{terminalPrompt}<span className={styles.cursor}> </span></>}
    </pre>
  )
}

export default Terminal;