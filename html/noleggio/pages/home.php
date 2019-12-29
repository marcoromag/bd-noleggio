<?php 
namespace Pages\Home;


function controller() {
    if (!$user = check_user()) {
        redirectToLogin();
        return;
    }

    switch ($user['tipo']) {
        case 'DIRIGENTE': redirectTo('/noleggio/dirigente'); break;
        case 'IMPIEGATO': redirectTo('/noleggio/impiegato'); break;
        default:
            session_abort();
            redirectToLogin();

    }
}





