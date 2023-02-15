import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SpellChecker.css';
import TypoBlock from '../TypoBlock/TypoBlock';

export default function SpellChecker() {
    const [sentence, setSentence] = useState('')
    const [textAreaText, setTextAreaText] = useState('');
    const [typos, setTypos] = useState([]);
    
    const URL = 'http://localhost:8080'
    const handleTextChange = e => {
      setTextAreaText(e.target.value);
      setSentence(e.target.value);
    };
    const handleSuggestionClick = (typo, suggestion) => {
      setTextAreaText(text => {
        const newText = text.slice(0, typo.start) + suggestion + text.slice(typo.end);
        setSentence(newText);
        return newText;
      });
      setTypos(typos.filter(item => item !== typo));
    };

    useEffect(() => {
      const customConfig = {
        headers: {
        'Content-Type': 'text/plain'
        }
      }
      const delayDebounceFn = setTimeout(async () => {
        if(sentence){
          try {
            const res = await axios.post(URL + "/message", sentence, customConfig);
            setTypos(
              res.data.issues.map((typo) => ({
                word: typo.match.surface,
                start: typo.match.beginOffset,
                end: typo.match.endOffset,
                suggestion: typo.match.replacement,
                type: typo.type,
              }))
            );
          } catch (error) {
            console.error(error);
          }
        }
        
      }, 1000)
      return () => clearTimeout(delayDebounceFn)
    }, [sentence])
  
    return (
      <div className="float-container">

        <div className="float-child">
          <textarea
            autoFocus
            type='text'
            autoComplete='off'
            className='live-type-field'
            placeholder='Type here...'
            value={textAreaText}
            style={{width: "100%", height: "100%", fontFamily: 'Futura', fontSize: "18px"}}
            onChange={handleTextChange}
          />
        </div>
    
        <div className="float-child">
        {typos.map((typo, index) => (
          <TypoBlock key={index} typo={typo} handleSuggestionClick={handleSuggestionClick} />
        ))}
        </div>
      </div>
      
    )
  }