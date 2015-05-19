<?php

require_once ("secure_area.php");
require_once ("interfaces/idata_controller.php");

class Items extends Secure_area implements iData_controller {

    protected $controller_name;

    function __construct() {
        $this->controller_name = 'items';
        parent::__construct($this->controller_name);
    }

    function index() {
        $this->show();
    }

    function show() {
        $data['controller_name'] = $this->controller_name;
        $data['form_width'] = $this->get_form_width();
        $data['manage_table'] = get_items_manage_table();
        $data['title'] = 'customer_customer';

        //Para busqueda almacenes.
        $almacenes = array('' => $this->lang->line('items_none'));
        foreach ($this->Almacen->get_all() as $row) {
            $almacenes[$row['almacen_id']] = $row['nombre'];
            $data['selected_almacen'] = $row['almacen_id'];
        }
        $data['almacenes'] = $almacenes;
        $data['total_almacenes'] = count($almacenes);
        $this->twiggy->set($data);
        return $this->twiggy->display('items/manage');

        // $this->output->enable_profiler(TRUE);
        $base_url = $this->uri->segment(3);
        $start_row = str_replace("&per_page=", "", $base_url);
        $per_page = 50;
        if ($start_row == '')
            $start_row = 0;
        $data['yop'] = str_replace("&per_page=", "", $base_url);
        $data['controller_name'] = strtolower($this->uri->segment(1));
        $data['form_width'] = $this->get_form_width();
        $total_rows = $this->Item->get_total_items();
        $data['manage_table'] = get_items_manage_table($this->Item->get_all_limit_prov($start_row, $per_page), $this);
        //Paginación
        $this->load->library('pagination');
        $config['base_url'] = 'index.php/items/show/';
        $config['total_rows'] = $total_rows;
        $config['per_page'] = $per_page;
        $config['num_links'] = $total_rows / $per_page;
        $this->pagination->initialize($config);
        $data['links'] = $this->pagination->create_links();

        //Para busqueda almacenes.
        $almacenes = array('' => $this->lang->line('items_none'));
        foreach ($this->Almacen->get_all()->result_array() as $row) {
            $almacenes[$row['almacen_id']] = $row['nombre'];
            $data['selected_almacen'] = $row['almacen_id'];
        }
        $data['almacenes'] = $almacenes;
        $this->load->view('items/manage', $data);
    }

    function mis_datos() {
        $almacen = array();
        foreach ($this->Almacen->get_all() as $row) {
//            $almacen[] = $row->nombre;
            $almacen[] = "id" . $row['almacen_id'];
        }
        $aColumns = array('item_id', 'item_number', 'name', 'category', 'company_name', 'cost_price', 'unit_price', 'tax_percents');

        $aColumns = array_merge($aColumns, $almacen);
        $aColumns = array_merge($aColumns, array('quantity'));
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
        echo getData($this->Item, $aColumns, $cllAccion);
    }

    function refresh() {
        $low_inventory = $this->input->post('low_inventory');
        $is_serialized = $this->input->post('is_serialized');
        $no_description = $this->input->post('no_description');
        $almacen_id = $this->input->post('almacen_id');


        $data['search_section_state'] = $this->input->post('search_section_state');
        $data['low_inventory'] = $this->input->post('low_inventory');
        $data['is_serialized'] = $this->input->post('is_serialized');
        $data['no_description'] = $this->input->post('no_description');
        $data['controller_name'] = strtolower($this->uri->segment(1));
        $data['form_width'] = $this->get_form_width();
        $data['manage_table'] = get_items_manage_table($this->Item->get_all_filtered($low_inventory, $is_serialized, $no_description, $almacen_id), $this);

        $almacenes = array('' => $this->lang->line('almacenes_todos'));
        foreach ($this->Almacen->get_all() as $row) {
            $almacenes[$row['almacen_id']] = $row['nombre'];
        }
        $data['selected_almacen'] = $almacen_id;
        $data['almacenes'] = $almacenes;

        //$this->output->enable_profiler(TRUE);
        $this->load->view('items/manage', $data);
    }

