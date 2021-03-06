<?php
class RicercaClientePerCodFiscaleHandler extends ApiHandler {
    static $pathRegexp = '@^/cliente/([^/]+)$@';

    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $data) { 
        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un cliente");
        }
        $cod_fiscale = $match[1];

        $db = DB::instance();
        $esito = $db->selezionaClientePerCodFiscale($cod_fiscale);
        return $esito;
    }
}

class RicercaClientePerNomeHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'GET' && $path == "/cliente"; }
    function esegui($path, $method, $data) {
        if (!isset($_GET['nome']) && !isset($_GET['cognome'])) {
            throw new Exception ("Specificare almeno uno tra 'nome' e 'cognome'");
        }
        $nome=isset($_GET['nome']) ? $_GET['nome'] : '';
        $cognome=isset($_GET['cognome']) ? $_GET['cognome'] : '';

        $db = DB::instance();
        $esito = $db->selezionaClientiPerNome($nome, $cognome);
        return $esito;
    }
}

class CreaClienteHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'POST' && $path == "/cliente"; }
    function esegui($path, $method, $data) {

        if(!$data->cod_fiscale 
            || !$data->nome 
            || !$data->cognome 
            || !$data->indirizzo
            || !$data->citta 
            || !$data->cap 
            || !$data->telefono_abitazione 
            || !$data->telefono_cellulare 
            || !$data->email) {
                throw new Exception ("Dati incompleti");
            } 

        $db = DB::instance();
        $db->inserisciCliente($data);
        return null;
    }
}

class InserisciDocumentoHandler extends ApiHandler {
    static $pathRegexp = '@^/cliente/([^/]+)/documento@';

    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'POST' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $data) {

        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un cliente");
        }
        $cod_fiscale = $match[1];

        $db = DB::instance();
        $db->inserisciDocumentoLiberatoria($cod_fiscale,$data);
        return null;
    }
}

class SelezionaNoleggiAttiviPerClienteHandler extends ApiHandler {
    static $pathRegexp = '@^/cliente/([^/]+)/noleggi$@';

    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $data) {

        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un cliente");
        }
        $cod_fiscale = $match[1];
        $punto_vendita=$_SESSION['UTENTE']['punto_vendita'];

        $db = DB::instance();
        return $db->selezionaNoleggiAttiviPerCliente($cod_fiscale,$punto_vendita);
    }
}

class SelezionaNoleggiTerminatiPerClienteHandler extends ApiHandler {
    static $pathRegexp = '@^/cliente/([^/]+)/noleggi-terminati$@';

    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $data) {

        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un cliente");
        }
        $cod_fiscale = $match[1];
        $punto_vendita=$_SESSION['UTENTE']['punto_vendita'];

        $db = DB::instance();
        return $db->selezionaNoleggiTerminatiPerCliente($cod_fiscale,$punto_vendita);
    }
}

class CreaPrenotazioneHandler extends ApiHandler {
    static $pathRegexp = '@^/cliente/([^/]+)/prenotazione/([^/]+)$@';

    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'POST' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $input) {

        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un ID di noleggio");
        }
        $cliente = $match[1];
        $video = $match[2];
        $punto_vendita=$_SESSION['UTENTE']['punto_vendita'];

        $db = DB::instance();
        return $db->inserisciPrenotazione($punto_vendita,$cliente, $video);
    }
}

class ListaPrenotazioniHandler extends ApiHandler {
    static $pathRegexp = '@^/cliente/([^/]+)/prenotazione$@';

    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $input) {

        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un ID di noleggio");
        }
        $cliente = $match[1];
        $punto_vendita=$_SESSION['UTENTE']['punto_vendita'];

        $db = DB::instance();
        return $db->listaVideoPrenotati($punto_vendita,$cliente);
    }
}
 
 


ApiController::registraHandler(new RicercaClientePerCodFiscaleHandler);
ApiController::registraHandler(new RicercaClientePerNomeHandler);
ApiController::registraHandler(new CreaClienteHandler);
ApiController::registraHandler(new InserisciDocumentoHandler);
ApiController::registraHandler(new SelezionaNoleggiAttiviPerClienteHandler);
ApiController::registraHandler(new SelezionaNoleggiTerminatiPerClienteHandler);
ApiController::registraHandler(new CreaPrenotazioneHandler);
ApiController::registraHandler(new ListaPrenotazioniHandler);