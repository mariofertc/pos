<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Carts extends CI_Controller {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->load->model('cart');
        $this->load->library('PaypalRest');
        $this->load->library('sale_lib');
        $this->data['controller_name'] = $this->controller_name;
        if($this->Customer->is_logged_in()){
            $this->user = $this->Customer->get_logged_in_customer_info();;
            $this->twiggy->set('webuser_data',$this->user);
        }
        $this->twiggy->theme('web');
    }

    /**
     * Muestra el carrito de compras, desde el cual se inicia el proceso de compra
     * @return [HTML] [carrito.html.twig]
     */
    function index(){
    	$this->data['title'] = 'Market - Carrito ';
        
        $this->data['productos'] = $this->sale_lib->get_cart();
        //print_r($this->data['productos']);
        $subtotal =0;
        foreach ($this->data['productos'] as $key => &$producto) {
            $subtotal+=( $producto['quantity']*$producto['price']);
            // $this->data['producto']->imagenes=$this->file_model->get_all_by_item($pro)->result();
            $producto['imagenes']=$this->file_model->get_all_by_item($producto['item_id'])->result();
        }
        $this->data['subtotal']=$subtotal;
        $this->data['total']=$subtotal;

        $this->twiggy->set($this->data);
        $this->twiggy->display('carrito/carrito');
    }
    function almacen(){
        echo "1";
        echo $this->sale_lib->get_almacen();
        echo "...2";
        $almacen = $this->Almacen->get_first();
        print_r($almacen);
        $almacen_id = $this->Almacen->get_first()->almacen_id;
        echo "...3";
        $this->Almacen->get_info($this->sale_lib->get_almacen() != -1 ? $this->sale_lib->get_almacen() : $this->Almacen->get_first()->almacen_id);
        echo "...4";
    
    }
    /**
     * Vacia el carrito de compras del usuario logeado
     * @return [array]       {error:true/false,ID:}
     */
    function clear_cart(){
        $res = $this->cart->delete_by_user($this->user->person_id);
        if(!$res['error'])
            echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_carrito_limpiado_ok'))); 
        else
            echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_carrito_limpiado_error').$res['msg'])); 
    }

    /**
     * Calcula y devuelve el total a pagar, sumando los precios de cada producto del carrito
     * @param  [integer] $person_id Clave primaria del usuario
     * @return [double]          Total del carrito
     */
    private function _get_total($person_id){
        $this->data['productos'] = $this->cart->get_items_by_user($person_id);
        $subtotal =0;
        foreach ($this->data['productos'] as $key => $producto) {
            $subtotal+=( $producto->cantidad*$producto->unit_price);
        }
        return $subtotal;
    }

    /**
     * Devuelve un string con los ids de los items de un usuario
     * @param  [integer] $person_id Clave primaria del usuario
     * @return [string]  id1,id2,id3...
     */
    private function _get_id_items($person_id){
        $this->data['productos'] = $this->cart->get_items_by_user($person_id);
        $items =array();
        foreach ($this->data['productos'] as $key => $producto) {
            $items[]=$producto->item_id;
        }
        return implode(',',$items);
    }

    /**
     * Devuelve un string con una pequeña info de la compra
     * @param  [integer] $person_id Clave primaria del usuario
     * @return [string]  id1,id2,id3...
     */
    private function _resumen_items($person_id){
        $this->data['productos'] = $this->cart->get_items_by_user($person_id);
        $descripcion = '';

        foreach ($this->data['productos'] as $key => $producto) {
            $descripcion.=''.$producto->name.'('.$producto->cantidad.' u), ';
        }
        $descripcion=substr($descripcion, 0,strlen($descripcion)-2);
        $descripcion.='    Total: '.$this->_get_total($person_id);
        return $descripcion;
    }

    /**
     * Devuelve un string con una pequeña info de la compra
     * @param  [integer] $person_id Clave primaria del usuario
     * @return [string]  id1,id2,id3...
     */
    private function _descripcion_items($person_id){
        $this->data['productos'] = $this->cart->get_items_by_user($person_id);
        $descripcion = '<table>';

        foreach ($this->data['productos'] as $key => $producto) {
            $descripcion.='<tr>';
            $descripcion.='<td>'.$producto->name.'('.$producto->cantidad.')</td>';
            $descripcion.='<td>'.$producto->unit_price*$producto->cantidad.'</td>';
            $descripcion.='</tr>';
        }
        $descripcion.='<tr><td>Total</td><td>'.$this->_get_total($person_id).'</td></tr>';
        $descripcion.='</table>';
        return $descripcion;
    }
    
     /**
     * Obtiene el ID del producto y la cantidad mediante POST, y toma el id del usuario logeado actualmente
     * para añadir un producto al carrito
     * @return [array]       {error:true/false,msg:'',tipo:'',warning:''}
     */
    function add_to_cart(){
        $mode = $this->sale_lib->get_mode();
        $almacen = $this->Almacen->get_info($this->sale_lib->get_almacen() != -1 ? $this->sale_lib->get_almacen() : $this->Almacen->get_first()->almacen_id);
        $quantity = $this->input->post("cantidad");
        if(!$quantity){
            $quantity = $mode == "sale" ? 1 : -1;
        }
        $item_id = $this->input->post('producto');
        $error=FALSE;
        $tipo_error='OK';
        if(!is_null($item_id)){
            if (!$this->sale_lib->add_item($item_id, $quantity, 0, null, null, null, null, $almacen)) {
                $tipo_error = 'error';
                $msg_error = $this->lang->line('sales_unable_to_add_item');
                $error=TRUE;
            }

            if ($this->sale_lib->out_of_stock($item_id, $almacen)) {
                $tipo_error = 'warning';
                $msg_error = $this->lang->line('sales_quantity_less_than_zero');
                $error=TRUE;
            }

            if(!$error)
                echo json_encode(array('error'=>FALSE,'tipo'=>$tipo_error,'msg'=>$this->lang->line('market_item_added_to_cart'))); 
            else
                echo json_encode(array('error'=>TRUE,'tipo'=>$tipo_error,'msg'=>$this->lang->line('market_item_add_to_cart_error'),'warning'=>$msg_error)); 
        }
    }

    /**
     * Obtiene la posicion del producto en un array mediante POST y lo quita del carrito
     * @return [array]       {error:true/false,ID:}
     */
    function update_cart(){
        $this->form_validation->set_rules('cantidad', 'lang:items_quantity', 'required|numeric');
        $this->form_validation->set_rules('producto', 'producto', 'required');
        $item_number = $this->input->post('producto');
        $quantity = $this->input->post("cantidad");
        if($this->form_validation->run() != FALSE){
            $error=FALSE;
            if (! $this->sale_lib->edit_quantity_item($item_number,$quantity)){
                $msg_error = $this->lang->line('sales_error_editing_item');
                $error=TRUE;
            }
            $almacen = $this->Almacen->get_info($this->sale_lib->get_almacen() != -1 ? $this->sale_lib->get_almacen() : $this->Almacen->get_first()->almacen_id);
            if ($this->sale_lib->out_of_stock($this->sale_lib->get_item_id($item_number), $almacen)) {
                $msg_error = $this->lang->line('sales_quantity_less_than_zero');
                $error=TRUE;
            }
            if(!$error)
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_item_update_cart'))); 
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$msg_error)); 
        }else{
            echo json_encode(array('error'=> TRUE, 'msg'=>"Favor ingrese la cantidad"));
        }
    }

    /**
     * Obtiene la posicion del producto en un array mediante POST y lo quita del carrito
     * @return [array]       {error:true/false,ID:}
     */
    function remove_from_cart(){
        $item_number = $this->input->post('producto');

        if(!is_null($item_number)){
            $error = $this->sale_lib->delete_item($item_number);
            if(!$error)
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_item_remove_from_cart'))); 
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_item_remove_from_cart_error'))); 
        }
    }
}