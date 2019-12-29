<?php

function redirectTo($location) {
    header("location: ".$location);
}

function redirectToHome() {
    redirectTo("/noleggio");
}


function redirectToLogin() {
    redirectTo("/noleggio/login");
}


function set_user_in_session($user) {
    $_SESSION['UTENTE'] = $user;
}

function in_session() {
    if (!$_SESSION) {
        return false;
    }
    return true;
}

function check_user() {
    if (!in_session()) return false;
    if (!$_SESSION['UTENTE']) {
        return false;
    }
    return $_SESSION['UTENTE'];
}

function check_admin() {
    if (!check_login()) return false;
    if (!$_SESSION['UTENTE']->tipo != 'AMMINISTRATORE') {
        return false;
    }
    return $_SESSION['UTENTE'];
}
