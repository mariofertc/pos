<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Carts extends CI_Controller {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->load->model('cart');
        $this->load->library('PaypalRest');
        $this->data['controller_name'] = $this->controller_name;
        if($this->webuser->is_logged()){
            $this->user = $this->session->userdata('webuser_data');
            $this->twiggy->set('webuser_data',$this->session->userdata('webuser_data'));
        }
        $this->twiggy->theme('web');
    }

    /**
     * Muestra el carrito de compras, desde el cual se inicia el proceso de compra
     * @return [HTML] [carrito.html.twig]
     */
    function index(){
    	$this->data['title'] = 'Market - Carrito ';
    	if (isset($this->user))
            $this->data['productos'] = $this->cart->get_items_by_user($this->user->user_id);
        else
            $this->data['productos'] = $this->cart->get_items_by_session($this->session->userdata('session_id'));

        $subtotal =0;
        foreach ($this->data['productos'] as $key => $producto) {
            $subtotal+=( $producto->cantidad*$producto->unit_price);
        }
        $this->data['subtotal']=$subtotal;
        $this->data['total']=$subtotal;

        $this->twiggy->set($this->data);
        $this->twiggy->display('carrito/carrito');
    }

    /**
     * Vacia el carrito de compras del usuario logeado
     * @return [array]       {error:true/false,ID:}
     */
    function clear_cart(){
        $res = $this->cart->delete_by_user($this->user->user_id);
        if(!$res['error'])
            echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_carrito_limpiado_ok'))); 
        else
            echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_carrito_limpiado_error').$res['msg'])); 
    }

    /**
     * Calcula y devuelve el total a pagar, sumando los precios de cada producto del carrito
     * @param  [integer] $user_id Clave primaria del usuario
     * @return [double]          Total del carrito
     */
    private function _get_total($user_id){
        $this->data['productos'] = $this->cart->get_items_by_user($user_id);
        $subtotal =0;
        foreach ($this->data['productos'] as $key => $producto) {
            $subtotal+=( $producto->cantidad*$producto->unit_price);
        }
        return $subtotal;
    }

    /**
     * Devuelve un string con los ids de los items de un usuario
     * @param  [integer] $user_id Clave primaria del usuario
     * @return [string]  id1,id2,id3...
     */
    private function _get_id_items($user_id){
        $this->data['productos'] = $this->cart->get_items_by_user($user_id);
        $items =array();
        foreach ($this->data['productos'] as $key => $producto) {
            $items[]=$producto->item_id;
        }
        return implode(',',$items);
    }

    /**
     * Devuelve un string con una pequeña info de la compra
     * @param  [integer] $user_id Clave primaria del usuario
     * @return [string]  id1,id2,id3...
     */
    private function _resumen_items($user_id){
        $this->data['productos'] = $this->cart->get_items_by_user($user_id);
        $descripcion = '';

        foreach ($this->data['productos'] as $key => $producto) {
            $descripcion.=''.$producto->name.'('.$producto->cantidad.' u), ';
        }
        $descripcion=substr($descripcion, 0,strlen($descripcion)-2);
        $descripcion.='    Total: '.$this->_get_total($user_id);
        return $descripcion;
    }

    /**
     * Devuelve un string con una pequeña info de la compra
     * @param  [integer] $user_id Clave primaria del usuario
     * @return [string]  id1,id2,id3...
     */
    private function _descripcion_items($user_id){
        $this->data['productos'] = $this->cart->get_items_by_user($user_id);
        $descripcion = '<table>';

        foreach ($this->data['productos'] as $key => $producto) {
            $descripcion.='<tr>';
            $descripcion.='<td>'.$producto->name.'('.$producto->cantidad.')</td>';
            $descripcion.='<td>'.$producto->unit_price*$producto->cantidad.'</td>';
            $descripcion.='</tr>';
        }
        $descripcion.='<tr><td>Total</td><td>'.$this->_get_total($user_id).'</td></tr>';
        $descripcion.='</table>';
        return $descripcion;
    }
    
     /**
     * Obtiene el ID del producto y la cantidad mediante POST, y toma el id del usuario logeado actualmente
     * para añadir un producto al carrito
     * @return [array]       {error:true/false,ID:}
     */
    function add_to_cart(){
        $item_id = $this->input->post('producto');
        if(!is_null($item_id)){
            $item_data=array(
                'item_id'=>$item_id,
                'session_id'=>$this->session->userdata('session_id')
                );
            if (isset($this->user))
                $item_data['user_id']=$this->user->user_id;
            if($this->input->post('cantidad')!="")
                $item_data['cantidad']=$this->input->post('cantidad');
            $res = $this->cart->save($item_data);
            if(!$res['error'])
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_item_added_to_cart'))); 
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_item_add_to_cart_error'))); 
        }
    }

    /**
     * Obtiene el ID del producto mediante POST y lo quita del carrito
     * @return [array]       {error:true/false,ID:}
     */
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