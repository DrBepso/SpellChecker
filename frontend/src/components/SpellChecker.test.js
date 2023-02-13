import { fireEvent, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import SpellChecker from './SpellChecker';

jest.mock('axios', () => {
    return {
      post: jest.fn().mockResolvedValue({ data: { issues: [{ match: { surface: 'word', beginOffset: 0, endOffset: 4, replacement: ['correct'] }, type: 'misspelling' }] } }),
    };
  });

describe('Spellchecker component', () => {

  jest.useFakeTimers();
  
  beforeEach(() => {
    axios.post = jest.fn(() => Promise.resolve({ data: { issues: [{ match: { surface: 'word', beginOffset: 0, endOffset: 4, replacement: ['correct'] }, type: 'misspelling' }] } }));
  });

  it('render the Spellchecker component', () =>{
    const { getByPlaceholderText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    expect(input).toBeInTheDocument();
  })

  it('renders the typo block component', async () => {
    const { getByPlaceholderText, getByText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'word' } });

    jest.advanceTimersByTime(1000);

    const typo = await waitFor(()=>getByText('word - misspelling'));
    expect(typo).toBeInTheDocument();
    
  });

  it('handles typo clicks', async () => {
    const { getByPlaceholderText, getByText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'word' } });

    jest.advanceTimersByTime(1000);

    const button = await waitFor(()=>getByText('correct'));
    fireEvent.click(button);
    expect(input.value).toBe('correct');
  });
});
