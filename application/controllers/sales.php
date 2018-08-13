<?php

require_once ("Secure_area.php");

class Sales extends Secure_area {

    function __construct() {
        parent::__construct('sales');
        $this->load->library('sale_lib');
    }

    function index() {
        $this->_reload();
    }

    function item_search() {
        $suggestions = $this->Item->get_item_search_suggestions($this->input->post('q'), $this->input->post('limit'));
        //echo implode("\n", $suggestions);
        echo json_encode($suggestions);
    }

    function customer_search() {
        $suggestions = $this->Customer->get_customer_search_suggestions($this->input->post('q'), $this->input->post('limit'));
        echo json_encode($suggestions);
        //echo implode("\n", $suggestions);
    }

    function select_customer() {
        $customer_id = $this->input->post("customer");
        $this->sale_lib->set_customer($customer_id);
        $this->_reload();
    }

    function change_mode() {
        $mode = $this->input->post("mode");
        $this->sale_lib->set_mode($mode);
        $this->_reload();
    }

    function change_almacen() {
        $almacen = $this->input->post("almacen");
        $this->sale_lib->set_almacen($almacen);
        $this->_reload();
    }

    //Alain Multiple Payments
    function add_payment() {
        $data = array();
        $this->form_validation->set_rules('amount_tendered', 'lang:sales_amount_tendered', 'numeric');
        //$this->form_validation->set_rules(array('field'=>'amount_tendered', 'label'=>'lang:sales_amount_tendered', 'rules'=>'numeric'));
        //$this->form_validation->set_error_delimiters('<div class="error">', '</div>');		
        $io = true;
        $io = $this->form_validation->run();
        if ($io == FALSE) {
            $data['error'] = $this->lang->line('sales_must_enter_numeric');
            $this->_reload($data);
            return;
        }
        //$data['warning']=$this->lang->line('sales_must_enter_numeric');

        $payment_type = $this->input->post('payment_type');
        $payment_amount = $this->input->post('amount_tendered');


        if (!$this->sale_lib->add_payment($payment_type, $payment_amount, $this->Payment->get_info($payment_type)->payment_type)) {
            $data['error'] = 'Unable to Add Payment! Please try again!';
        }
        $this->_reload($data);
    }

    //Alain Multiple Payments
    function delete_payment($payment_id) {
        $this->sale_lib->delete_payment($payment_id);
        $this->_reload();
    }

    function stock() {
        //return $this->sale_lib->out_of_stock($this->input->post("item");)
    }

    function add() {
        $data = array();
        $mode = $this->sale_lib->get_mode();
        // $almacen = $this->sale_lib->get_almacen();
        $selected_almacen = $this->Almacen->get_first();
        $almacen = $this->Almacen->get_info($this->sale_lib->get_almacen() != -1 ? $this->sale_lib->get_almacen() : $selected_almacen->almacen_id);

        $item_id_or_number_or_receipt = $this->input->post("item");
        $quantity = $mode == "sale" ? 1 : -1;
        //$stock = $data['stock'] = $this->sale_lib->get_stock($item_id_or_number_or_receipt);
        if ($this->sale_lib->is_valid_receipt($item_id_or_number_or_receipt) && $mode == 'return') {
            $this->sale_lib->return_entire_sale($item_id_or_number_or_receipt);
        } elseif (!$this->sale_lib->add_item($item_id_or_number_or_receipt, $quantity, 0, null, null, null, null, $almacen)) {
            $data['error'] = $this->lang->line('sales_unable_to_add_item');
        }

        if ($this->sale_lib->out_of_stock($item_id_or_number_or_receipt, $almacen)) {
            $data['warning'] = $this->lang->line('sales_quantity_less_than_zero');
        }
        //$data['almacen'] = (isset($this->Item->get_almacen($this->Item->get_item_id($item_id_or_number_or_receipt))->nombre))?$this->Item->get_almacen($this->Item->get_item_id($item_id_or_number_or_receipt))->nombre:"";

        $this->_reload($data);
    }

