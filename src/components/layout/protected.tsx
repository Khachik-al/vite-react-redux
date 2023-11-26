import { FC, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'

type ProtectedProps = {
  redirectTo: string
}
export const Protected: FC<ProtectedProps> = ({
  redirectTo,
}: ProtectedProps) => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user.tag === 'notauthorized') navigate(redirectTo)
  }, [user])

  return <Outlet />
}
