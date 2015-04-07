<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require_once ("Secure_CI.php");
class Users extends Secure_CI {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->data['controller_name'] = $this->controller_name;
         $this->load->model('wishlist');
        $this->twiggy->theme('web');
    }

    function perfil(){
        $this->data['productos'] = $this->wishlist->get_items_by_user($this->user->user_id);
        $this->twiggy->set($this->data);
        $this->twiggy->display('perfil');
    }

   
}
