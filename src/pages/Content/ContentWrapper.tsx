import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Content } from './Content'
import { PageRoute } from '../../types'

type Props = {
  routes: PageRoute[]
}

export const ContentWrapper: FC<Props> = ({ routes }) => (
  <Routes>
    <Route index element={<Content />} />
    {
      routes.map((childRoute: PageRoute) => (
        <Route
          key={childRoute.path}
          path={childRoute.path}
          element={<childRoute.element />}
        />
      ))
    }
  </Routes>
)
