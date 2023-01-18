import React, { ReactNode } from 'react'

import { Home } from '../pages/home/Home'

// type LoaderComponent<P= {}> = Promise<ComponentType <P> | { default: ComponentType<P>}>

interface IRouteObject {
  index?: boolean
  path?: string
  element?: ReactNode
  name?: string
  children?: IRouteObject[]
}

// const HOCSuspense = (
//   component: LazyExoticComponent<FunctionalComponent>
// ): React.ReactNode => (
//   <Suspense fallback={<SuspenseFallback />}>
//     {React.createElement(component)}
//   </Suspense>
// )

function NoMatch() {
  return (
    <div>
      <h2>It looks like you're lost...</h2>
    </div>
  )
}

const routes: IRouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  { path: '*', element: <NoMatch /> },
]

export default routes
