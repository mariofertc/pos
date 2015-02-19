<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta content="IE=edge" http-equiv="X-UA-Compatible">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta content="POS" name="description">
        <meta content="Mario Torres" name="author">
        <base href="<?php echo base_url(); ?>" />
        <title><?php echo $this->config->item('company') . ' -- ' . $this->lang->line('common_powered_by') . ' PHP Point Of Sale'; ?></title>
        <!--<link rel="stylesheet" rev="stylesheet" href="<?php echo base_url(); ?>css/phppos.css" />-->
        <!--<link rel="stylesheet" rev="stylesheet" href="<?php echo base_url(); ?>css/phppos_print.css"  media="print"/>-->
        <link rel="stylesheet" href="<?php echo base_url(); ?>assets/bower_components/bootstrap/dist/css/bootstrap.css"/>
        <!-- MetisMenu CSS -->
        <link rel="stylesheet" rev="stylesheet" href="<?php echo base_url(); ?>assets/bower_components/metisMenu/dist/metisMenu.css"/>
        <link rel="stylesheet" rev="stylesheet" href="<?php echo base_url(); ?>assets/bower_components/startbootstrap-sb-admin-2/dist/css/timeline.css"/>
        <link rel="stylesheet" rev="stylesheet" href="<?php echo base_url(); ?>assets/bower_components/startbootstrap-sb-admin-2/dist/css/sb-admin-2.css"/>

        <!--<link href='http://fonts.googleapis.com/css?family=Roboto:400,300' rel='stylesheet' type='text/css'/>-->

        <!-- Custom Fonts -->
        <link href="<?php echo base_url(); ?>assets/bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->
<!--            <style type="text/css">
            html {
                overflow: auto;
            }
        </style>-->
    </head>
    <body>


        <div id="wrapper">
            <nav class="navbar navbar-default navbar-static-top" role="navigation">
                <div class="navbar-header">
                    <a class="navbar-brand" href="index.PHP"><?php echo $this->config->item('company'); ?></a><br />
                    <!--<span style='font-size:8pt;'><?php echo $this->lang->line('common_powered_by') . ' PHP Point Of Sale'; ?></span>-->
                </div>

                <ul class="nav navbar-top-links navbar-right">

                    <li class="dropdown">
                        <div><?php echo $this->lang->line('common_welcome') . " $user_info->first_name $user_info->last_name! "; ?></div>
                    </li>
                    <li class="dropdown">
                        <div id="menubar_date">
                            <span style='font-size:8pt;'>
                                <?php echo strftime("%d de %B del %Y %H:%M"); ?>
                            </span>
                        </div>
                    </li>
                    <li class="dropdown">
                        <a class="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="true">
                            <i class="fa fa-user fa-fw"></i>
                            <i class="fa fa-caret-down"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-user">
                            <li>
                                <a href="#">
                                    <i class="fa fa-user fa-fw"></i>
                                    User Profile
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fa fa-gear fa-fw"></i>
                                    Settings
                                </a>
                            </li>
                            <li class="divider"></li>
                            <li>
                                <a href="home/logout">
                                    <i class="fa fa-sign-out fa-fw"></i>
                                    <?php echo $this->lang->line("common_logout"); ?>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="navbar-default sidebar" role="navigation">
                    <div class="sidebar-nav navbar-collapse collapse in" aria-expanded="true">
                        <ul id="side-menu" class="nav in">
                            <li>
                                <a href="<?php echo site_url('home'); ?>">
                                    <i class="fa fa-dashboard fa-fw"></i>
                                    <?php echo $this->lang->line("module_home") ?>
                                </a>




                            </li>
                            <?php foreach ($allowed_modules->result() as $module) { ?>
                                <li>
                                    <a href="<?php echo site_url("$module->module_id"); ?>">
                                        <img src="<?php echo base_url() . 'images/menubar/' . $module->module_id . '.png'; ?>" alt=<?php echo $module->desc_lang_key ?> style="width: 23px; height: 23px;"/>
                                        <?php echo $this->lang->line("module_" . $module->module_id) ?>
                                    </a>
                                </li>
                                <?php
                            }
                            ?>

                        </ul>
                    </div>
                </div>
            </nav>
        </div>




        <!--        <div id="menubar">
                    <div id="menubar_container">
                        <div id="menubar_company_info">
                            <span id="company_title"><?php echo $this->config->item('company'); ?></span><br />
                            <span style='font-size:8pt;'><?php echo $this->lang->line('common_powered_by') . ' PHP Point Of Sale'; ?></span>
                        </div>
                        <div id="menubar_navigation">
                            <div class="menu_item">
                                <a href="<?php echo site_url('home'); ?>">
                                    <img src="<?php echo base_url() . 'images/menubar/home.png'; ?>" border="0" alt="Menubar Image" /></a><br />
                                <a href="<?php echo site_url("home"); ?>"><?php echo $this->lang->line("module_home") ?></a>
                            </div>
        
        <?php
        foreach ($allowed_modules->result() as $module) {
            ?>
                                            <div class="menu_item">
                                                <a href="<?php echo site_url("$module->module_id"); ?>">
                                                    <img src="<?php echo base_url() . 'images/menubar/' . $module->module_id . '.png'; ?>" border="0" alt="Menubar Image" /></a><br />
                                                <a href="<?php echo site_url("$module->module_id"); ?>"><?php echo $this->lang->line("module_" . $module->module_id) ?></a>
                                            </div>
            <?php
        }
        ?>
                        </div>
        
                        <div id="menubar_footer">
        <?php echo $this->lang->line('common_welcome') . " $user_info->first_name $user_info->last_name! | "; ?>
        <?php echo anchor("home/logout", $this->lang->line("common_logout")); ?>
                        </div>
        
                        <div id="menubar_date">
                            <span style='font-size:8pt;'>
        <?php echo strftime("%d de %B del %Y %H:%M"); ?>
                            </span>
                        </div>
        
                    </div>
                </div>
                <div id="content_area_wrapper">-->
        <?php
        if ($controller_name === "items") {
            echo "<div id='content_area_items'>";
        } else {
            echo "<div id='content_area'>";
        }
        ?>-->
        <div id="page-wrapper" style="min-height: 427px;">