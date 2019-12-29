<?php

require __DIR__ . '/db.php';
require __DIR__ . '/utils.php';
require __DIR__ . '/router.php';
require __DIR__ . '/layout.php';


$servername = "localhost:3306";
$username = "admin";
$password = "pass";

// Create connection
DB::start($servername, $username, $password, "noleggio");


session_start();
route();
?>
