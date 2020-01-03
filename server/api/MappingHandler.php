<?php

class ListaFornitoriHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/fornitori'; }
    function esegui($uri, $method, $input) { 
        $db = DB::instance();
        return $db->listaFornitori();
    }
}

class ListaTerminiNoleggioHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/termini_noleggio'; }
    function esegui($uri, $method, $input) { 
        $db = DB::instance();
        return $db->listaTerminiNoleggio();
    }
}

class ListaGeneriHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/generi'; }
    function esegui($uri, $method, $input) { 
        $db = DB::instance();
        return $db->listaGeneri();
    }
}

ApiController::registraHandler(new ListaFornitoriHandler);
ApiController::registraHandler(new ListaTerminiNoleggioHandler);
ApiController::registraHandler(new ListaGeneriHandler);