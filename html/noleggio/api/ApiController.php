<?php

class ApiHandler {
    function autorizza ($utente) { return true; }
    function gestisce($uri, $method) { die ("This method must be implemented"); }
    function esegui($uri, $method, $data) { die ("This method must be implemented"); }
}

class ApiController {
    static $handlers = [];

    static function registraHandler($handler) {
        self::$handlers[] = $handler;
    }

    function __construct($basePath) {

        $reBasePath = str_replace("/","\/",$basePath);
        $this->pattern = '/^'.$reBasePath.'(.*)\/?/i'; 
    }

    function eseguiRichiesta() {
        //Calcola il path 
        $url = parse_url($_SERVER['REQUEST_URI']);

        $path = preg_replace($this->pattern, '${1}', $url['path']);

        $request = null;
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method == 'POST') {
            //Estrae la richiesta JSON
            $str = file_get_contents("php://input");
            if ($str) {
                $request = json_decode($str);
                if (json_last_error() != JSON_ERROR_NONE) {
                    $this->errore(400,"Invalid JSON");
                }
            }
        }

        session_start();

        //trova l'handler e lo esegue
        foreach( self::$handlers as $handler) {
            try {
                if ($handler->gestisce($path, $method)) {
                    //Controlla se l'utente è autorizzato
                    $utente = (isset($_SESSION) && isset($_SESSION['UTENTE'])) ? $_SESSION['UTENTE'] : null;
                    if (!$handler->autorizza($utente)) {
                        $this->errore("403","non autorizzato");
                        return;
                    }
                    $risposta = $handler->esegui($path, $method, $request);
                    session_commit();
                    $this->risposta($risposta);
                    return;
                }
            } catch (Exception $e) {
                session_abort();
                $this->errore(400, $e->getMessage());
                return;
            }
        }
        $this->errore(404,"Richesta sconosciuta: ".$path);
    }

    private function risposta($data) {
        if (null === $data) {
            $data = new stdClass;
            $data->stato = "successo";
        } 
        $str = json_encode($data);
        http_response_code(200);
        header("Content-type: application/json");
        echo $str;
    }

    private function errore($codice, $messaggio) {
        http_response_code($codice);
        header("Content-type: application/json");
        $error = new stdClass;
        $error->messaggio = $messaggio;
        echo json_encode ($error);
    }

 



}

function isValidJSON($str) {
    json_decode($str);
    return json_last_error() == JSON_ERROR_NONE;
 }
 
 $json_params = file_get_contents("php://input");
 
 if (strlen($json_params) > 0 && isValidJSON($json_params))
   $decoded_params = json_decode($json_params);