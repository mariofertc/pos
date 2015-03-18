<?php

class Market extends CI_Controller {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->data['controller_name'] = $this->controller_name;
        $this->data['categorias']=$this->Item->get_count_categories(10)->result();
        $this->twiggy->theme('web');
    }

    function index() {
        $this->data['title'] = 'Market';
        $this->twiggy->set($this->data);
        $this->twiggy->display('inicio');
    }

    function tienda() {
        $this->data['title'] = 'Market - Tienda ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('tienda');
    }

    function producto($pro) {
        $this->data['title'] = 'Market - Producto ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('producto_detail');
    }

    /**
     * Bloque HTML con 10 productos paginados que cumplan con 
     * los parametros obtenidos por GET
     * @return [HTML] [bloques de productos]
     */
    function catalogo(){
        $this->data['productos'] = $this->Item->get_all(10,0,array());
        $this->twiggy->set($this->data);
        $this->twiggy->display('elementos/catalogo');
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

    function carrito() {
        $this->data['title'] = 'Market - Carrito ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('carrito');
    }   

    function compra() {
        $this->data['title'] = 'Market - Compra ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('compra');
    }   

    function login() {
        $this->data['title'] = 'Market - Login ';
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