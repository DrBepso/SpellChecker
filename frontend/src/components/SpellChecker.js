import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SpellChecker.css';

export default function SpellChecker() {
    const [word, setWordTerm] = useState('')
    const [text, setText] = useState('');
    const [typos, setTypos] = useState([]);
    
    const URL = 'http://localhost:8080'
    const handleTextChange = e => {
      setText(e.target.value);
      setWordTerm(e.target.value);
    };
    const handleTypoClick = (typo, suggestion) => {
      setText(text => {
        const newText = text.slice(0, typo.start) + suggestion + text.slice(typo.end);
        setWordTerm(newText);
        return newText;
      });
      setTypos(typos.filter(item => item !== typo));
    };

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        const customConfig = {
          headers: {
          'Content-Type': 'text/plain'
          }
        }
        if(word){
          axios.post(URL+"/message", word, customConfig).then(res => {
            setTypos(res.data.issues.map(typo => ({
              word: typo.match.surface,
              start: typo.match.beginOffset,
              end: typo.match.endOffset,
              suggestion: typo.match.replacement,
              type: typo.type
            })));
          }).catch(error => {
            console.error(error);
          });
        }
        
      }, 1000)
      return () => clearTimeout(delayDebounceFn)
    }, [word])
  
    return (
      <div className="float-container">

        <div className="float-child">
          <textarea
            autoFocus
            type='text'
            autoComplete='off'
            className='live-type-field'
            placeholder='Type here...'
            value={text}
            style={{width: "100%", height: "100%", fontFamily: 'Futura', fontSize: "18px"}}
            onChange={handleTextChange}
          />
        </div>
    
        <div className="float-child">
          {typos.map((typo, index) => (
            <div key={index} className="typo-block">
              <p>{typo.word} - {typo.type}</p>
              {typo.suggestion.slice(0,3).map((suggestion, i) => (
                <button 
                  key={i}
                  className="typo-button"
                  onClick={() => handleTypoClick(typo, suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      
    )
  }