<?php

require_once ("secure_area.php");
class Ecommerce extends Secure_area {

	var $data;

    function __construct() {
        parent::__construct('ecommerce');
        $this->data['controller_name'] = 'ecommerce';
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
        echo getData($this->orden, $aColumns, $cllAccion);
    }

     function get_row() {
        $item_id = $this->input->post('row_id');
        $data_row = get_item_data_row($this->Item->get_info($item_id), $this);
        echo $data_row;
    }

    function view($item_id = -1) {
        $data['item_info'] = $this->Item->get_info($item_id);
        $data['item_tax_info'] = $this->Item_taxes->get_info($item_id);
        $suppliers = array('' => $this->lang->line('items_none'));
        //$almacenes = array('' => $this->lang->line('items_none'));
        foreach ($this->Supplier->get_all(100, 0) as $row) {
            $suppliers[$row['person_id']] = $row['company_name'] . ' (' . $row['first_name'] . ' ' . $row['last_name'] . ')';
        }
        $almacenes = array();
        foreach ($this->Almacen->get_all() as $row) {
            $almacenes[$row['almacen_id']] = $row['nombre'];
            $data['selected_almacen'] = $row['almacen_id'];
        }
        $data['almacenes'] = $almacenes;
        $data['suppliers'] = $suppliers;
        $data['selected_supplier'] = $this->Item->get_info($item_id)->supplier_id;
        //$data['selected_almacen'] = $this->Item->get_info($item_id)->almacen_id;
        //$data['selected_almacen'] = $this->Almacen_stock->get_info($item_id)->almacen_id;
        //$data['selected_almacen'] = 2;
        //var_dump($data['selected_almacen']);
        
        //$this->get_categories($item_id);

        $data['default_tax_1_rate'] = ($item_id == -1) ? $this->Appconfig->get('default_tax_1_rate') : '';
        $data['default_tax_1_name'] = ($item_id == -1) ? $this->Appconfig->get('default_tax_1_name') : '';
        $data['default_tax_2_rate'] = ($item_id == -1) ? $this->Appconfig->get('default_tax_2_rate') : '';
        $data['default_tax_2_name'] = ($item_id == -1) ? $this->Appconfig->get('default_tax_2_name') : '';
        // call_user_method(
//        $this->load->view("items/form", $data);
        $this->twiggy->set($data);
        $this->twiggy->display("items/form");
    }

     function save($item_id = -1, $almacen_id = -1) {
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
        return 550;
    }
}