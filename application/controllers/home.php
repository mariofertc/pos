<?php

require_once ("secure_area.php");

class Home extends Secure_area {

    function __construct() {
        parent::__construct();
    }

    function index() {
        // $this->output->enable_profiler(TRUE);
        $data['controller_name'] = strtolower($this->uri->segment(1));
        $this->load->view("home", $data);
    }

    function logout() {
        $this->Employee->logout();
    }

}

?>