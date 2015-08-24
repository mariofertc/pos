<?php
require_once ("secure_area.php");

class Blog extends Secure_area {

	var $data;

    function __construct() {
        parent::__construct('blog');
        $this->data['controller_name'] = 'blog';
    }
    
    /**
     * Vista para crear, editar y eliminar los articulos  del blog del market 
     * @return [type] [description]
     */
    function index() {
        $this->data['form_width'] = $this->get_form_width();
        $this->data['manage_table'] = get_blog_manage_table();
        $this->data['title'] = 'blog_manager_title';
        $this->twiggy->set($this->data);
        return $this->twiggy->display('blog/manage');
    }


    function mis_datos() {

        $aColumns = array('articulo_id', 'titulo', 'employee_id', 'fecha');

        //Eventos Tabla
        $cllAccion = array(
            '1' => array(
                'function' => "view",
                'common_language' => "common_edit",
                'language' => "_update",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height()),
        );
        echo getData($this->articulo_blog, $aColumns, $cllAccion);
    }

    function get_row() {
        $articulo_id = $this->input->post('row_id');
        $data_row = get_blog_data_row($this->articulo_blog->get_info($articulo_id), $this);
        echo $data_row;
    }

    function view($item_id = -1) {
        $item = $this->articulo_blog->get_info($item_id);

        $data['articulo_info']=$item;
        $this->twiggy->set($data);
        $this->twiggy->display("blog/form");
    }

    /**
     * Obtienes los datos del formulario  y los envia para ser almacenados
     * @param  integer $articulo_id Clave primaria del articulo
     * @return [type]                  [description]
     */
    function save($articulo_id = -1) {
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;

        $articulo_data = array(
            'titulo' => $this->input->post('titulo'),
            'detalle' => $this->input->post('descripcion'),
            'fecha' => date('Y-m-d H:i:s'),
            'employee_id'=>$employee_id,
        );


        if ($this->articulo_blog->save($articulo_data, $articulo_id)) {
            //New item
            if ($articulo_id == -1) {
                echo json_encode(array('success' => true, 'message' => $this->lang->line('articulos_successful_adding') . ' ' .
                    $articulo_data['titulo'], 'articulo_id' => $articulo_data['articulo_id']));
                $articulo_id = $articulo_data['articulo_id'];
            } else { //previous item
                echo json_encode(array('success' => true, 'message' => $this->lang->line('articulos_successful_updating') . ' ' .
                    $articulo_data['titulo'], 'articulo_id' => $articulo_id));
            }
        } else {//failure
            echo json_encode(array('success' => false, 'message' => $this->lang->line('articulos_error_adding_updating') . ' ' .
                $articulo_data['titulo'], 'lanzamiento_id' => -1));
        }
    }

    /**
     * Ancho formulario
     * @return integer ancho
     */
    function get_form_width() {
        return 660;
    }

    /**
     * Alto formulario
     * @return integer  alto
     */
    function get_form_height() {
        return 600;
    }
}