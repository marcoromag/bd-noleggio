<?php
namespace Pages\Login;


require_once(__DIR__.'/../db.php');


function controller() {
    $user = "";
    $password = "";
    $error = null;

    $db = \DB::instance();

    if (isset($_POST) && sizeof ($_POST)) {
        $user = $_POST['user'];
        $password = $_POST['password'];

        $result = $db->login($user,$password);

        if ($result) {
            set_user_in_session($result);
            if (isset($_SESSION['loginRedirect'])) {
                redirectTo($_SESSION['loginRedirect']);
            } else redirectToHome();
            return;
        }
        else $error = 'Nome utente o password invalidi';
        
    }

    $res = $db->selezionaClientePerNome("mar");
    echo json_encode($res);
    
    layout_no_menu(null, render($user, $error));
}

function render ($user, $error) {

    return function () use ($user, $error){
    ?>
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Log in</h5>
            <?php if ($error) { ?>
                <div class="alert alert-danger" role="alert">
                <?= $error ?>
                </div>
            <?php }?>
            <form class="form-signin" method="post">
              <div class="form-label-group">
                <input type="text" id="nome" class="form-control" placeholder="Nome utente" name="user" required autofocus>
                <label for="nome">Nome utente</label>
              </div>
              <div class="form-label-group">
                <input type="password" id="inputPassword" class="form-control" name="password" placeholder="Password" required>
                <label for="inputPassword">Password</label>
              </div>
              <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Accedi</button>
            </form>
          </div>
        </div>
      </div>
    </div>


    <?php
    };

}




