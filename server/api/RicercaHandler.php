<?php
class RicercaPerNomeHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/catalogo/ricerca' && isset($_GET['titolo']); }
    function esegui($uri, $method, $data) { 
        $titolo = $_GET['titolo'];
        $tipo = isset($_GET['tipo'])? $_GET['tipo'] : 'DISPONIBILE';
        $utente = $_SESSION['UTENTE'];
        $db = DB::instance();
        $esito = $db->ricercaCatalogoPerTitolo($utente['punto_vendita'], $titolo, $tipo);
        return $esito;
    }
}

class RicercaPerGenereHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/catalogo/ricerca' && isset($_GET['genere']) ; }
    function esegui($uri, $method, $data) { 
        $genere = $_GET['genere'];
        $pagina = isset($_GET['pagina'])? $_GET['pagina'] : 0;
        $size = isset($_GET['size'])? $_GET['size'] : 100;
        $tipo = isset($_GET['tipo'])? $_GET['tipo'] : 'DISPONIBILE';
        $utente = $_SESSION['UTENTE'];
        $db = DB::instance();
        $esito = $db->ricercaCatalogoPerGenere($utente['punto_vendita'], $genere, $tipo, $pagina, $size);
        return $esito;
    }
}

ApiController::registraHandler(new RicercaPerNomeHandler);
ApiController::registraHandler(new RicercaPerGenereHandler);