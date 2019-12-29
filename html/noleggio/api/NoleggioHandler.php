<?php

class CreaNoleggioHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'POST' && $path == "/noleggio"; }
    function esegui($path, $method, $input) {

        if(!$input->cod_fiscale 
            || !$input->supporto 
            || !$input->termine) {
                throw new Exception ("Dati incompleti");
        } 
        $matricola = $_SESSION['UTENTE']['matricola'];

        $db = DB::instance();
        $id_noleggio = $db->attivaNoleggio($input->supporto , $input->cod_fiscale, $matricola, $input->termine);
        return $id_noleggio;
    }
}

class TerminaNoleggioHandler extends ApiHandler {
    static $pathRegexp = '@^/noleggio/([^/]+)@';

    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'POST' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $input) {

        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un ID di noleggio");
        }
        $noleggio = $match[1];

        if(!$input->stato) {
                throw new Exception ("Dati incompleti. Stato mancante");
        } 

        $data_restituzione = isset($input->data_restituzione) ? $input->data_restituzione : date('Y-m-d');
        $punto_vendita=$_SESSION['UTENTE']['punto_vendita'];

        $db = DB::instance();
        $id_noleggio = $db->terminaNoleggio($punto_vendita, $noleggio, $input->stato, $data_restituzione);
        return $id_noleggio;
    }
}
 


ApiController::registraHandler(new CreaNoleggioHandler);
ApiController::registraHandler(new TerminaNoleggioHandler);