    function find_item_info() {
        $item_number = $this->input->post('scan_item_number');
        echo json_encode($this->Item->find_item_info($item_number));
    }

    function search() {
        $search = $this->input->post('search');
        $data_rows = get_items_manage_table_data_rows($this->Item->search($search), $this);
        echo $data_rows;
    }

    /*
      Gives search suggestions based on what is being searched for
     */

    /*function suggest() {
        $suggestions = $this->Item->get_search_suggestions($this->input->post('q'), $this->input->post('limit'));
        echo implode("\n", $suggestions);
    }*/
    
    function suggest() {
        $suggestions = $this->Item->get_suggestions($this->input->post('q'),$this->input->post('by'));
        echo json_encode($suggestions);
    }
    function suggest_tags() {
        $suggestions = $this->Item->get_suggestions($this->input->post('q'),$this->input->post('by'));
        $cll_tags = array();
        foreach($suggestions as $suggest){
            foreach(explode(",",$suggest) as $tag){
                if(!array_search($suggest, $cll_tags)){
                 $cll_tags[] = $tag;
                }                  
            }
        }
        echo json_encode($cll_tags);
    }

    function cantidades_almacen() {
        $item_id = $this->input->post('item_id');
        $almacen_id = $this->input->post('almacen_id');
        $data['cantidad'] = $this->Almacen_stock->get_cantidad($item_id, $almacen_id);
        echo json_encode(array('cantidad' => $data['cantidad']));
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
        
        $this->get_categories($item_id);

        $data['default_tax_1_rate'] = ($item_id == -1) ? $this->Appconfig->get('default_tax_1_rate') : '';
        $data['default_tax_1_name'] = ($item_id == -1) ? $this->Appconfig->get('default_tax_1_name') : '';
        $data['default_tax_2_rate'] = ($item_id == -1) ? $this->Appconfig->get('default_tax_2_rate') : '';
        $data['default_tax_2_name'] = ($item_id == -1) ? $this->Appconfig->get('default_tax_2_name') : '';
        // call_user_method(
//        $this->load->view("items/form", $data);
        $this->twiggy->set($data);
        $this->twiggy->display("items/form");
    }
    
    function get_categories($item_id){
        $category = $this->Item->get_category();
        $data['id_color'] = $category->first_row()->category_id;
        $data['id_talla'] = $category->last_row()->category_id;
        
        $data['tallas'] = $this->Item_Clasifica->get_all(10,0,array('category.category_id'=>$data['id_talla'],'items.item_id'=>$item_id));
        $data['colores'] = $this->Item_Clasifica->get_all(10,0,array('category.category_id'=>$data['id_color'],'items.item_id'=>$item_id));
        //var_dump($data);
        
        $this->twiggy->set($data);
    }

    //Ramel Inventory Tracking
    function inventory($item_id = -1) {
        $data['item_info'] = $this->Item->get_info($item_id);
        //$this->output->enable_profiler(TRUE);
        //Para Almacenes
        $almacenes = array();
        foreach ($this->Almacen->get_all() as $row) {
            $almacenes[$row['almacen_id']] = $row['nombre'];
            $data['selected_almacen'] = $row['almacen_id'];
        }
        $data['almacenes'] = $almacenes;
        $this->load->view("items/inventory", $data);
    }

