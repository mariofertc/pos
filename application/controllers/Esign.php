<?php require_once ("Secure_area.php");
class Esign extends Secure_area {
    var $controller_name = "esign";
    function __construct() {
        parent::__construct($this->controller_name);
    }

    function index() {
        //Crear la tabla sólo al ver el índice.
        $this->Sale->create_sales_items_temp_table();
        //$data['controller_name'] = strtolower($this->uri->segment(1));
        $data['controller_name'] = $this->controller_name;
        //$data['form_width'] = $this->get_form_width();
        $data['manage_table'] = get_sign_manage_table();
        $this->twig->set($data);
        $this->twig->display('abonos/manage');
    }
    function mis_datos() {
        $this->load->model('reports/Detailed_sales');
        
/*        $almacen = array();
        foreach ($this->Almacen->get_all() as $row) {
            $almacen[] = $row->nombre;
            $almacen[] = "id" . $row['almacen_id'];
        }*/
        $aColumns = array('sale_id','sale_id', 'sale_date', 'sale_date_time', 'items_purchased', 'employee_name', 'customer_name', 'subtotal', 'total', 'tax', 'payment_type');

        /*$aColumns = array_merge($aColumns, $almacen);
        $aColumns = array_merge($aColumns, array('quantity'));*/
        $aColumns = array_merge($aColumns, array('estado'));
        //        var_dump($aColumns);
        //Eventos Tabla
        $cllAccion = array(
            '1' => array(
                'function' => "view",
                'common_language' => "common_edit",
                'language' => "_update",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height()),
            '2' => array(
                'function' => "inventory",
                'common_language' => "common_inv",
                'language' => "_update",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height()),
            '3' => array(
                'function' => "inventory_mov",
                'common_language' => "common_mov",
                'language' => "_update",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height()),
            '4' => array(
                'function' => "count_details",
                'common_language' => "common_det",
                'language' => "_update",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height())
        );
        echo getData($this->Sale, $aColumns, $cllAccion);
    }
    function get_form_width() {
        return 560;
    }

    function get_form_height() {
        return 550;
    }
}