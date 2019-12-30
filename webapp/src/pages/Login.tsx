import * as React from 'react'
import { FormGroup, Label, Input, Container, Row, Col, Button, Card, CardBody, CardTitle} from 'reactstrap'
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
            history.push("/");
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
            <Col sm="9" md="7" lg="5" className="mx-auto my-5">
                <Card>
                    <CardBody>
                        <CardTitle><h5>Log In</h5></CardTitle>
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
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
    
    )
}