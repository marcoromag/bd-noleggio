import * as React from 'react'
import { Form, FormGroup, Label, Input, Container, Row, Col, Button} from 'reactstrap'
import styles from './Login.module.css'
import LoginAPI from '../api/LoginAPI';
import { useLogin } from '../GlobalContext';
import { useHistory } from 'react-router';
import { DisplayError } from '../components/DisplayError';



export const Login: React.FC = () => {
    const [login, setLogin] = React.useState<{utente:string,password:string}>({utente:'', password:''});
    const [error, setError] = React.useState<string>();
    const [, setLoginCtx] = useLogin();
    const history = useHistory();

    const runLogin = React.useCallback(  async () => {
        try {
            const user = await LoginAPI.login(login.utente, login.password);
            setLoginCtx({isLoggedIn:true, user});
            history.push("/private");
        } catch (e) {
            setLoginCtx({isLoggedIn:false});
            setError (e.message);
        } 
    },[login, history, setLoginCtx]);

    const changeUser = React.useCallback(  (e : React.ChangeEvent<HTMLInputElement>) => {
        setLogin({...login, utente: e.target.value})
        setError(undefined);
    },[login]);

    const changePassword = React.useCallback(  (e : React.ChangeEvent<HTMLInputElement>) => {
        setLogin({...login, password: e.target.value})
        setError(undefined);
    },[login]);

    const buttonDisabled = !login.utente || !login.password;

    

    return (
    <Container fluid>
        <Row>
            <Col xs="12" sm="6">
                <Form className={styles.form}>
                    <DisplayError error={error}/>
                    <FormGroup >
                        <Label for="nomeUtente">Nome utente</Label>
                        <Input type="email" name="user" id="nomeUtente" onChange={changeUser}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="password" id="password" onChange={changePassword}/>
                    </FormGroup>
                    <FormGroup>
                        <Button disabled={buttonDisabled} color="primary" onClick={runLogin}>Accedi</Button>                    
                    </FormGroup>
                </Form>
            </Col>
        </Row>
    </Container>
    
    )
}