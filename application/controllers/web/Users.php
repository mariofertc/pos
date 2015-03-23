<?php

class Users extends CI_Controller {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->data['controller_name'] = $this->controller_name;
        $this->twiggy->theme('web');
    }

    /**
     * Logea a un comprador en el sistema si el usuario y la clave son correctas
     * @return [json] {error:TRUE/FALSE,'msg':''}
     */
    function login(){
        $username = $this->input->post('username');
    	$password = $this->input->post('password');
      
        if (!$this->webuser->login($username, $password)) {               
            echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('login_invalid_username_and_password')));
        } else {
            echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('login_validated')));
        }
    }

    /**
     * Deslogea a un webuser del sistema
     * @return Redirecciona al inicio del market
     */
    function logout(){
        $this->session->unset_userdata('webuser_data');
        $this->session->sess_destroy();
        redirect('web/market');
    }
    /**
     * Registra un nuevo Webuser en el sistema solo con los datos básicos,
     * para que no le de pereza llevar el formulario y abandone
     * @return [json] {error:TRUE/FALSE,'msg':''}
     */
    function register(){
    	$this->form_validation->set_rules('first_name', 'lang:common_first_name', 'required');
    	$this->form_validation->set_rules('email', 'lang:common_email', 'required|valid_email|is_unique[customers.username]');
    	$this->form_validation->set_rules('password', 'lang:market_password', 'required');
    	if($this->form_validation->run()==TRUE){
            $person_data=array(
                'nombre'=>$this->input->post('first_name'),
                'apellido'=>$this->input->post('last_name'),
                'email'=>$this->input->post('email'),
                'password'=>md5($this->input->post('password'))
                );
            $res= $this->webuser->save($person_data);
                if(!$res['error']){
    		      echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_new_user_registered')));	
    		    }else{
                  echo json_encode(array('error'=>TRUE,'msg'=>$res['msg']));
                }
    	}else{
    		echo json_encode(array('error'=>TRUE,'msg'=>validation_errors()));
    	}   
   	}
}
