import * as React from 'react'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'


export const DisplayError : React.FC<{error?:string}> = ({error}) => {
  return error ?
    <Toast>
        <ToastHeader>
            Attenzione
        </ToastHeader>
        <ToastBody>
            {error}
        </ToastBody>
    </Toast>
    : null
}