import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the title and a fresh game', () => {
  const { getByText, container } = render(<App />);
  expect(getByText("Apollo's Gasket")).toBeInTheDocument();
  expect(getByText('Score: 0')).toBeInTheDocument();
  expect(container.querySelector('svg#svg')).toBeInTheDocument();
});

test('auto play advances the score', () => {
  const { getByText } = render(<App />);
  fireEvent.click(getByText('Auto play'));
  expect(getByText('Score: 1')).toBeInTheDocument();
});

test('rules button opens the rules modal', () => {
  const { getByText, queryByRole } = render(<App />);
  expect(queryByRole('dialog')).not.toBeInTheDocument();
  fireEvent.click(getByText('Rules'));
  expect(getByText(/Click the pink circle/)).toBeInTheDocument();
});
