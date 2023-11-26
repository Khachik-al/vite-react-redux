import { useAppSelector } from '../redux/hooks'

export const MyAccount = () => {
  const { token } = useAppSelector((state) => state.auth)
  return (
    <>
      token:
      { token }
    </>
  )
}
