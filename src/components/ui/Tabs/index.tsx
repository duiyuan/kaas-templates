import RCTabs, { TabPane } from 'rc-tabs'
import styled from 'styled-components'
import React from 'react'

export type TabsProp = {
  defaultKey: string
  tabs: Array<{
    key: string
    label: string
    extra?: string
    renderKey?: JSX.Element
    render: () => JSX.Element
  }>
  callback?: (key: string) => void
}

const TabsStyle = styled.div`
  .ex-nav {
    .ex-nav-operations {
      height: 0;
    }
  }
  .ex-nav-wrap {
    background: var(--color-bg);
  }
  .ex-nav-list {
    display: flex;
    border-bottom: 1px solid var(--color-split-line);
    font-size: 15px;
    .ex-tab {
      color: var(--color-text-light);
      font-weight: 500;
      line-height: 18px;
      &:first-child {
        margin-left: 16px;
      }
      &:not(:nth-last-child(2)) {
        margin-right: 24px;
      }
    }
    .ex-tab-btn {
      line-height: 32px;
      font-size: 15px;
      cursor: pointer;
    }
    .ex-tab-active {
      color: var(--color-primary);
    }
    .ex-ink-bar {
      position: absolute;
      height: 2px;
      background: var(--color-primary);
      width: 40px;
      bottom: -1px;
    }
  }
`

const Tabs = ({ callback, tabs, defaultKey }: TabsProp) => {
  return (
    <TabsStyle>
      <RCTabs
        prefixCls='ex'
        className='w-[100%]'
        activeKey={defaultKey}
        onChange={callback}
      >
        {tabs.map((tab) => (
          <TabPane
            tab={tab.renderKey || tab.label || tab.key + tab.extra}
            key={tab.key}
          >
            {tab.render()}
          </TabPane>
        ))}
      </RCTabs>
    </TabsStyle>
  )
}
export default Tabs
