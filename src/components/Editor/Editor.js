import Char from '../Char/Char';
import styles from './Editor.module.scss';

const Editor = ({ codeMap }) => {

  return (
    <pre className="editor">
      { 
        codeMap.map((el, key) => { 
          if(el.el === '\n') return  <><Char key={`space_${key}`} type={styles[el.type]}>{' '}</Char><Char key={key} type={styles[el.type]}>{el.el}</Char></>
          else return <Char key={key} type={styles[el.type]}>{el.el}</Char>
        }) 
      }
    </pre>
  );
}

export default Editor;