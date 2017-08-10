<?php

require_once ("secure_area.php");

class Home extends Secure_area {

    protected $controller_name;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
    }

    function index() {
        // $this->output->enable_profiler(TRUE);
        $data['controller_name'] = $this->controller_name;
        $data['title'] = 'home_home';
        $data = array_merge($data,$this->get_summary());
        $this->twiggy->set($data);
        $this->twiggy->display('home/home');
//        $this->load->view("home", $data);
    }
    function menu() {
        // $this->output->enable_profiler(TRUE);
        $data['controller_name'] = $this->controller_name;
        $data['title'] = 'home_menu';
        $this->twiggy->set($data);
        $this->twiggy->display('home/menu');
//        $this->load->view("home", $data);
    }

    function logout() {
        $this->Employee->logout();
    }

    function get_summary(){
        $data = array();
        $data['total_customer'] = $this->Customer->get_total();
        $data['total_supplier'] = $this->Supplier->get_total();
        $data['total_item'] = $this->Item->get_total();
        return $data;
    }

}