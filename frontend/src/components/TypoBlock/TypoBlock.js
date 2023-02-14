import React from 'react';

const TypoBlock = ({typo, handleSuggestionClick}) => {
  return (
    <div className="typo-block">
      <p>{typo.word} - {typo.type}</p>
      {typo.suggestion.slice(0,3).map((suggestion, i) => (
        <button 
          key={i}
          className="typo-button"
          onClick={() => handleSuggestionClick(typo, suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}

export default TypoBlock;