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
        $this->load->model('webuser_direccion');
        $this->twig->theme('web');
    }

    function perfil(){
        $this->data['productos'] = $this->wishlist->get_items_by_user($this->user->person_id);
        $this->data['direccionE']=$this->webuser_direccion->get_by_user($this->user->person_id,'ENVIO');
        $this->data['direccionF']=$this->webuser_direccion->get_by_user($this->user->person_id);
        //var_dump($this->user);
        $this->data['email_md5'] = md5(trim($this->user->email));
        $this->twig->set($this->data);
        $this->twig->display('perfil');
    }

    /**
     * Toma los datos del formulario de entrega y añade o 
     * actualiza la información en las tablas phppos_webuser_direcciones
     * @param  integer $direccion_id [description]
     * @return [type]               [description]
     */
   function save_direccion($direccion_id=-1){
        $direccion_data = array(
            'nombre' => $this->input->post('first_name'),
            'apellido' => $this->input->post('last_name'),
            'direccion' => $this->input->post('address_1'),
            'detalles' => $this->input->post('address_2'),
            'ciudad' => $this->input->post('ciudad'),
            'provincia' => $this->input->post('provincia'),
            'zip' => $this->input->post('zip'),
            'pais' => $this->input->post('pais'),
            'tipo' => $this->input->post('tipo'),
            'user_id'=>$this->user->person_id
        );
        $misma_direccion = $this->input->post('misma_direccion');
        if(isset($misma_direccion)){
            $person_data=array(
                'misma_direccion'=>$misma_direccion
                );
            $this->webuser->save($person_data,$this->user->person_id);
        }
        $msg="";
        $res = $this->webuser_direccion->save($direccion_data, $direccion_id);
        if ($res) {
            //New customer
            if ($direccion_id == -1) {
                echo json_encode(array('success' => true, 'message' => $this->lang->line('market_direccion_successful_adding') . ' ' .
                    $direccion_data['direccion'] , 'direccion_id' => $res));
            } else { //previous customer
                echo json_encode(array('success' => true, 'message' => $this->lang->line('market_direccion_successful_updating') . ' ' .
                    $direccion_data['direccion'] , 'direccion_id' => $direccion_id));
            }
        } else {//failure
            echo json_encode(array('success' => false, 'message' => $this->lang->line('market_direccion_error_adding_updating') . ' ' .
                $direccion_data['direccion'], 'direccion_id' => -1));
        }
   }
}
