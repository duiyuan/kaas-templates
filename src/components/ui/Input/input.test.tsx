import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from './Input'
import { InputProps, states } from './interface'

const defaultProps: InputProps = {
  state: states.blur,
  onChange: jest.fn(),
  placeholder: 'input',
}

describe('Input 组件测试用例', () => {
  it('should render normal case', () => {
    const wrapper = render(<Input {...defaultProps}></Input>)
    const element = wrapper.getByPlaceholderText('input')
    expect(element).toBeInTheDocument()
  })

  it('should render normal case with corret icon', () => {
    const props = {}
  })

  it('should render normal case with subffix icon', () => {})
})

describe('Input error case', () => {
  it('should render error case with error message', () => {})
})

describe('Input focused case', () => {
  it('should render focused case', () => {})
})
