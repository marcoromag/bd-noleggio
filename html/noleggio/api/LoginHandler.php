<?php

class LoginHandler extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/utente/login'; }
    function esegui($uri, $method, $data) { 

        if (!$data->utente || !$data->password) {
            throw new Exception ("Nome utente e password devono essere inseriti");
        }
        $db = DB::instance();

        $utente = $db->login($data->utente, $data->password);

        if ($utente) {
            session_regenerate_id();
            $_SESSION['UTENTE'] = $utente;
            $risposta =  new stdClass;
            $risposta->matricola = $utente['matricola'];
            $risposta->tipo = $utente['tipo'];
            $risposta->nome = $utente['nome'];
            $risposta->cognome = $utente['cognome'];
            $risposta->punto_vendita = $utente['punto_vendita'];
            return $risposta;
        } else {
            throw new Exception ("Utente o password errati");
        }

        
    }
}

class UtenteHandler extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/utente'; }
    function esegui($uri,$method, $data) { 
        if ( (!isset($_SESSION)) || (!isset($_SESSION['UTENTE'])) ) {
            throw new Exception ("Non loggato");
        }
        $utente = $_SESSION['UTENTE'];
        $risposta->matricola = $utente['matricola'];
        $risposta->tipo = $utente['tipo'];
        $risposta->nome = $utente['nome'];
        $risposta->cognome = $utente['cognome'];
        $risposta->punto_vendita = $utente['punto_vendita'];
        return $risposta;
    }
}


class LogoutHandler extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/utente/logout'; }
    function esegui($uri, $method, $data) { 
        session_unset();
        session_regenerate_id();
        return new stdClass;
    }
}

ApiController::registraHandler(new LoginHandler);
ApiController::registraHandler(new LogoutHandler);
ApiController::registraHandler(new UtenteHandler);