    //Para mover entre almacenes
    function inventory_mov($item_id = -1) {
        $data['item_info'] = $this->Item->get_info($item_id);
        //$this->output->enable_profiler(TRUE);
        //Para Almacenes
        $almacenes = array();
        foreach ($this->Almacen->get_all() as $row) {
            $almacenes_det[$row['almacen_id']] = array('nombre' => $row['nombre'], 'cantidad' => $this->Almacen_stock->get_cantidad($item_id, $row['almacen_id']), 'id' => $row['almacen_id']);

            $almacenes[$row['almacen_id']] = $row['nombre'];
            $data['selected_almacen'] = $row['almacen_id'];
        }
        $data['almacenes_det'] = $almacenes_det;
        $data['almacenes'] = $almacenes;
        $this->load->view("items/move_inventory", $data);
    }

    //Ramel Inventory Tracking
    function save_inventory($item_id = -1) {
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
        $cur_item_info = $this->Item->get_info($item_id);
        $inv_data = array
            (
            'trans_date' => date('Y-m-d H:i:s'),
            'trans_items' => $item_id,
            'trans_user' => $employee_id,
            'trans_comment' => $this->input->post('trans_comment'),
            'trans_inventory' => $this->input->post('newquantity')
        );
        $this->Inventory->insert($inv_data);

        //Update stock quantity
        $item_data = array(
            'quantity' => $cur_item_info->quantity + $this->input->post('newquantity')
        );


        //Actualiza Stock Items.
        //sumar stock almacenes.
        $stock_data = array(
            'almacen_id' => $this->input->post('almacen_id') == '' ? null : $this->input->post('almacen_id'),
            'item_id' => $item_id,
            'cantidad' => $this->input->post('quantity') + $this->input->post('newquantity'));
        $this->Almacen_stock->save($stock_data, $item_id);

        $item_data['quantity'] = $this->Almacen_stock->suma_stock($item_id);
        //$this->Item->save($item_data,$item_id);


        if ($this->Item->save($item_data, $item_id)) {
            echo json_encode(array('success' => true, 'message' => $this->lang->line('items_successful_updating') . ' ' .
                $cur_item_info->name, 'item_id' => $item_id));
        } else {//failure
            echo json_encode(array('success' => false, 'message' => $this->lang->line('items_error_adding_updating') . ' ' .
                $cur_item_info->name, 'item_id' => -1));
        }
    }

//---------------------------------------------------------------------Ramel

    function update_inventory($item_id = -1) {
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
        $cur_item_info = $this->Item->get_info($item_id);
        $inv_data = array
            (
            'trans_date' => date('Y-m-d H:i:s'),
            'trans_items' => $item_id,
            'trans_user' => $employee_id,
            'trans_comment' => $this->input->post('trans_comment') == '' ? 'Traspaso de Almacenes' : $this->input->post('trans_comment'),
            'trans_inventory' => $this->input->post('newquantity')
        );
        $this->db->trans_start();

        $this->Inventory->insert($inv_data);

        //Update stock quantity
        // $item_data = array(
        // 'quantity'=>$cur_item_info->quantity + $this->input->post('newquantity')
        // );
        //Actualiza Stock Items origen.
        //sumar stock almacenes.
        $stock_data_o = array(
            'almacen_id' => $this->input->post('almacen_id_origen') == '' ? null : $this->input->post('almacen_id_origen'),
            'item_id' => $item_id,
            'cantidad' => $this->input->post('q-' . $this->input->post('almacen_id_origen')) - $this->input->post('newquantity'));


        //Actualiza Stock Items destino.
        //sumar stock almacenes.
        $stock_data_d = array(
            'almacen_id' => $this->input->post('almacen_id_destino') == '' ? null : $this->input->post('almacen_id_destino'),
            'item_id' => $item_id,
            'cantidad' => $this->input->post('q-' . $this->input->post('almacen_id_destino')) + $this->input->post('newquantity'));


        //Nota: no es necesario....
        //$item_data['quantity'] = $this->Almacen_stock->suma_stock($item_id);		
        $this->Almacen_stock->save($stock_data_d, $item_id);
        $this->Almacen_stock->save($stock_data_o, $item_id);

        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            echo json_encode(array('success' => false, 'message' => $this->lang->line('items_error_adding_updating') . ' ' .
                $cur_item_info->name, 'item_id' => -1));
        } else {
            $this->db->trans_commit();
            echo json_encode(array('success' => true, 'message' => $this->lang->line('items_successful_updating') . ' ' .
                $cur_item_info->name, 'item_id' => $item_id));
        }
    }

    function count_details($item_id = -1) {
        $data['item_info'] = $this->Item->get_info($item_id);
        $this->load->view("items/count_details", $data);
    }

