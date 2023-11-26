import { FC } from 'react'

export type PageRoute = {
  element: FC<any>;
  icon: string;
  path: string;
  title: string;
  linkPath: string;
  children?: PageRoute[];
}
