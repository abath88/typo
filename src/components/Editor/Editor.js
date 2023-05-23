import Char from '../Char/Char';
import styles from './Editor.module.scss';

const Editor = ({ codeMap }) => {

  return (
    <pre className="editor">
      { 
        codeMap.map(el => { 
          if(el.el === '\n') return  <><Char type={styles[el.type]}>{' '}</Char><Char type={styles[el.type]}>{el.el}</Char></>
          else return <Char type={styles[el.type]}>{el.el}</Char>
        }) 
      }
    </pre>
  );
}

export default Editor;