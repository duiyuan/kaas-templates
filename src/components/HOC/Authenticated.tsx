import React from 'react'
// 用于重定向等功能

function Authenticated<P>(props: P) {
  return <span>{props}</span>
}

export default Authenticated
