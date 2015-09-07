<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require_once ("Secure_CI.php");

class Store extends Secure_CI {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->load->model('cart');
        $this->load->model('webuser_direccion');
        $this->load->library('PaypalRest');
        $this->data['controller_name'] = $this->controller_name;
        $this->twiggy->theme('web');
    }

    /**
     * Muestra el paso 1 (Vista para recolectar Información del usuario para entregar el producto)
     * @return [HTML] [entrega.html.twig]
     */
    function entrega(){
        $this->data['direccionE']=$this->webuser_direccion->get_by_user($this->user->user_id,'ENVIO');
        $this->data['direccionF']=$this->webuser_direccion->get_by_user($this->user->user_id);
        $this->twiggy->set($this->data);
        $this->twiggy->display('carrito/entrega');
    }

    /**
     * Muestra el paso 2 (Vista para ingresar la info de modo de pago)
     * Se realiza la llamada a pago directo con tarjeta de credito
     * o se llama a función express chekout de paypal
     * @return [HTML] [pago.html.twig]
     */
    function pago(){
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
        $this->twiggy->display('carrito/pago');
    }

    function finalizar(){
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
        
        $this->data['direccionE']=$this->webuser_direccion->get_by_user($this->user->user_id,'ENVIO');
        $this->data['direccionF']=$this->webuser_direccion->get_by_user($this->user->user_id);
        $this->twiggy->set($this->data);
        $this->twiggy->display('carrito/finalizar');
    }

    /**
     * Guardar los datos de la orden de pago e invoca al formulario de paypal
     * @return [type] [description]
     */
    function pago_paypal(){
        try {
            $monto = $this->_get_total($this->user->user_id);
            $description = $this->_get_id_items($this->user->user_id);
            $item_list = $this->paypalrest->createItemsList($this->cart->get_items_by_user($this->user->user_id));
            $orden_data=array('user_id'=>$this->user->user_id,
                              'valor'=>$monto,
                              'descripcion'=>$description,
                              'fecha_creacion'=>date('Y-m-d H:i:s'));

            $res = $this->orden->save($orden_data);

            if(!$res['error']){
                $orderId = $res['ID'];
                $baseUrl = site_url('web/market/procesar_compra') . "?orderId=$orderId";
                $payment = $this->paypalrest->makePaymentUsingPayPal($monto, 'USD', $description, $item_list,
                        "$baseUrl", site_url('web/Store/pago'));
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
        } catch (\PayPal\Exception\PayPalConnectionException $ex) {
            $message = $this->paypalrest->parseApiError($ex->getData());
            echo json_encode(array('error'=>TRUE,'msg'=>$message));
        }
    }

    /**
     * Obtiene los datos de la tarjeta del cliente mediante POST y realiza una petición a Paypal
     * para generar un toque que sera utilizado en la transacción de compra
     *  Credit_card
     *  number
     *  expire_month
     *  expire_year
     *  cvv2 
     * @return array $creditCardId credit card parameters
     */
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
            $item_list = $this->paypalrest->createItemsList($this->cart->get_items_by_user($this->user->user_id));
            $monto = $this->_get_total($this->user->user_id);
            
            if($monto<=0){
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_monto_cero'))); 
                exit;
            }

            $cc_id = $this->_register_cc();

            $payment = $this->paypalrest->makePaymentUsingCC($cc_id, $monto, 'USD', $description,$item_list);

            $orden_data=array('user_id'=>$this->user->user_id,
                              'payment_id'=>$payment->getId(),
                              'estado'=>$payment->getState(),
                              'valor'=>$monto,
                              'descripcion'=>$description,
                              'fecha_creacion'=>date('Y-m-d H:i:s'));

            $res = $this->orden->save($orden_data);
            if(!$res['error']){
                $this->cart->delete_by_user($this->user->user_id);
                echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_orden_cc_ok'))); 
            }
            else
                echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('market_orden_cc_error'))); 

        } catch (\PayPal\Exception\PayPalConnectionException $ex) {
            $message = "";
            $error = json_decode($ex->getData(),true);
            switch ($error['name']){
                case 'VALIDATION_ERROR':
                    $message.= $this->lang->line('market_pagar_con_tarjeta_error_form');
                    foreach ($error['details'] as $e)
                    {
                        $message.="\t" . $e['field'] . "\n\t" . $e['issue'] . "\n\n";
                    }
                    break;
                }
            
            echo json_encode(array('error'=>TRUE,'msg'=>$message)); 
        }
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
}