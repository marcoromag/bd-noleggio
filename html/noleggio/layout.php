<?php


function default_header() {
        if (isset($_SESSION['UTENTE'])) {
            $punto_vendita = $_SESSION['UTENTE']['punto_vendita'];
            $PV = DB::instance()->selezionaPuntoVendita($punto_vendita);
        }
    ?>

    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Noleggio</a>
        <?php if (isset($PV)) { ?>
        <div class="col-sm-3 col-md-2">
            <span><?=$PV['indirizzo']?></span>
            <span><?=$PV['citta']?></span>
        </div>
        <?php } ?>

        <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
            <a class="nav-link" href="/noleggio/logout">Log out</a>
        </li>
        </ul>
    </nav>

<?php
}

function layout ($header, $menu, $content) {
    ?>
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <title>Noleggio</title>
  </head>
  <body>
    <?php 
        if ($header) 
            $header(); 
        else 
            default_header(); 
    ?>
    <div class="container-fluid">
        <div class="row">
            <?php 
                if ($menu) {
                    ?>
                    <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                        <div class="sidebar-sticky">
                            <ul class="nav flex-column">
                                <?php $menu(); ?>
                            </ul>
                        </div>
                    </nav>
            <?php } ?>
            <main role="main" class="col-md-<?=$menu ? 9 : 11?> ml-sm-auto col-lg-<?=$menu ? 10 : 12?>  px-4">
                <?php $content() ?>
            </main>
        </div>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
  </body>
</html>
<?php

}

function layout_no_menu ($header, $content) {
    layout($header,null,$content);
}

