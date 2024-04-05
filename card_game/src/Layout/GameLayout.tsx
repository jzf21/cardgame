import React from 'react'
import { ReduxProvider } from '../../redux/providers'

type Props = {}

export const Layout= ({children}:{children:React.ReactNode}) => {
  return (
    <ReduxProvider>
        {children}
       
    </ReduxProvider>
  )
}