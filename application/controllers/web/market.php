<?php

class Market extends CI_Controller {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->load->model('cart');
        $this->load->model('product_review');
        $this->load->library('PaypalRest');

        $this->data['controller_name'] = $this->controller_name;
        $this->data['categorias']=$this->Item->get_count_column("category",10,0,"total")->result();
        $this->data['tallas']=$this->Item->get_count_column("size",10,0,"size")->result();
        $this->data['colores']=$this->Item->get_count_column("color_value",10,0,"color_value")->result();
        $this->data['tags']=$this->Item->get_tags();
        $userdata = $this->session->userdata('webuser_data');
        if(isset($userdata)){
            $this->data['webuser_data']=$userdata;
        }
        $this->twiggy->theme('web');
    }

    function index() {
        $this->data['title'] = 'Marketsillo';
        $this->twiggy->set($this->data);
        $this->twiggy->display('tienda');
    }
    /**
     * Procesa la compra final con el token del payment(transaccion) y el payerID(comprador) 
     * parametros devueltos desde paypal: 
     *  orderId=14&paymentId=PAY-2HG46209BR680105TKURPIWY&token=EC-8AP68113SD778140M&PayerID=8QWG22PUJ668Y
     * @return [JSON] [description]
     */
    function procesar_compra(){
        $payerID = $this->input->get('PayerID');
        $orderID = $this->input->get('orderId');

        if(isset($payerID) && isset($orderID)){
            try {
                $order = $this->orden->get_info($orderID);
                $payment = $this->paypalrest->executePayment($order->payment_id, $payerID);
                $res = $this->orden->save(array('estado'=>$payment->getState()),$orderID);
                print_r($order);
                if(!$res['error']){
                    $this->data['error']=FALSE;
                    $this->data['msg']=$this->lang->line('market_procesar_compra_ok');
                    $this->cart->delete_by_user($order->user_id);
                }
                else{
                    $this->data['error']=TRUE;
                    $this->data['msg']=$this->lang->line('market_procesar_compra_ok');
                }
            } catch (\PayPal\Exception\PPConnectionException $ex) {
                $message = parseApiError($ex->getData());
                 $this->data['error']=TRUE;
                $this->data['msg']=$message;
            } catch (Exception $ex) {
                $message = $ex->getMessage();
                $this->data['error']=TRUE;
                $this->data['msg']=$message;
            }
        }
        $this->twiggy->display('carrito/finalizar');
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
                    $msg = $this->lang->line('market_new_user_registered');
                    if($this->webuser->login($username, $password))
                        $msg .=  $this->lang->line('market_new_user_logged');
                  echo json_encode(array('error'=>FALSE,'msg'=>$msg));   
                }else{
                  echo json_encode(array('error'=>TRUE,'msg'=>$res['msg']));
                }
        }else{
            echo json_encode(array('error'=>TRUE,'msg'=>validation_errors()));
        }   
    }

    function tienda() {
        $this->data['title'] = 'Market - Tienda ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('tienda');
    }

    /**
     * Muestra la vista de detalle del producto 
     * @param  [type] $pro [description]
     * @return [type]      [description]
     */
    function producto($pro) {
        $this->data['title'] = 'Market - Producto ';
        $this->data['producto']=$this->Item->get_info($pro);
        $opiniones=$this->product_review->get_by_item($pro);
        $this->data['producto']->opiniones=$this->product_review->get_by_item($pro);
        $this->data['producto']->imagenes=$this->file_model->get_all_by_item($pro)->result();
        $this->twiggy->set($this->data);
        $this->twiggy->display('producto_detail');
    }

    /**
     * Registra una opinión de un producto
     * @return [json] {error:TRUE/FALSE,'msg':''}
     */
    function add_review(){
        $this->form_validation->set_rules('nombre', 'lang:market_your_name', 'required');
        $this->form_validation->set_rules('email', 'lang:market_email', 'required|valid_email');
        $this->form_validation->set_rules('detalle', 'lang:market_detalle', 'required');
        if($this->form_validation->run()==TRUE){

            $review_data = array(
                'nombre'=>$this->input->post('nombre'),
                'email'=>$this->input->post('email'),
                'rating'=>$this->input->post('rating'),
                'detalle'=>$this->input->post('detalle'),
                'item'=>$this->input->post('item')
                );
             $res= $this->product_review->save($review_data);
                if(!$res['error']){
                  echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_review_added'),'ID'=>$res['ID']));   
                }else{
                  echo json_encode(array('error'=>TRUE,'msg'=>$res['msg']));
                }
         }else{
            echo json_encode(array('error'=>TRUE,'msg'=>validation_errors()));
        }  
    }

    function get_review(){
        $review_id=$this->input->post('ID');
        $this->data['review'] = $this->product_review->get_info($review_id);
        $this->twiggy->set($this->data);
        $this->twiggy->display('elementos/product_review');
    }

    function destacados(){
        $this->data['productos'] = $this->Item->get_all(6,0,null,null,null);
        $this->twiggy->set($this->data);
        $this->twiggy->display('elementos/catalogo');
    }

    /**
     * Bloque HTML con 9 productos paginados que cumplan con 
     * los parametros obtenidos por GET
     * @return [HTML] [bloques de productos]
     */
    function catalogo(){
        $filtros = array();
        $where = array();
        //Procesar filtro Categorias
        $categorias = $this->input->get('categoria');
        if(!empty($categorias)){
            $filtros['category']= $categorias;
        }
        //Procesar filtro Precios
        $precios = $this->input->get('precios');
        if(!empty($precios)){
            $precios=explode(',', $precios);
            $where['unit_price >= ']=$precios[0];
            $where['unit_price <= ']=$precios[1];
        }
        //Procesar filtro Nombre
        $nombre=$this->input->get('nombre');
        if(trim($nombre)!=""){
            $where['name like ']='%'.$nombre.'%';
        }
        //Procesar filtro Tallas
        $tallas=$this->input->get('talla');
        if(!empty($tallas)){
            $filtros['size']= $tallas;
        }
        //Procesar filtro Colores
        $colores=$this->input->get('color');
        if(!empty($colores)){
            $filtros['color_value']= $colores;
        }
         //Procesar filtro Tags
        $tags = $this->input->get('tag');
        if(!empty($tags)){
            foreach ($tags as $key => $value) {
                $where['tags like ']='%'.$value.'%';
            }
        }
        $ultimo=$this->input->get('ultimo');
        $ultimo=(int)$ultimo+1;
        $this->data['productos'] = $this->Item->get_all(9,$ultimo,$where,null,$filtros);
        if(count($this->data['productos'])>0){
            $this->twiggy->set($this->data);
            $this->twiggy->display('elementos/catalogo');
        }
    }

    /**
     * Bloque HTML con bloque de producto para market
     * @return [HTML] [resumen producto]
     */
    function bloque_producto() {
        $product_id = $this->input->get('id');
        $destacado = empty($this->input->get('destacado')) ? FALSE : TRUE;
        $this->data['producto'] = $this->Item->get_info($product_id);
        $this->twiggy->set($this->data);
        if(!$destacado)
            $this->twiggy->display('elementos/item_producto');
        else
            $this->twiggy->display('elementos/item_producto_destacado');
    }

    function compra() {
        $this->data['title'] = 'Market - Compra ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('compra');
    }   

    /**
     * Página o bloque html con los formularios de Registro y Logeo
     * @param  boolean $ajax default FALSE
     * @return [HTML]        [description]
     */
    function loger($ajax=FALSE) {
        $this->data['title'] = 'Market - Login ';
        $this->data['ajax_request']=$ajax;
        $this->twiggy->set($this->data);
        $this->twiggy->display('loger');
    }   

    function blog() {
        $this->data['title'] = 'Market - Blog ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('blog');
    }

    function blog_item() {
        $this->data['title'] = 'Market - Blog item ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('blog_item');
    }  

    function contacto() {
        $this->data['title'] = 'Market - Contacto';
        $this->twiggy->set($this->data);
        $this->twiggy->display('contacto');
    }  

    function error404() {
        $this->data['title'] = 'Market - 404';
        $this->twiggy->set($this->data);
        $this->twiggy->display('error404');
    } 

}