//------------------------------------------- Ramel

    function generate_barcodes($item_ids) {
        $result = array();

        $item_ids = explode(',', $item_ids);
        foreach ($item_ids as $item_id) {
            $item_info = $this->Item->get_info($item_id);

            $result[] = array('name' => $item_info->name, 'id' => $item_id);
        }

        $data['items'] = $result;
        $this->twiggy->set($data);
        $this->twiggy->display("barcode_sheet");
        //$this->load->view("barcode_sheet", $data);
    }

    function bulk_edit() {
        $data = array();
        
        $suppliers = array('' => $this->lang->line('items_none'));
        foreach ($this->Supplier->get_all(100,0) as $row) {
            $suppliers[$row['person_id']] = $row['company_name'] . ' (' . $row['first_name'] . ' ' . $row['last_name'] . ')';
        }
        $data['suppliers'] = $suppliers;
        $data['allow_alt_desciption_choices'] = array(
            '' => $this->lang->line('items_do_nothing'),
            1 => $this->lang->line('items_change_all_to_allow_alt_desc'),
            0 => $this->lang->line('items_change_all_to_not_allow_allow_desc'));

        $data['serialization_choices'] = array(
            '' => $this->lang->line('items_do_nothing'),
            1 => $this->lang->line('items_change_all_to_serialized'),
            0 => $this->lang->line('items_change_all_to_unserialized'));
        
        $this->twiggy->set($data);
        $this->twiggy->display("items/form_bulk");
    }

    function save_clasifica($item_id = -1, $almacen_id = -1) {
        if ($item_id == -1) {
            echo json_encode(array('success' => false, 'messaje' => 'Debe guardar primero el item'));
            return;
        }

        $id_talla = $this->input->post('id_talla');
        $id_color = $this->input->post('id_color');

        if ($id_color == "" || $id_talla == "") {
            echo json_encode(array('success' => false, 'message' => 'Error de configuración, comuníquese con el Administrador'));
            return;
        }

        $tallas_ids = $this->input->post('talla_id');
        $tallas_nombres = $this->input->post('talla_nombre');
        $tallas_cantidades = $this->input->post('talla_cantidad');

        $colores_ids = $this->input->post('color_id');
        $colores_nombres = $this->input->post('color_nombre');
        $colores_valores = $this->input->post('color_valor');
        $colores_cantidades = $this->input->post('color_cantidad');

        //$total_cantidad = $this->Item->count($item_id);
        $total_cantidad = $this->Item->get_item_stock($item_id);
        $suma_talla = array_sum($tallas_cantidades);
        //$suma_color = array_sum($colores_cantidades);

        $cllItemTalla = array();
        
        $data['item_id'] = $item_id;
        foreach ($tallas_nombres as $index => $nombre) {
            if ($nombre == "")
                continue;
            if ($suma_talla > $total_cantidad) {
                echo json_encode(array('success' => false, 'message' => "Las cantidades no coinciden con el stock. En el stock acumulado existen $total_cantidad items, por lo que la sumatoria de tallas ($suma_talla) ingresadas sobrepasa ese valor"));
                return;
            }

            $id = $tallas_ids[$index];
            $data['item_category_id'] = $id == "" ? "" : $id;
            $data['category_id'] = $id_talla;
            $data['name'] = $nombre;
            $data['quantity'] = $tallas_cantidades[$index];

            $result = $this->Item_Clasifica->Save($data, $id);
            $cllItemTalla[] = $data['item_category_id'];
        }
        //var_dump($cllItemTalla);
        $this->Item_Clasifica->delete_not($cllItemTalla);
//        foreach ($colores_nombres as $index => $nombre) {
//            if ($nombre == "")
//                continue;
//            if ($suma_color > $total_cantidad) {
//                echo json_encode(array('success' => false, 'message' => "Las cantidades no coinciden con el stock. En el stock acumulado existen $total_cantidad items, por lo que la sumatoria de colores ($suma_color) ingresadas sobrepasa ese valor"));
//                return;
//            }
//            $id = $colores_ids[$index];
//            $data['category_id'] = $id_color;
//            $data['name'] = $nombre;
//            $data['extra'] = $colores_valores[$index];
//            $data['quantity'] = $colores_cantidades[$index];
//            $this->Item_Clasifica->Save($data);
//        }
        echo json_encode(array('success' => true,'message'=>'Se ha ingresado satisfactoriamente la sección'));
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

    function bulk_update() {
        $items_to_update = $this->input->post('item_ids');
        $item_data = array();

        foreach ($_POST as $key => $value) {
            //This field is nullable, so treat it differently
            if ($key == 'supplier_id') {
                $item_data["$key"] = $value == '' ? null : $value;
            } elseif ($value != '' and ! (in_array($key, array('item_ids', 'tax_names', 'tax_percents')))) {
                $item_data["$key"] = $value;
            }
        }

        //Item data could be empty if tax information is being updated
        if (empty($item_data) || $this->Item->update_multiple($item_data, $items_to_update)) {
            $items_taxes_data = array();
            $tax_names = $this->input->post('tax_names');
            $tax_percents = $this->input->post('tax_percents');
            for ($k = 0; $k < count($tax_percents); $k++) {
                if (is_numeric($tax_percents[$k])) {
                    $items_taxes_data[] = array('name' => $tax_names[$k], 'percent' => $tax_percents[$k]);
                }
            }
            $this->Item_taxes->save_multiple($items_taxes_data, $items_to_update);

            echo json_encode(array('success' => true, 'message' => $this->lang->line('items_successful_bulk_edit')));
        } else {
            echo json_encode(array('success' => false, 'message' => $this->lang->line('items_error_updating_multiple')));
        }
    }

    function delete() {
        $items_to_delete = $this->input->post('ids');

        if ($this->Item->delete_list($items_to_delete)) {
            echo json_encode(array('success' => true, 'message' => $this->lang->line('items_successful_deleted') . ' ' .
                count($items_to_delete) . ' ' . $this->lang->line('items_one_or_multiple')));
        } else {
            echo json_encode(array('success' => false, 'message' => $this->lang->line('items_cannot_be_deleted')));
        }
    }

    /**
     * Display form: Import data from an excel file
     * @author: Nguyen OJB
     * @since: 10.1
     */
    function excel_import() {
        $this->twiggy->display("items/excel_import");
    }

    /**
     * Read data from excel file -> save it to databse
     * @author: Nguyen OJB
     * @since: 10.1
     */
    function do_excel_import() {
        $msg = "do_excel_import";
        $failCodes = null;
        $successCode = null;
        if ($_FILES['file_path']['error'] != UPLOAD_ERR_OK) {
            $msg = $this->lang->line('items_excel_import_failed');
            echo json_encode(array('success' => false, 'message' => $msg));
            return;
        } else {
            try {
                $this->load->library('spreadsheetexcelreader');
                $this->spreadsheetexcelreader->store_extended_info = false;
                $success = $this->spreadsheetexcelreader->read($_FILES['file_path']['tmp_name']);
                $rowCount = $this->spreadsheetexcelreader->rowcount(0);
                if ($rowCount > 2) {
                    for ($i = 3; $i <= $rowCount; $i++) {
                        $item_code = $this->spreadsheetexcelreader->val($i, 'A');
                        $item_id = $this->Item->get_item_id($item_code);                        
                        $item_data = array(
                            'item_number' => $this->spreadsheetexcelreader->val($i, 'A'),
                            'name'        => $this->spreadsheetexcelreader->val($i, 'B'),
                            'category'    => $this->spreadsheetexcelreader->val($i, 'C'),
                            'brand'       => $this->spreadsheetexcelreader->val($i, 'D'),
                            'tags'        => $this->spreadsheetexcelreader->val($i, 'E'),
                            'color'       => $this->spreadsheetexcelreader->val($i, 'F'),
                            'size'        => $this->spreadsheetexcelreader->val($i, 'G'),
                            'supplier_id' => $this->spreadsheetexcelreader->val($i, 'H')==""?null:$this->spreadsheetexcelreader->val($i, 'H'),
                            'cost_price'  => $this->spreadsheetexcelreader->val($i, 'I'),
                            'unit_price'  => $this->spreadsheetexcelreader->val($i, 'J'),
                            'quantity'    => $this->spreadsheetexcelreader->val($i, 'M'),
                            'reorder_level' => $this->spreadsheetexcelreader->val($i, 'N'),
                            'description' => $this->spreadsheetexcelreader->val($i, 'O')
                        );
//                        var_dump($item_data);
//                        die();
                        if ($this->Item->save($item_data, $item_id)) {
                            $items_taxes_data = null;
                            $item_id = $this->Item->get_item_id($item_code);
                            //tax 1
                            if (is_numeric($this->spreadsheetexcelreader->val($i, 'K'))) {
                                $items_taxes_data[] = array('name' => line('items_sales_tax_1'), 'percent' => $this->spreadsheetexcelreader->val($i, 'K'));
                            }

                            //taxt 2
                            if (is_numeric($this->spreadsheetexcelreader->val($i, 'L'))) {
                                $items_taxes_data[] = array('name' => line('items_sales_tax_2'), 'percent' => $this->spreadsheetexcelreader->val($i, 'L'));
                            }

                            // save tax values
                            if (count($items_taxes_data) > 0) {
                                $this->Item_taxes->save($items_taxes_data, $item_id);
                            }
                            $successCode[] = $item_code;

                            //Ramel Inventory Tracking
                            //update Inventory count details from Excel Import
                            $item_code = $this->spreadsheetexcelreader->val($i, 'A');
                            // $item_id = $this->Item->get_item_id($item_code);
                            $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
                            $emp_info = $this->Employee->get_info($employee_id);
                            $comment = line("inv_import_comment");
                            $excel_data = array
                                (
                                'trans_items' => $item_id,
                                'trans_user' => $employee_id,
                                'trans_comment' => $comment,
                                'trans_inventory' => $this->spreadsheetexcelreader->val($i, 'I')
                            );
                            $this->db->insert('inventory', $excel_data);
                            //------------------------------------------------Ramel
                        } else {//insert or update item failure
                            $failCodes[] = $item_code;
                        }
                    }
                } else {
                    // rowCount < 2
                    echo json_encode(array('success' => true, 'message' => line("items_import_fail")));
                    return;
                }
            } catch (Exception $e) {
                //echo 'Caught exception: ',  $e->getMessage(), "\n";
                // echo json_encode( array('success'=>false,'message'=>$e->getMessage()) );
                echo json_encode(array('success' => false, 'message' => line("error_unknown")));
            }
        }

        $success = true;
        if (count($failCodes) > 1) {
            $error_msg = implode(", ", $failCodes);
            $total_errors = count($failCodes);
            $msg = line('items_import_errors');
            //$msg = "Most items imported. But some were not, here is list of their CODE ( $total_errors ): $error_msg";
            $success = false;
        } else {
            $msg = line('items_import_success');
        }

        echo json_encode(array('success' => $success, 'message' => $msg));
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
