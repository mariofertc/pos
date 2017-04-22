<?php
require_once ("secure_area.php");

class Lanzamientos extends Secure_area {

	var $data;

    function __construct() {
        parent::__construct('lanzamientos');
        $this->data['controller_name'] = 'lanzamientos';
    }
    
    /**
     * Vista para crear, editar y eliminar los elementos del banner inicial del market 
     * @return [type] [description]
     */
    function index() {
        $this->data['form_width'] = $this->get_form_width();
        $this->data['manage_table'] = get_lanzamientos_manage_table();
        $this->data['title'] = 'lanzamientos_market';
        $this->twiggy->set($this->data);
        return $this->twiggy->display('lanzamientos/manage');
    }


    function mis_datos() {

        $aColumns = array('lanzamiento_id', 'titulo', 'detalle', 'fecha','producto','activo');

        //Eventos Tabla
        $cllAccion = array(
            '1' => array(
                'function' => "view",
                'common_language' => "common_edit",
                'language' => "_update",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height()),
        );
        echo getData($this->lanzamiento, $aColumns, $cllAccion);
    }

    function get_row() {
        $item_id = $this->input->post('row_id');
        $data_row = get_lanzamiento_data_row($this->lanzamiento->get_info($item_id), $this);
        echo $data_row;
    }

    function view($item_id = -1) {
        $item = $this->lanzamiento->get_info($item_id);

        $data['lanzamiento_info']=$item;
        $this->twiggy->set($data);
        $this->twiggy->display("lanzamientos/form");
    }

    /**
     * Obtienes los datos del formulario  y los envia para ser almacenados
     * @param  integer $lanzamiento_id Clave primaria del lanzamiento
     * @return [type]                  [description]
     */
    function save($lanzamiento_id = -1) {

        $lanzamiento_data = array(
            'titulo' => $this->input->post('titulo'),
            'detalle' => $this->input->post('descripcion'),
            'item_id' => $this->input->post('item_id'),
            'activo' => $this->input->post('estado'),
        );
        if ($this->lanzamiento->save($lanzamiento_data, $lanzamiento_id)) {
            //New item
            if ($lanzamiento_id == -1) {
                echo json_encode(array('success' => true, 'message' => $this->lang->line('items_successful_adding') . ' ' .
                    $lanzamiento_data['titulo'], 'lanzamiento_id' => $lanzamiento_data['lanzamiento_id']));
                $lanzamiento_id = $lanzamiento_data['lanzamiento_id'];
            } else { //previous item
                echo json_encode(array('success' => true, 'message' => $this->lang->line('items_successful_updating') . ' ' .
                    $lanzamiento_data['titulo'], 'lanzamiento_id' => $lanzamiento_id));
            }
        } else {//failure
            echo json_encode(array('success' => false, 'message' => $this->lang->line('items_error_adding_updating') . ' ' .
                $lanzamiento_data['titulo'], 'lanzamiento_id' => -1));
        }
    }

    /**
     * Ancho formulario
     * @return integer ancho
     */
    function get_form_width() {
        return 460;
    }

    /**
     * Alto formulario
     * @return integer  alto
     */
    function get_form_height() {
        return 600;
    }
}