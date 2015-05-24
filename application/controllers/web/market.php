<?php

class Market extends CI_Controller {

    protected $controller_name;
    var $data;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
        $this->data['controller_name'] = $this->controller_name;
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

    function producto() {
        $this->data['title'] = 'Market - Producto ';
        $this->twiggy->set($this->data);
        $this->twiggy->display('producto_detail');
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