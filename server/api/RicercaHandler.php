<?php
class RicercaPerNomeHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/catalogo/ricerca/titolo'; }
    function esegui($uri, $method, $data) { 
        $titolo = $_GET['titolo'];
        $utente = $_SESSION['UTENTE'];
        $db = DB::instance();
        $esito = $db->ricercaCatalogoPerTitolo($utente['punto_vendita'], $titolo);
        return $esito;
    }
}

class RicercaPerGenereHandler extends ApiHandler {
    function autorizza ($utente) { return $utente; }
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/catalogo/ricerca/genere'; }
    function esegui($uri, $method, $data) { 
        $genere = $_GET['genere'];
        $pagina = isset($_GET['pagina'])? $_GET['pagina'] : 0;
        $size = isset($_GET['size'])? $_GET['size'] : 100;
        $utente = $_SESSION['UTENTE'];
        $db = DB::instance();
        $esito = $db->ricercaCatalogoPerGenere($utente['punto_vendita'], $genere, $pagina, $size);
        return $esito;
    }
}

ApiController::registraHandler(new RicercaPerNomeHandler);
ApiController::registraHandler(new RicercaPerGenereHandler);