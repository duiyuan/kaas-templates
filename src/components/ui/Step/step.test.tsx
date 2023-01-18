import { Steps, Step } from './index'
import React from 'react'
import { render } from '@testing-library/react'

describe('steps component tests', () => {
  it('basic case', () => {
    const wrapper = render(
      <Steps current={2} status={}>
        <Step title='step1' step={1}></Step>
      </Steps>
    )
  })
})
