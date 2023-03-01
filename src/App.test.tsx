import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'

test('renders Hello link', () => {
  render(<App />, { wrapper: BrowserRouter })
  const linkElement = screen.getByText(/Hello/i)
  expect(linkElement).toBeInTheDocument()
})
