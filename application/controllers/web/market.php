<?php

/**
 * Permite acceder y administrar secciones del market
 */

class Market extends CI_Controller {

    protected $controller_name;
    var $data;

    /**
     * Inicializa categorias, tallas, colores, tags y los datos del usuario
     * una sola vez para evitar redundancia
     */
    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->load->model('cart');
        $this->load->model('product_review');
        $this->load->model('blog_review');
        $this->load->library('PaypalRest');

        $this->data['controller_name'] = $this->controller_name;
        $this->data['categorias']=$this->Item->get_count_column("category",10,0,"total")->result();
        $this->data['tallas']=$this->Item->get_count_column("size",10,0,"size")->result();
        $this->data['colores']=$this->Item->get_count_column("color_value",10,0,"color_value")->result();
        $this->data['tags']=$this->Item->get_tags();
        $this->data['precios']=$this->Item->get_limites_precios();
        $userdata = $this->session->userdata('customer_id');
        if(isset($userdata)){
            $this->data['webuser_data']=$this->Customer->get_logged_in_customer_info();
        }
        $this->twiggy->theme('web');
    }

    function index() {
        $this->data['title'] = 'Marketsillo';
        $this->data['lanzamientos']=$this->lanzamiento->get_ultimos();
        $this->twiggy->set($this->data);
        $this->twiggy->display('inicio');
    }

    function tienda() {
        $this->data['title'] = 'Market - Tienda ';
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
//echo $payerID;
        if($payerID && $orderID){
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
        $module = $this->input->post('module');

        if (!$this->Customer->login($username, $password)) {               
            echo json_encode(array('error'=>TRUE,'msg'=>$this->lang->line('login_invalid_username_and_password')));
        } else {
            echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('login_validated'),'module'=>$module));
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

    function email_check($email)
    {
        $this->form_validation->set_message(__FUNCTION__, $this->lang->line('market_email_existente'));
        return !$this->Customer->check_username($email);
    }

    /**
     * Registra un nuevo Webuser en el sistema solo con los datos básicos,
     * para que no le de pereza llevar el formulario y abandone
     * @return [json] {error:TRUE/FALSE,'msg':''}
     */
    function register(){
        $this->form_validation->set_rules('first_name', $this->lang->line('common_first_name'), 'required');
        $this->form_validation->set_rules('email', $this->lang->line('common_email'), 'required|valid_email|xss_clean|callback_email_check');
        $this->form_validation->set_rules('password', $this->lang->line('market_password'), 'required|matches[repassword]');
        $this->form_validation->set_rules('repassword', $this->lang->line('market_confirm_password'), 'required') ;      

        if($this->form_validation->run()==TRUE){
            $person_data=array(
                'first_name'=>$this->input->post('first_name'),
                'last_name'=>$this->input->post('last_name'),
                'email'=>$this->input->post('email'),
                'phone_number'=>$this->input->post('telefono'),
                'country'=>$this->input->post('pais'),
                );

            $customer_data = array(
                'account_number' => $this->input->post('account_number') == '' ? null : $this->input->post('account_number'),
                'taxable' => $this->input->post('taxable') == '' ? 0 : 1,
                'password'=>md5($this->input->post('password')),
                'username'=>$this->input->post('email')
            );
            $res= $this->Customer->save($person_data,$customer_data,-1);
                if($res){
                    $msg = $this->lang->line('market_new_user_registered');
                    //Envio mail con datos de registro
                    $this->bienvenida($person_data,$this->input->post('password'));
                    
                    if($this->Customer->login($this->input->post('email'), $this->input->post('password')))
                        $msg .=  $this->lang->line('market_new_user_logged');
                  echo json_encode(array('error'=>FALSE,'msg'=>$msg));   
                }else{
                  echo json_encode(array('error'=>TRUE,'msg'=>$res['msg']));
                }
        }else{
            echo json_encode(array('error'=>TRUE,'msg'=>validation_errors()));
        }   
    }

    private function bienvenida($person_data,$password){
        $mensaje = "<!doctype html><HTML><HEAD><title>".$this->config->item('company')."</title></HEAD><BODY>";
        $mensaje .= "<table><thead><tr><td coldspan='2'>";
        $mensaje .= $this->lang->line('market_bienvenida_mensaje1');
        $mensaje .= $this->config->item('company').'.';
        $mensaje .= '</td></tr><tr><td colspan="2">';
        $mensaje .= $this->lang->line('market_bienvenida_mensaje').' '.$person_data['first_name'].' '.$person_data['last_name'].', ';
        $mensaje .= $this->lang->line('market_bienvenida_mensaje2');
        $mensaje .= '</td></tr></thead><tbody><tr><td>';
        $mensaje .= $this->lang->line('market_usuario').':</td><td> '.$person_data['email'];
        $mensaje .= '<td/></tr><tr><td>';
        $mensaje .= $this->lang->line('market_password').':</td><td> '.$password;
        $mensaje .= '<td/></tr></tbody>';
        $mensaje .= '<tfoot/><tr><td colspan="2">';
        $mensaje .= $this->config->item('company');
        $mensaje .= '<td/></tr><tr><td colspan="2">';
        $mensaje .= $this->config->item('address');
        $mensaje .= '<td/></tr><tr><td colspan="2">';
        $mensaje .= $this->config->item('phone').','.$this->config->item('fax');        
        $mensaje .= '<td/></tr><tr><td colspan="2">';
        $mensaje .= $this->config->item('email');
        $mensaje .= "</td></tr><tr><td></td></tr></tfoot></table></body></html>";
        $headers = "From: ".$person_data['email']."\r\n";
        $headers .= "Reply-To: ".$this->config->item('email')."\r\n";
        $headers .= "Content-type: text/html"."\r\n";
        mail($person_data['email'],$this->lang->line('market_bienvenida_asunto'),$mensaje,$headers);
    }
    /**
     * Muestra la vista de detalle del producto 
     * @param  [type] $pro [description]
     * @return [type]      [description]
     */
    function producto($pro) {
        $this->data['title'] = 'Market - Producto ';
        $this->data['producto']=$this->Item->get_info($pro);
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

    /**
     * Registra una opinión de un articulo del blog
     * @return [json] {error:TRUE/FALSE,'msg':''}
     */
    function add_blog_review(){
        $this->form_validation->set_rules('nombre', 'lang:market_your_name', 'required');
        $this->form_validation->set_rules('email', 'lang:market_email', 'required|valid_email');
        $this->form_validation->set_rules('detalle', 'lang:market_detalle', 'required');
        if($this->form_validation->run()==TRUE){

            $review_data = array(
                'nombre'=>$this->input->post('nombre'),
                'email'=>$this->input->post('email'),
                //'rating'=>$this->input->post('rating'),
                'detalle'=>$this->input->post('detalle'),
                'articulo'=>$this->input->post('articulo')
                );
             $res= $this->blog_review->save($review_data);
                if(!$res['error']){
                  echo json_encode(array('error'=>FALSE,'msg'=>$this->lang->line('market_review_added'),'ID'=>$res['ID']));   
                }else{
                  echo json_encode(array('error'=>TRUE,'msg'=>$res['msg']));
                }
         }else{
            echo json_encode(array('error'=>TRUE,'msg'=>validation_errors()));
        }  
    }

    /**
     * [get_review description]
     * @return [type]             [description]
     */
    function get_review(){
        $review_id=$this->input->post('ID');
        $this->data['review'] = $this->product_review->get_info($review_id);
        $this->twiggy->set($this->data);
        $this->twiggy->display('elementos/product_review');
    }

    /**
     * [get_review description]
     * @return [type]             [description]
     */
    function get_blog_review(){
        $articulo_id=$this->input->post('ID');
        $this->data['review'] = $this->blog_review->get_info($articulo_id);
        $this->twiggy->set($this->data);
        $this->twiggy->display('elementos/blog_review');
    }

    function destacados(){
        $this->data['productos'] = $this->Item->get_all(6,0,array('on_web'=>1),null,null);
        $this->twiggy->set($this->data);
        $this->twiggy->display('elementos/catalogo');
    }

    function productos($categoria){
        $this->data['productos'] = $this->Item->get_all(4,0,array('category'=>urldecode($categoria),'on_web'=>1),null,null);
        $this->twiggy->set($this->data);
        $this->twiggy->display('elementos/productos');
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
        //var_dump($where);
        $ultimo=$this->input->get('ultimo');
        $ultimo=(int)$ultimo+1;
        $this->data['productos'] = $this->Item->get_all(9,$ultimo,$where,null,$filtros);
        $this->twiggy->set($this->data);
        if(count($this->data['productos'])>0){
            $this->twiggy->display('elementos/catalogo');
        }else{
            $this->twiggy->display('elementos/catalogo');
        }
    }

    /**
     * Bloque HTML con bloque de producto para market
     * @return [HTML] [resumen producto]
     */
    function bloque_producto() {
        $product_id = $this->input->get('id');
        $destacad = $this->input->get('destacado');
        $destacado = empty($destacad) ? FALSE : TRUE;
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
    function autenticacion() {
        $this->data['title'] = 'Market - Login ';
        
        if(!$this->webuser->is_logged()){
            $this->data['comprando']=TRUE;
            $this->twiggy->set($this->data);
            $this->twiggy->display('carrito/autenticacion'); 
        }else{
            redirect(site_url('web/Store/entrega'));
        }
    }  

   
    /**
     * Página o bloque html con los formularios de Registro y Logeo
     * @param  boolean $ajax default FALSE
     * @return [HTML]        [description]
     */
    function loger($ajax=FALSE) {
        $this->data['title'] = 'Market - Login ';
        $this->data['module'] = $this->input->get('module');
        $this->data['ajax_request']=$ajax;
        $this->twiggy->set($this->data);
        $this->twiggy->display('loger');
    }   

    /**
     * Muestra el listado de articulos del blog 
     * @return [type] [description]
     */
    function blog() {
        $this->data['title'] = 'Market - Blog ';
        $this->data['articulos_blog']=$this->articulo_blog->get_ultimos(5);
        $this->twiggy->set($this->data);
        $this->twiggy->display('blog');
    }

    /**
     * Muestra la vista detallada del blog
     * @param  int $articulo_id [<description>]
     * @return [type] [description]
     */
    function blog_item($articulo_id) {
        $this->data['title'] = 'Market - Blog item ';
        $this->data['articulo']=$this->articulo_blog->get_info($articulo_id);
        $this->data['articulo']->opiniones=$this->blog_review->get_by_articulo($articulo_id);
        $this->data['articulo']->imagenes=$this->file_model->get_all_by_item($articulo_id)->result();
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