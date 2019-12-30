<?php
require __DIR__."/../db.php";
require __DIR__."/ApiController.php";
require __DIR__."/LoginHandler.php";
require __DIR__."/RicercaHandler.php";
require __DIR__."/MagazzinoHandler.php";
require __DIR__."/ClienteHandler.php";
require __DIR__."/NoleggioHandler.php";
require __DIR__."/MappingHandler.php";

$servername = "localhost:3306";
$username = "admin";
$password = "pass";

// Crea la connessione
DB::start($servername, $username, $password, "noleggio2");

$controller = new ApiController('/noleggio/api');
$controller->eseguiRichiesta();
