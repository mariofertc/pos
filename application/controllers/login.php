<?php

class Login extends CI_Controller {

    function __construct() {
        parent::__construct();
//        $this->load->spark('twig/0.8.5');
    }

    function index() {
        if ($this->Employee->is_logged_in()) {
            //echo "yap";
            redirect('home');
        } else {
//			$this->form_validation->set_rules('username', 'lang:login_username', 'callback_login_check');
            $this->form_validation->set_rules('username', 'lang:login_username', 'callback_login_check');
            $this->form_validation->set_error_delimiters('<div class="error">', '</div>');

            if ($this->form_validation->run() == false) {                
                $data['title'] = 'login_login';
                $this->twig->set($data);
                $this->twig->display('login');
            } else {
//                echo "yap";
                redirect('home');
            }
        }
    }

    function login_check($username) {
        $password = $this->input->post("password");

        if (!$this->Employee->login($username, $password)) {
            $this->form_validation->set_message('login_check', $this->lang->line('login_invalid_username_and_password'));
            return false;
        }
        return true;
    }

}