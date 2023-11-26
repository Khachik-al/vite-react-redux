import { Amplify } from '@aws-amplify/core'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './styles/theme'
import { awsExports } from './aws-exports'
import { Layout } from './components/layout/layout'
import { Protected } from './components/layout/protected'
import { LoginPage } from './pages/LoginPage'
import { ForgotPassword } from './pages/ForgotPassword'
import { store } from './redux/store'
import { Home } from './pages/Home'
import { Content } from './pages/Content/Content'
import { UserManagement } from './pages/UserManagement'
import { MyAccount } from './pages/MyAccount'
import { Devices } from './pages/Devices'
import { LoaderWrapper } from './loader/loader'
import { EditTutorial } from './components/editTutorial'
import { AddFaq } from './pages/Content/FAQ/addFaq'

Amplify.configure(awsExports)

export const App = () => (
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <LoaderWrapper>
        <BrowserRouter>
          <Routes>
            <Route element={<Protected redirectTo="/login" />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="content">
                  <Route index element={<Content />} />
                  <Route path="tutorial" element={<EditTutorial />} />
                </Route>
                <Route path="devices" element={<Devices />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="my-account" element={<MyAccount />} />
                <Route path="faq/:id" element={<AddFaq />} />
              </Route>
            </Route>
            <Route path="/login">
              <Route index element={<LoginPage />} />
              <Route path="forgot_password" element={<ForgotPassword />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoaderWrapper>
    </ChakraProvider>
  </Provider>
)
