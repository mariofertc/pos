<?php
require_once ("Secure_CI.php");
class Wlist extends Secure_CI {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->load->model('wishlist');
        $this->data['controller_name'] = $this->controller_name;
        $this->twiggy->theme('web');
    }

    function index(){
    	$this->data['title'] = 'Market - Lista de Deseos ';
    	
    	$this->data['productos'] = $this->wishlist->get_items_by_user($this->user->user_id);

        $this->twiggy->set($this->data);
        $this->twiggy->display('wlist/wlist');
    }

    function add_to_wlist(){
        $item_id = $this->input->post('producto');
        if(!is_null($item_id)){
            $item_data=array(
                'item_id'=>$item_id,
                'user_id'=>$this->user->user_id
                );
            $res = $this->wishlist->save($item_data);
            if(!$res['error'])
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_item_added_to_wishlist'))); 
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_item_add_to_wishlist_error'))); 
        }
    }

    function remove_from_wlist(){
        $item_id = $this->input->post('producto');

        if(!is_null($item_id)){
            $res = $this->wishlist->delete($item_id);
            if(!$res['error'])
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_item_remove_from_whislist'))); 
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_item_remove_from_whishlist_error'))); 
        }
    }

}