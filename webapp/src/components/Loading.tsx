import * as React from 'react'
import { Spinner } from 'reactstrap'

export const Loading : React.FC = () => {
    return <Spinner className="mx-auto" color="info"/>
}