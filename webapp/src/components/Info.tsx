import * as React from 'react'


export const InfoMessage : React.FC<React.HTMLProps<HTMLElement>> = ({children,...rest}) => {
    return <small {...rest}>
        <i className="fa fa-info-circle mr-1 text-primary"></i>
        {children}
    </small>
}