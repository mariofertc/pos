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


   function agregar($customer_id = -1){
        $person_data = array(
            'first_name' => $this->input->post('first_name'),
            'last_name' => $this->input->post('last_name'),
            'email' => $this->input->post('email'),
            'phone_number' => $this->input->post('phone_number'),
            'address_1' => $this->input->post('address_1'),
            'address_2' => $this->input->post('address_2'),
            'city' => $this->input->post('city'),
            'state' => $this->input->post('state'),
            'zip' => $this->input->post('zip'),
            'country' => $this->input->post('country'),
            'comments' => $this->input->post('comments')
        );
        $customer_data = array(
            'account_number' => $this->input->post('account_number') == '' ? null : $this->input->post('account_number'),
            'taxable' => $this->input->post('taxable') == '' ? 0 : 1,
        );
        $msg="";
        if ($this->Customer->save($person_data, $customer_data, $customer_id)) {

            $res= $this->webuser->save(array('customer_id'=>$customer_data['person_id']),$this->user->user_id);
            if(!$res['error']){
                $msg = $this->lang->line('market_webuser_updated');
            }
            //New customer
            if ($customer_id == -1) {
                echo json_encode(array('success' => true, 'message' => $this->lang->line('market_customers_successful_adding') . ' ' .
                    $person_data['first_name'] . ' ' . $person_data['last_name'], 'person_id' => $customer_data['person_id']));
            } else { //previous customer
                echo json_encode(array('success' => true, 'message' => $this->lang->line('market_customers_successful_updating') . ' ' .
                    $person_data['first_name'] . ' ' . $person_data['last_name'], 'person_id' => $customer_id));
            }
        } else {//failure
            echo json_encode(array('success' => false, 'message' => $this->lang->line('market_customers_error_adding_updating') . ' ' .
                $person_data['first_name'] . ' ' . $person_data['last_name'], 'person_id' => -1));
        }
   }
}
