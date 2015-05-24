<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <!--<link rel="stylesheet" rev="stylesheet" href="<?php echo base_url(); ?>css/login.css" />-->
        <link rel="stylesheet" href="<?php echo base_url(); ?>assets/bower_components/bootstrap/dist/css/bootstrap.css"/>
        <!-- MetisMenu CSS -->
        <link rel="stylesheet" rev="stylesheet" href="<?php echo base_url(); ?>assets/bower_components/metisMenu/dist/metisMenu.css"/>
        <link rel="stylesheet" rev="stylesheet" href="<?php echo base_url(); ?>assets/bower_components/startbootstrap-sb-admin-2/dist/css/sb-admin-2.css"  media="print"/>

        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <title>Punto de Venta PHP <?php echo $this->lang->line('login_login'); ?></title>
    </head>
    <body>
        <?php if ($_SERVER['HTTP_HOST'] == 'ambatosystem/pos') { ?>
            <h2>Username = vicente</h2>
            <h2>Password = vicented</h2>
        <?php } ?>

        <div class="container">
            <div class="row">
                <div class="col-md-4 col-md-offset-4">
                    <h2>Punto de Venta 11.1</h2>
                    <div class="login-panel panel panel-default">
                        <div class="panel-heading">
                            <p> <?php echo $this->lang->line('login_login'); ?></p>
                            <p> <?php echo $this->lang->line('login_welcome_message'); ?></p>
                        </div>
                        <div class="panel-body">

                            <?php echo form_open('/login', array('id' => 'login_form', 'role' => 'form')) ?>
                            <fieldset>
                                <div class="form-group">
                                    <?php echo validation_errors('<label class="error">', '</label>'); ?>
                                    <?php
                                    echo form_input(array(
                                        'name' => 'username',
                                        'value' => set_value('username'),
                                        'size' => '20',
                                        'class' => 'form-control',
                                        "placeholder" => "Usuario",
//                                        "type" => "email"
                                    ));
                                    ?>
                                </div>
                                <div class="form-group">
                                    <?php
                                    echo form_password(array(
                                        'name' => 'password',
                                        'value' => set_value('password'),
                                        'size' => '20',
                                        'class' => 'form-control',
                                        "placeholder" => "Clave"));
                                    ?>

                                </div>
                                <div class="checkbox">
                                    <label>
                                        <input name="remember" type="checkbox" value="Remember Me">Recordarme</input>
                                    </label>
                                </div>
                                <?php echo form_submit('loginButton', 'Go', "class='btn btn-lg btn-success btn-block'"); ?>
                            </fieldset>
                            <?php echo form_close(); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>

 <!--<script src="<?php echo base_url(); ?>js/jquery-1.2.6.min.js" type="text/javascript" language="javascript" charset="UTF-8"></script>-->
        <script src="<?php echo base_url(); ?>assets/bower_components/jquery/dist/jquery.js" type="text/javascript" language="javascript" charset="UTF-8"></script>
        <script src="<?php echo base_url(); ?>assets/bower_components/jquery-validation/dist/jquery.validate.js" type="text/javascript" language="javascript" charset="UTF-8"></script>
        <script src="<?php echo base_url(); ?>assets/bower_components/bootstrap/dist/js/bootstrap.js" type="text/javascript" language="javascript" charset="UTF-8"></script>
        <script src="<?php echo base_url(); ?>assets/bower_components/metisMenu/dist/metisMenu.js" type="text/javascript" language="javascript" charset="UTF-8"></script>
        <script src="<?php echo base_url(); ?>assets/bower_components/startbootstrap-sb-admin-2/dist/js/sb-admin-2.js" type="text/javascript" language="javascript" charset="UTF-8"></script>
        <script type="text/javascript">
            $(document).ready(function ()
            {
                $("#login_form input:first").focus();

                $("#login_form").validate({
                    submitHandler: function (form) {
                        form.submit();
                    },
                    rules: {
                        username: "required",
                        password: {
                            required: true
                        }
                    },
                    messages: {
                        username: "Ingrese su usuario",
                        password: {
                            required: "Ingrese la clave de acceso"
                        }
                    }
                });
            });
        </script>
    </body>
</html>
