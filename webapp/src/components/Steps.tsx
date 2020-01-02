import * as React from 'react'
import { Col } from "reactstrap"

import styles from './Steps.module.css'



export const Steps : React.FC<{steps: string[], corrente: number, stepClick?: (step:number) => void}> = ({steps, corrente, stepClick}) => {
    const width = `${100/steps.length}%`
    const progressWidth = `${100 * (corrente) / (steps.length-1)}%`
    return <Col xs="12">
        <div className={styles['progress-bar-wrapper']}>
            <div className={styles['status-bar']} style={{width: "80%"}}>
                <div className={styles['current-status']} style={{width: progressWidth, transition: "width 1000ms linear 0s"}}></div>
            </div>
            <ul className={styles['progress-bar']} >
                {steps.map ((step,i) => 
                <li className={`${styles.section} ${i<=corrente && styles.visited} ${i==corrente && styles.current}`} 
                    style={{width}}
                    onClick={ stepClick && (() => {i<corrente && stepClick(i)}) }>{step}</li>
                )}
            </ul>
        </div>
        </Col>
}