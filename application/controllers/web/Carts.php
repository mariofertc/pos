<?php
require_once ("Secure_CI.php");
class Carts extends Secure_CI {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->load->model('cart');
        $this->data['controller_name'] = $this->controller_name;
        $this->twiggy->theme('web');
    }

    function index(){
    	$this->data['title'] = 'Market - Carrito ';
    	
    	$this->data['productos'] = $this->cart->get_items_by_user($this->user->user_id);
        
        $this->twiggy->set($this->data);
        $this->twiggy->display('carrito/carrito');
    }

    function add_to_cart(){
        $item_id = $this->input->post('producto');

        if(!is_null($item_id)){
            $item_data=array(
                'item_id'=>$item_id,
                'user_id'=>$this->user->user_id
                );
            $res = $this->cart->save($item_data);
            if(!$res['error'])
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_item_added_to_cart'))); 
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_item_add_to_cart_error'))); 
        }
    }

    function remove_from_cart(){
        $item_id = $this->input->post('producto');

        if(!is_null($item_id)){
            $res = $this->cart->delete($item_id);
            if(!$res['error'])
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_item_remove_from_cart'))); 
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_item_remove_from_cart_error'))); 
        }
    }
}