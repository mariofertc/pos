<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require_once ("Secure_CI.php");
class Carts extends Secure_CI {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->load->model('cart');
        $this->load->model('orden');
        $this->load->library('PaypalRest');
        $this->data['controller_name'] = $this->controller_name;
        $this->twiggy->theme('web');
    }

    /**
     * Muestra el carrito de compras, desde el cual se inicia el proceso de compra
     * @return [HTML] [carrito.html.twig]
     */
    function index(){
    	$this->data['title'] = 'Market - Carrito ';
    	$this->data['productos'] = $this->cart->get_items_by_user($this->user->user_id);
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
     * Muestra el paso 1 (Vista para recolectar Información del usuario para entregar el producto)
     * @return [HTML] [entrega.html.twig]
     */
    function entrega(){
        $this->twiggy->display('carrito/entrega');
    }

    /**
     * Muestra el paso 2 (Vista para ingresar la info de modo de pago)
     * Se realiza la llamada a pago directo con tarjeta de credito
     * o se llama a función express chekout de paypal
     * @return [HTML] [pago.html.twig]
     */
    function pago(){
        $this->twiggy->display('carrito/pago');
    }

    function finalizar(){
        $this->twiggy->display('carrito/finalizar');
    }
    /**
     * [pago_paypal description]
     * @return [type] [description]
     */
    function pago_paypal(){
        try {
            $monto = $this->_get_total($this->user->user_id);
            $description = $this->_get_id_items($this->user->user_id);

            $orden_data=array('user_id'=>$this->user->user_id,
                              'valor'=>$monto,
                              'descripcion'=>$description,
                              'fecha_creacion'=>date('Y-m-d H:i:s'));

            $res = $this->orden->save($orden_data);

            if(!$res['error']){
                $orderId = $res['ID'];
                $baseUrl = site_url('web/market/procesar_compra') . "?orderId=$orderId";
                $payment = $this->paypalrest->makePaymentUsingPayPal($monto, 'USD', $description,
                        "$baseUrl", site_url('web/Carts/pago'));
                $tran_data = array('payment_id'=>$payment->getId(),
                                    'estado'=>$payment->getState()
                            );
                $upd = $this->orden->save($tran_data,$orderId);
                if(!$upd['error']){     
                    header("Location: " . $this->paypalrest->getLink($payment->getLinks(), "approval_url") );
                    exit;  
                }
            }
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_orden_cc_error')));          
        } catch (\PayPal\Exception\PPConnectionException $ex) {
            $message = parseApiError($ex->getData());
            echo json_encode(array('error'=>TRUE,'msg'=>$message));
        } catch (Exception $ex) {
            $message = $ex->getMessage();
            echo json_encode(array('error'=>TRUE,'msg'=>$message));
        }
    }

    function _register_cc(){
        $cc =$this->input->post('card-number');
        if(trim($cc) != ""){
            $cvv =$this->input->post('cvv');
            $cc_data= array('type'=>$this->input->post('credit_card'),
                            'number'=>$cc,
                            'expire_month'=>$this->input->post('expiry-month'),
                            'expire_year'=>$this->input->post('expiry-year'),
                            'cvv2'=>$cvv);
             // If CVV2 is not required, we need to remove it. We cannot keep it empty or ''
             //  as it is considered your CVV2 is set to ''
            if (isset($cvv) && trim($cvv) == '') unset($cc_data['cvv2']);
            
            $creditCardId =$this->paypalrest->saveCard($cc_data);
            return $creditCardId;
        }
    }

    function pago_cc(){
         try {
            
            $description = $this->_get_id_items($this->user->user_id);

            $monto = $this->_get_total($this->user->user_id);
            
            if($monto>=0){
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_monto_cero'))); 
                exit;
            }

            $cc_id = $this->_register_cc();

            $payment = $this->paypalrest->makePaymentUsingCC($cc_id, $monto, 'USD', $description);

            $orden_data=array('user_id'=>$this->user->user_id,
                              'payment_id'=>$payment->getId(),
                              'estado'=>$payment->getState(),
                              'valor'=>$monto,
                              'descripcion'=>$description,
                              'fecha_creacion'=>date('Y-m-d H:i:s'));

            $res = $this->orden->save($orden_data);
            if(!$res['error'])
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_orden_cc_ok'))); 
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_orden_cc_error'))); 

        } catch (\PayPal\Exception\PPConnectionException $ex) {
            $message = parseApiError($ex->getData());
            echo json_encode(array('error'=>TRUE,'msg'=>$message.'PP')); 
        } catch (Exception $ex) {
            $message = $ex->getMessage();
            echo json_encode(array('error'=>TRUE,'msg'=>$message)); 
        }
    }

    function clear_cart(){
        $res = $this->cart->delete_by_user($this->user->user_id);
        if(!$res['error'])
            echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_carrito_limpiado_ok'))); 
        else
            echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_carrito_limpiado_error').$res['msg'])); 
    }

    private function _get_total($user_id){
        $this->data['productos'] = $this->cart->get_items_by_user($user_id);
        $subtotal =0;
        foreach ($this->data['productos'] as $key => $producto) {
            $subtotal+=( $producto->cantidad*$producto->unit_price);
        }
        return $subtotal;
    }

    private function _get_id_items($user_id){
        $this->data['productos'] = $this->cart->get_items_by_user($user_id);
        $items =array();
        foreach ($this->data['productos'] as $key => $producto) {
            $items[]=$producto->item_id;
        }
        return implode(',',$items);
    }

    function add_to_cart(){
        $item_id = $this->input->post('producto');
        if(!is_null($item_id)){
            $item_data=array(
                'item_id'=>$item_id,
                'user_id'=>$this->user->user_id
                );
            if($this->input->post('cantidad')!="")
                $item_data['cantidad']=$this->input->post('cantidad');
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