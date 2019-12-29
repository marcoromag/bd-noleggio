<?php
require __DIR__ . '/pages/home.php';
require __DIR__ . '/pages/login.php';
require __DIR__ . '/pages/dirigente.php';
require __DIR__ . '/pages/impiegato.php';

function route() {
    $pattern = '/^\/noleggio\/(.*)\/?/i';
    $replacement = '/${1}';
    $request = preg_replace($pattern, $replacement, $_SERVER['REQUEST_URI']);

    switch ($request) {
        case '/' :
            Pages\Home\controller();
            break;
        case '/login' :
            Pages\Login\controller();
            break;
        case '/dirigente' :
            Pages\Dirigente\controller();
            break;
        case '/impiegato' :
            Pages\Impiegato\controller();
            break;
        default:
            http_response_code(404);
            require __DIR__ . '/404.php';
            break;
    }
}

?>