import { fireEvent, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import SpellChecker from './SpellChecker';

jest.mock('axios', () => {
    return {
      post: jest.fn().mockResolvedValue({ data: { issues: [{ match: { surface: 'word', beginOffset: 0, endOffset: 4, replacement: ['correct'] }, type: 'misspelling' },{ match: { surface: 'word1', beginOffset: 5, endOffset: 10, replacement: ['correct1'] }, type: 'misspelling' }] } }),
    };
  });

describe('Spellchecker component', () => {

  jest.useFakeTimers();
  
  beforeEach(() => {
    axios.post = jest.fn(() => Promise.resolve({ data: { issues: [{ match: { surface: 'word', beginOffset: 0, endOffset: 4, replacement: ['correct'] }, type: 'misspelling' },{ match: { surface: 'word1', beginOffset: 5, endOffset: 10, replacement: ['correct1'] }, type: 'misspelling' }] } }));
  });

  it('render the Spellchecker component', () =>{
    const { getByPlaceholderText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    expect(input).toBeInTheDocument();
  });

  it('renders the typo block component', async () => {
    const { getByPlaceholderText, getByText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'word' } });

    jest.advanceTimersByTime(1000);

    const typo = await waitFor(()=>getByText('word - misspelling'));
    expect(typo).toBeInTheDocument();
  });

  it('renders the typo block button correctly', async () => {
    const { getByPlaceholderText, getByText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'word' } });

    jest.advanceTimersByTime(1000);

    const typo = await waitFor(()=>getByText('correct'));
    expect(typo).toBeInTheDocument();
  });

  it('debounces the textarea correctly', () => {
    const { getByPlaceholderText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'hello world' } });
    jest.advanceTimersByTime(500);
    fireEvent.change(input, { target: { value: 'hello universe' } });
    jest.advanceTimersByTime(500);
    expect(axios.post).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(1000);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/message', 'hello universe', {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
  });

  it('calls axios correctly', () => {
    const { getByPlaceholderText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'hello world' } });

    jest.advanceTimersByTime(1000);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/message', 'hello world', {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
  });

  it('updates the text state when the textarea value changes', () => {
    const { getByPlaceholderText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'new text' } });
    expect(input.value).toBe('new text');
  });

  it('calls the API when the sentence state changes', async () => {
    const mock = jest.spyOn(axios, 'post').mockResolvedValue({
        data: {
            issues: [{
                match: {
                    surface: 'word',
                    beginOffset: 0,
                    endOffset: 4,
                    replacement: 'correct',
                },
                type: 'misspelling',
            }],
        },
    });

    const { getByPlaceholderText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'word' } });

    jest.advanceTimersByTime(1000);

    expect(mock).toHaveBeenCalled();
    mock.mockRestore();
  });

  it('renders multiple typo blocks when multiple issues exist', async () => {
    const { getByPlaceholderText, getByText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'word word1' } });

    jest.advanceTimersByTime(1000);

    const firstTypoBlock = await waitFor(()=>getByText('word - misspelling'));
    const secondTypoBlock = await waitFor(()=>getByText('word1 - misspelling'));
    const firstTypoButton = await waitFor(()=>getByText('correct'));
    const secondTypoButton = await waitFor(()=>getByText('correct1'));
    expect(firstTypoBlock).toBeInTheDocument();
    expect(secondTypoBlock).toBeInTheDocument();
    expect(firstTypoButton).toBeInTheDocument();
    expect(secondTypoButton).toBeInTheDocument();
  });

  it('does not update the typos state when the API call fails', async () => {
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('error'));

    const { getByPlaceholderText, queryByText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: 'word' } });

    jest.advanceTimersByTime(1000);

    const typo = queryByText('word - misspelling');
    expect(typo).toBeNull();
  });

  it('does not call API when value is empty', () => {
    const { getByPlaceholderText } = render(<SpellChecker />);
    const input = getByPlaceholderText('Type here...');
    fireEvent.change(input, { target: { value: '' } });

    jest.advanceTimersByTime(1000);

    expect(axios.post).toHaveBeenCalledTimes(0);
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
