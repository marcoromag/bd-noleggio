<?php
class StatistichePerAgenteHandler extends ApiHandler {
    static $pathRegexp = '@^/statistiche/(\d{4}-\d{2}-\d{2})/impiegati@';

    function autorizza ($utente) { return $utente && $utente['tipo'] == 'DIRIGENTE'; }
    function gestisce($path, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$path); }
    function esegui($path, $method, $data) { 
        if (!preg_match(self::$pathRegexp,$path,$match)) {
            throw new Exception ("Il path non contiene una data");
        }
        $data=$match[1];

        $db = DB::instance();
        $esito = $db->statisticaPerDipendenti($data);
        return $esito;
    }
}


ApiController::registraHandler(new StatistichePerAgenteHandler);