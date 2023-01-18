describe('button test', () => {
  it('should display small button', () => {
    const props = {
      size: 'small' /* small | normal */,
    }
  })

  it('should disply primary btn', () => {
    const props = {
      type: 'primary' /* default | primary */,
    }
  })

  it('should display btn with custom icon', () => {
    const props = {
      prefix: <i className='iconfont icon-yanjing'></i>,
    }
  })

  it('shold display undiable btn', () => {
    const props = {
      disabled: true,
    }
  })
})