    function edit_item($line) {
        $data = array();

        $this->form_validation->set_rules('price', 'lang:items_price', 'required|numeric');
        $this->form_validation->set_rules('quantity', 'lang:items_quantity', 'required|numeric');

        $description = $this->input->post("description");
        $serialnumber = $this->input->post("serialnumber");
        $price = $this->input->post("price");
        $quantity = $this->input->post("quantity");
        $discount = $this->input->post("discount");


        if ($this->form_validation->run() != FALSE) {
            $this->sale_lib->edit_item($line, $description, $serialnumber, $quantity, $discount, $price);
        } else {
            $data['error'] = $this->lang->line('sales_error_editing_item');
        }
        $selected_almacen = $this->Almacen->get_first();
        $almacen = $this->Almacen->get_info($this->sale_lib->get_almacen() != -1 ? $this->sale_lib->get_almacen() : $selected_almacen->almacen_id);
        if ($this->sale_lib->out_of_stock($this->sale_lib->get_item_id($line), $almacen)) {
            $data['warning'] = $this->lang->line('sales_quantity_less_than_zero');
        }


        $this->_reload($data);
    }

    function delete_item($item_number) {
        $this->sale_lib->delete_item($item_number);
        $this->_reload();
    }

    function delete_customer() {
        $this->sale_lib->delete_customer();
        $this->_reload();
    }

