<?php

require_once ("secure_area.php");
class Ecommerce extends Secure_area {

	var $data;

    function __construct() {
        parent::__construct('ecommerce');
        $this->data['controller_name'] = 'ecommerce';
        $this->load->library('PaypalRest');
        $this->load->model('webuser_direccion');
    }

    function index() {
        $this->data['form_width'] = $this->get_form_width();
        $this->data['manage_table'] = get_ecommerce_manage_table();
        $this->data['title'] = 'customer_customer';
        $this->twiggy->set($this->data);
        return $this->twiggy->display('ecommerce/manage');
    }

    function mis_datos() {

        $aColumns = array('order_id', 'fecha_creacion', 'usuario', 'descripcion','valor','payment_id', 'estado');

        //Eventos Tabla
        $cllAccion = array(
            '1' => array(
                'function' => "view",
                'common_language' => "market_enviar_pedido",
                'language' => "market_enviar_pedido",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height()),
        );
        echo getData($this->orden, $aColumns, $cllAccion);
    }

     function get_row() {
        $item_id = $this->input->post('row_id');
        $data_row = get_item_data_row($this->Item->get_info($item_id), $this);
        echo $data_row;
    }

    /**
     * Muestra la vista previa de impresion para el sobre de envio
     * con los datos de entrega del pedido
     * @param  integer $orden_id Orden de compra
     * @return HTMLv            Vista previa de sobre de impresion
     */
    function sobre_envio($orden_id = -1) {
        $item = $this->orden->get_info($orden_id);
        $item->usuario=$this->webuser->get_info($item->user_id);
        $tipo_direccion = ($item->usuario->misma_direccion)?'FACTURA':'ENVIO';
        $item->direccionE=$this->webuser_direccion->get_by_user($item->user_id,$tipo_direccion);
        $data['item_info']=$item;
        $this->twiggy->set($data);
        $this->twiggy->display("ecommerce/sobre_envio");
    }

    function view($orden_id = -1) {
        $item = $this->orden->get_info($orden_id);
        $item->usuario=$this->webuser->get_info($item->user_id);
        $item->direccionE=$this->webuser_direccion->get_by_user($item->user_id,'ENVIO');
        $item->direccionF=$this->webuser_direccion->get_by_user($item->user_id);

        $payment = $this->paypalrest->getPaymentDetails($item->payment_id);
        $transaccion = $payment->transactions[0];
        $item->productos=$transaccion->item_list->items;
        $data['transaccion']=$transaccion;
        $data['item_info']=$item;
        $this->twiggy->set($data);
        $this->twiggy->display("ecommerce/form");
    }

     function save($order_id = -1) {
        $item_data = array(
            'name' => $this->input->post('name'),
            'description' => $this->input->post('description'),
            'category' => $this->input->post('category'),
            'brand' => $this->input->post('brand'),
            'supplier_id' => $this->input->post('supplier_id') == '' ? null : $this->input->post('supplier_id'),
            'item_number' => $this->input->post('item_number') == '' ? null : $this->input->post('item_number'),
            'cost_price' => $this->input->post('cost_price'),
            'unit_price' => $this->input->post('unit_price'),
            'quantity' => $this->input->post('quantity'),
            'reorder_level' => $this->input->post('reorder_level'),
            'allow_alt_description' => $this->input->post('allow_alt_description'),
            'is_serialized' => $this->input->post('is_serialized'),
            'size' => $this->input->post('size'),
            'color' => $this->input->post('color'),
            'color_value' => $this->input->post('color_value'),
            'tags' => $this->input->post('tags')
                // 'almacen_id'=>$this->input->post('almacen_id')=='' ? null:$this->input->post('almacen_id')
        );
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
        $cur_item_info = $this->Item->get_info($item_id);


        $this->db->trans_start();
        // $this->db->insert('abonos',$abonos_data);
        // $abono_id = $this->db->insert_id();

        if ($this->Item->save($item_data, $item_id)) {
            //New item
            if ($item_id == -1) {
                echo json_encode(array('success' => true, 'message' => $this->lang->line('items_successful_adding') . ' ' .
                    $item_data['name'], 'item_id' => $item_data['item_id']));
                $item_id = $item_data['item_id'];
            } else { //previous item
                echo json_encode(array('success' => true, 'message' => $this->lang->line('items_successful_updating') . ' ' .
                    $item_data['name'], 'item_id' => $item_id));
            }
            //Actualiza Stock Items.
            //sumar stock almacenes.
            $stock_data = array(
                'almacen_id' => $this->input->post('almacen_id') == '' ? null : $this->input->post('almacen_id'),
                'item_id' => $item_id,
                'cantidad' => $this->input->post('quantity'));
            $this->Almacen_stock->save($stock_data, $item_id);
            $item_data['quantity'] = $this->Almacen_stock->suma_stock($item_id);
            $this->Item->save($item_data, $item_id);

            $inv_data = array
                (
                'trans_date' => date('Y-m-d H:i:s'),
                'trans_items' => $item_id,
                'trans_user' => $employee_id,
                'trans_comment' => $this->lang->line('items_manually_editing_of_quantity'),
                'trans_inventory' => $cur_item_info ? $this->input->post('quantity') - $cur_item_info->quantity : $this->input->post('quantity')
            );
            $this->Inventory->insert($inv_data);
            $items_taxes_data = array();
            $tax_names = $this->input->post('tax_names');
            $tax_percents = $this->input->post('tax_percents');
            for ($k = 0; $k < count($tax_percents); $k++) {
                if (is_numeric($tax_percents[$k])) {
                    $items_taxes_data[] = array('name' => $tax_names[$k], 'percent' => $tax_percents[$k]);
                }
            }
            $this->Item_taxes->save($items_taxes_data, $item_id);

            $this->db->trans_complete();
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                echo json_encode(array('success' => false, 'message' => $this->lang->line('items_error_adding_updating') . ' ' .
                    $item_data['name'], 'item_id' => -1));
            } else {
                $this->db->trans_commit();
            }
        } else {//failure
            echo json_encode(array('success' => false, 'message' => $this->lang->line('items_error_adding_updating') . ' ' .
                $item_data['name'], 'item_id' => -1));
        }
    }

    /*
      get the width for the add/edit form
     */

    function get_form_width() {
        return 460;
    }

    function get_form_height() {
        return 500;
    }
}