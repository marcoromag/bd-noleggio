<?php

class CaricoHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/batch/carico'; }
    function esegui($uri, $method, $input) { 
        $data = date("Y-m-d");
        $utente = $_SESSION['UTENTE'];

        if (!isset($input->fornitore) || !isset($input->lista)) {
            throw new Exception ("Parametri non corretti");
        }
        if (isset($input->data)) $data = $input->data;
        $db = DB::instance();

        $batchId = $db->caricaSupportiBatch($utente['punto_vendita'], $input->fornitore, $utente['matricola'], $data, $input->lista);
        return $db->selezionaBatch($batchId);
    }
}

class ScaricoHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/batch/scarico'; }
    function esegui($uri, $method, $input) { 
        $data = date("Y-m-d");
        $utente = $_SESSION['UTENTE'];

        if (!isset($input->fornitore)) {
            throw new Exception ("Parametri non corretti");
        }
        if (isset($input->data)) $data = $input->data;

        $db = DB::instance();
        $batchId = $db->scaricaSupportiBatch($utente['punto_vendita'], $input->fornitore, $utente['matricola'], $data);
        return $db->selezionaBatch($batchId);
    }
}

class ListaBatchHandler extends ApiHandler {
    function autorizza ($utente) { return $utente ; }
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/batch'; }
    function esegui($uri, $method, $input) { 
        $utente = $_SESSION['UTENTE'];
        $db = DB::instance();
        return $db->listaBatch($utente['punto_vendita']);
    }
}

class SelezionaBatchHandler extends ApiHandler {
    static $pathRegexp = '@^/batch/([^/]+)@';
    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $input) {
        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un ID batch");
        }
        $batchId = $match[1];
        $utente = $_SESSION['UTENTE'];
        $db = DB::instance();
        return $db->selezionaBatch($batchId);
    }
}

class CercaSupportiPerVideoHandler extends ApiHandler {
    static $pathRegexp = '@^/video/([^/]+)/supporti@';

    function autorizza ($utente) { return $utente; }
    function gestisce($path, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $data) {

        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene un video");
        }
        $video = $match[1];
        $punto_vendita=$_SESSION['UTENTE']['punto_vendita'];

        $db = DB::instance();
        
        return $db->listaSupportiPerVideo($punto_vendita,$video);
        
    }
}


ApiController::registraHandler(new CaricoHandler);
ApiController::registraHandler(new ScaricoHandler);
ApiController::registraHandler(new ListaBatchHandler);
ApiController::registraHandler(new SelezionaBatchHandler);
ApiController::registraHandler(new CercaSupportiPerVideoHandler);