    /**
     * Toma los datos del carrito de compra, completa la compra 
     * y genera la vista de impresion del comprobante de venta
     * @return 'sales/receipt.html.twig' Vista del comprobante de venta
     */
    function complete() {
        $data['cart'] = $this->sale_lib->get_cart();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['subtotal_without_disc'] = $this->sale_lib->get_subtotal_without_disc();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['discount'] = $this->sale_lib->get_total_discount();

        $selected_almacen = $this->Almacen->get_first();
        //Almacen
        $data['almacen_id'] = $this->sale_lib->get_almacen() != -1 ? $this->sale_lib->get_almacen() : $selected_almacen->almacen_id;
        // var_dump($data['almacen_id']);
        // ECHO $data['almacen_id'];DIE;

        $data['receipt_title'] = $this->lang->line('sales_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a');
        $customer_id = $this->sale_lib->get_customer();
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
        $comment = $this->input->post('comment');
        $emp_info = $this->Employee->get_info($employee_id);
        $payment_type = $this->input->post('payment_type');
        $data['payment_type'] = $this->input->post('payment_type');
        //Alain Multiple payments
        $data['payments'] = $this->sale_lib->get_payments();
        $data['amount_change'] = to_currency($this->sale_lib->get_amount_due() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;
        $data['print_after_sale'] = $this->Appconfig->get('print_after_sale');

        if ($customer_id != -1) {
            $cust_info = $this->Customer->get_info($customer_id);
            $data['customer'] = $cust_info->first_name . ' ' . $cust_info->last_name;
            $data['zip'] = $cust_info->zip;
            $data['address_1'] = $cust_info->address_1;
            $data['phone_number'] = $cust_info->phone_number;
        }

        $total_payments = 0;

        foreach ($data['payments'] as $payment) {
            $total_payments += $payment['payment_amount'];
        }

        $data['amount_tendered'] = to_currency($total_payments * -1);

        if (( $this->sale_lib->get_mode() == 'sale' ) && ( ( to_currency_no_money($data['total']) - $total_payments ) > 1e-6 )) {
            $data['error'] = $this->lang->line('sales_payment_not_cover_total');
            $this->_reload($data);
            return false;
        }

        //SAVE sale to database
        $data['sale_id'] = 'Vent ' . $this->Sale->save($data['cart'], $customer_id, $employee_id, $comment, $data['payments'], false, $data);
        if ($data['sale_id'] == 'Vent -1') {
            $data['error_message'] = $this->lang->line('sales_transaction_failed');
        }
        
        $this->twig->set($data);
        $this->sale_lib->clear_all();
        //$this->load->view("receivings/receipt", $data);
        //TODO: Must be on configuration
        $this->twig->display("sales/receipt_dongu");
    }

    function receipt($sale_id) {
        $sale_info = $this->Sale->get_info($sale_id)->row_array();
        $this->sale_lib->copy_entire_sale($sale_id);
        $data['cart'] = $this->sale_lib->get_cart();
        $data['payments'] = $this->sale_lib->get_payments();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['subtotal_without_disc'] = $this->sale_lib->get_subtotal_without_disc();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['receipt_title'] = $this->lang->line('sales_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a', strtotime($sale_info['sale_time']));
        $customer_id = $this->sale_lib->get_customer();
        $emp_info = $this->Employee->get_info($sale_info['employee_id']);
        $data['payment_type'] = $sale_info['payment_type'];
        $data['amount_change'] = to_currency($this->sale_lib->get_amount_due() * -1);
        $data['amount_tendered'] = to_currency($this->sale_lib->get_payments_total() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;
        $data['discount'] = $this->sale_lib->get_total_discount();

        if ($customer_id != -1) {
            $cust_info = $this->Customer->get_info($customer_id);
            $data['customer'] = $cust_info->first_name . ' ' . $cust_info->last_name;
            $data['zip'] = $cust_info->zip;
            $data['address_1'] = $cust_info->address_1;
            $data['phone_number'] = $cust_info->phone_number;
        }
        $data['sale_id'] = 'POS ' . $sale_id;
        $data['print_after_sale'] = $this->Appconfig->get('print_after_sale');
        $data['company'] = $this->config->item('company');
        $data['address'] = $this->config->item('address');
        $data['phone'] = $this->config->item('phone');
        $data['return_policy'] = $this->config->item('return_policy');
        
        
//        $this->load->view("sales/receipt", $data);
        $this->sale_lib->clear_all();
        $this->twig->set($data);
        //TODO: It has to be at configuration.
        $this->twig->display("sales/receipt_dongu");
    }

    function generate_electronic_document($sale_id) {
        $this->load->helper('MY_xml');
        $sale_info = $this->Sale->get_info($sale_id)->row_array();
        $this->sale_lib->copy_entire_sale($sale_id);
        $data['cart'] = $this->sale_lib->get_cart();

        $data['payments'] = $this->sale_lib->get_payments();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['receipt_title'] = $this->lang->line('sales_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a', strtotime($sale_info['sale_time']));
        $customer_id = $this->sale_lib->get_customer();
        $emp_info = $this->Employee->get_info($sale_info['employee_id']);
        $data['payment_type'] = $sale_info['payment_type'];
        $data['amount_change'] = to_currency($this->sale_lib->get_amount_due() * -1);
        $data['amount_tendered'] = to_currency($this->sale_lib->get_payments_total() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;

        if ($customer_id != -1) {
            $cust_info = $this->Customer->get_info($customer_id);
            $data['customer'] = $cust_info->first_name . ' ' . $cust_info->last_name;
        }else{
            $data['customer'] = "Consumidor Final";
            $cust_info = new stdClass();
            $cust_info->zip="1212121212";
        }
        $data['sale_id'] = 'POS ' . $sale_id;
        $data['print_after_sale'] = $this->Appconfig->get('print_after_sale');
        $data['company'] = $this->config->item('company');
        $data['identity'] = $this->config->item('identity');
        $data['address'] = $this->config->item('address');
        $data['phone'] = $this->config->item('phone');
        $data['return_policy'] = $this->config->item('return_policy');
        $discount = $this->sale_lib->get_total_discount();
        $base_imponible = $this->sale_lib->get_total_imponible();
        $importe_total = $this->sale_lib->get_total_taxes();

        $this->sale_lib->clear_all();
        $dom = xml_dom();
        $factura = xml_add_child($dom, 'factura');
        xml_add_attribute($factura, 'id', 'comprobante');
        xml_add_attribute($factura, 'version', '2.0.0');
        $info_tributaria = xml_add_child($factura, 'infoTributaria');
        xml_add_child($info_tributaria, 'ambiente', '1');
        xml_add_child($info_tributaria, 'timpo_emision', '1');
        xml_add_child($info_tributaria, 'razonSocial', $data['company']);
        xml_add_child($info_tributaria, 'ruc', $data['identity']);
        xml_add_child($info_tributaria, 'claveAcceso', '2010ABSALON');
        xml_add_child($info_tributaria, 'codDoc', '01');
        xml_add_child($info_tributaria, 'estab', '01');
        xml_add_child($info_tributaria, 'ptoEmi', '01');
        xml_add_child($info_tributaria, 'secuencial', $sale_id);
        xml_add_child($info_tributaria, 'dirMatriz', $data['address']);
        $info_tributaria = xml_add_child($factura, 'infoFactura');
        xml_add_child($info_tributaria, 'fechaEmision', '1');
        xml_add_child($info_tributaria, 'tipoIdentificacionComprador', '1');
        xml_add_child($info_tributaria, 'razonSocialComprador', $data['customer']);
        xml_add_child($info_tributaria, 'identificacionComprador', $cust_info->zip);
        xml_add_child($info_tributaria, 'totalSinImpuestos', $data['subtotal']);
        xml_add_child($info_tributaria, 'totalDescuento', $discount);
        $total_con_impuestos = xml_add_child($info_tributaria, 'totalConImpuestos');
        $total_impuesto = xml_add_child($total_con_impuestos, 'totalImpuesto');
        xml_add_child($total_impuesto, 'codigo', '2');
        xml_add_child($total_impuesto, 'codigoPorcentaje', '2');
        xml_add_child($total_impuesto, 'baseImponible', $base_imponible);
        xml_add_child($total_impuesto, 'valor', $importe_total);
        xml_add_child($info_tributaria, 'propina', '0.00');
        xml_add_child($info_tributaria, 'importeTotal', $data['total']);
        xml_add_child($info_tributaria, 'moneda', "DOLAR");
        //Detalles
        $detalles = xml_add_child($factura, 'detalles');
        foreach($data['cart'] as $cart){
            $detalle = xml_add_child($detalles, 'detalle');
            xml_add_child($detalle, 'codigoPrincipal', $cart['item_id']);
            if($cart['item_number'])
                xml_add_child($detalle, 'codigoAuxiliar', $cart['item_number']);
            xml_add_child($detalle, 'descripcion', $cart['name']);
            xml_add_child($detalle, 'cantidad', $cart['quantity']);
            xml_add_child($detalle, 'precioUnitario', $cart['price']);
            xml_add_child($detalle, 'descuento', $cart['price']*$cart['quantity']*$cart['discount']/100);
            xml_add_child($detalle, 'precioTotalSinImpuesto', ($cart['price']*$cart['quantity']-$cart['price']*$cart['quantity']*$cart['discount']/100));
            $cll_taxes = $this->sale_lib->get_taxes_item($cart);
            foreach($cll_taxes as $tax){   
                $impuestos = xml_add_child($detalle, 'impuestos');
                $impuesto = xml_add_child($impuestos, 'impuesto');
                //IVA 2, ICE 3, IRBPNR 5
                xml_add_child($impuesto, 'codigo', '2');
                //0 0, 12 2, 14 3, no objeto de impuesto 6, exento iva 7
                xml_add_child($impuesto, 'codigoPorcentaje', '2');
                xml_add_child($impuesto, 'tarifa', '12');
                xml_add_child($impuesto, 'baseImponible', to_currency_no_money($cart['price']*$cart['quantity']-$cart['price']*$cart['quantity']*$cart['discount']/100));
                xml_add_child($impuesto, 'valor', to_currency_no_money($tax));
            }
            
        }

        xml_print($dom);
        $this->twig->set($data);

        //$this->twig->display("sales/receipt");
    }

    function edit($sale_id) {
        $data = array();

        $data['customers'] = array('' => 'No Customer');
//		foreach ($this->Customer->get_all()->result() as $customer)
        foreach ($this->Customer->get_all(100, 0) as $customer) {
            $data['customers'][$customer['person_id']] = $customer['first_name'] . ' ' . $customer['last_name'];
        }

        $data['employees'] = array();
        foreach ($this->Employee->get_all() as $employee) {
            $data['employees'][$employee['person_id']] = $employee['first_name'] . ' ' . $employee['last_name'];
        }

        $data['sale_info'] = $this->Sale->get_info($sale_id)->row_array();

        $this->twig->set($data);
        $this->twig->display("sales/edit");
//		$this->load->view('sales/edit', $data);
    }

    function por_cobrar($sale_id, $debe, $payment_id) {

        $data = array();
        $data['debe'] = $debe;

        $data['customers'] = array('' => 'No Customer');
        foreach ($this->Customer->get_all()->result() as $customer) {
            $data['customers'][$customer->person_id] = $customer->first_name . ' ' . $customer->last_name;
        }

        $data['employees'] = array();
        foreach ($this->Employee->get_all()->result() as $employee) {
            $data['employees'][$employee->person_id] = $employee->first_name . ' ' . $employee->last_name;
        }

        $data['sale_info'] = $this->Sale->get_info($sale_id)->row_array();
        $data['sale_info']['payment_id'] = $payment_id;
        //tipos de pagos de abono.
        $data['payment_options'] = array(
            $this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
            $this->lang->line('sales_check') => $this->lang->line('sales_check'),
            $this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
            $this->lang->line('sales_credit') => $this->lang->line('sales_credit')
        );


        $this->load->view('sales/por_cobrar', $data);
    }

    function delete($sale_id) {
        $data = array();

        if ($this->Sale->delete($sale_id)) {
            $data['success'] = true;
        } else {
            $data['success'] = false;
        }

        $this->load->view('sales/delete', $data);
    }

    function save($sale_id) {
        $sale_data = array(
            'sale_time' => date('Y-m-d', strtotime($this->input->post('date'))),
            'customer_id' => $this->input->post('customer_id') ? $this->input->post('customer_id') : null,
            'employee_id' => $this->input->post('employee_id'),
            'comment' => $this->input->post('comment')
        );

        if ($this->Sale->update($sale_data, $sale_id)) {
            echo json_encode(array('success' => true, 'message' => $this->lang->line('sales_successfully_updated')));
        } else {
            echo json_encode(array('success' => false, 'message' => $this->lang->line('sales_unsuccessfully_updated')));
        }
    }

    function _reload($data = array()) {
        $person_info = $this->Employee->get_logged_in_employee_info();
        $data['cart'] = $this->sale_lib->get_cart();
        $data['modes'] = array('sale' => $this->lang->line('sales_sale'), 'return' => $this->lang->line('sales_return'));
        $data['mode'] = $this->sale_lib->get_mode();
        $data['almacenes'] = $this->Almacen->get_all_id();
        $data['almacen'] = $this->sale_lib->get_almacen();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['items_module_allowed'] = $this->Employee->has_permission('items', $person_info->person_id);
        //Alain Multiple Payments
        $data['payments_total'] = $this->sale_lib->get_payments_total();
        $data['amount_due'] = $this->sale_lib->get_amount_due();
        $data['payments'] = $this->sale_lib->get_payments();

        $payments_row = array();
        foreach ($this->Payment->get_all() as $row) {
            $payments_row[$row['payment_id']] = $row['payment_type'];
        }
        $data['payment_options'] = $payments_row;

        /* $data['payment_options']=array(
          $this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
          $this->lang->line('sales_check') => $this->lang->line('sales_check'),
          $this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
          $this->lang->line('sales_credit') => $this->lang->line('sales_credit')
          ); */

        $customer_id = $this->sale_lib->get_customer();
        if ($customer_id != -1) {
            $info = $this->Customer->get_info($customer_id);
            $data['customer'] = $info->first_name . ' ' . $info->last_name;
        }

        //Si ya se ha cerrado la caja.
        if ($this->Box->ya_cerrado())
            $data['error'] = $this->lang->line('boxes_close_sale');
//        $this->load->view("sales/register", $data);
        $this->twig->set($data);
        $this->twig->display("sales/register");
    }

    function cancel_sale() {
        $this->sale_lib->clear_all();
        $this->_reload();
    }

    function suspend() {
        $data['cart'] = $this->sale_lib->get_cart();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['receipt_title'] = $this->lang->line('sales_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a');
        $customer_id = $this->sale_lib->get_customer();
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
        $comment = $this->input->post('comment');
        $emp_info = $this->Employee->get_info($employee_id);
        $payment_type = $this->input->post('payment_type');
        $data['payment_id'] = $this->input->post('payment_id');
        //Alain Multiple payments
        $data['payments'] = $this->sale_lib->get_payments();
        $data['amount_change'] = to_currency($this->sale_lib->get_amount_due() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;

        if ($customer_id != -1) {
            $cust_info = $this->Customer->get_info($customer_id);
            $data['customer'] = $cust_info->first_name . ' ' . $cust_info->last_name;
        }

        $total_payments = 0;

        foreach ($data['payments'] as $payment) {
            $total_payments += $payment['payment_amount'];
        }

        //SAVE sale to database
        $data['sale_id'] = 'POS ' . $this->Sale_suspended->save($data['cart'], $customer_id, $employee_id, $comment, $data['payments']);
        if ($data['sale_id'] == 'POS -1') {
            $data['error_message'] = $this->lang->line('sales_transaction_failed');
        }
        $this->sale_lib->clear_all();
        $this->_reload(array('success' => $this->lang->line('sales_successfully_suspended_sale')));
    }

    function suspended() {
        $data = array();
        $data['suspended_sales'] = $this->Sale_suspended->get_all()->result_array();
        $this->load->view('sales/suspended', $data);
    }

    function unsuspend() {
        $sale_id = $this->input->post('suspended_sale_id');
        $this->sale_lib->clear_all();
        $this->sale_lib->copy_entire_suspended_sale($sale_id);
        $this->Sale_suspended->delete($sale_id);
        $this->_reload();
    }

}
