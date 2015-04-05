<?php

require_once ("secure_area.php");

class Receivings extends Secure_area {

    function __construct() {
        parent::__construct('receivings');
        $this->load->library('receiving_lib');
    }

    function index() {
        $this->_reload();
    }

    function item_search() {
        $suggestions = $this->Item->get_item_search_suggestions($this->input->post('q'), $this->input->post('limit'));
//		echo implode("\n",$suggestions);
        echo json_encode($suggestions);
    }

    function supplier_search() {
        $suggestions = $this->Supplier->get_suppliers_search_suggestions($this->input->post('q'), $this->input->post('limit'));
        echo implode("\n", $suggestions);
    }

    function select_supplier() {
        $supplier_id = $this->input->post("supplier");
        $this->receiving_lib->set_supplier($supplier_id);
        $this->_reload();
    }

    function change_mode() {
        $mode = $this->input->post("mode");
        $this->receiving_lib->set_mode($mode);
        $this->_reload();
    }

    function change_almacen() {
        $almacen = $this->input->post("almacen");
        $this->receiving_lib->set_almacen($almacen);
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
        $payment_id = $this->input->post('amount_tendered');
        //if(!$this->sale_lib->add_payment($payment_type['payment_id'],$payment_amount, $this->Payment->get_info($payment_type['payment_id'])->payment_type))
        // if(!$this->receiving_lib->add_payment($payment_type['payment_id'],$payment_amount, $this->Payment->get_info($payment_type['payment_id'])->payment_type))
        if (!$this->receiving_lib->add_payment($payment_type, $payment_amount, $this->Payment->get_info($payment_type)->payment_type)) {
            $data['error'] = 'Unable to Add Payment! Please try again!';
        }
        $this->_reload($data);
    }

    //Alain Multiple Payments
    function delete_payment($payment_id) {
        $this->receiving_lib->delete_payment($payment_id);
        $this->_reload();
    }

    function add() {
        $data = array();
        $mode = $this->receiving_lib->get_mode();
        $item_id_or_number_or_receipt = $this->input->post("item");
        $quantity = $mode == "receive" ? 1 : -1;

        if ($this->receiving_lib->is_valid_receipt($item_id_or_number_or_receipt) && $mode == 'return') {
            $this->receiving_lib->return_entire_receiving($item_id_or_number_or_receipt);
        } elseif (!$this->receiving_lib->add_item($item_id_or_number_or_receipt, $quantity)) {
            $data['error'] = $this->lang->line('recvs_unable_to_add_item');
        }
        $this->_reload($data);
    }

    function edit_item($item_id) {
        $data = array();

        $this->form_validation->set_rules('price', 'lang:items_price', 'required|numeric');
        $this->form_validation->set_rules('quantity', 'lang:items_quantity', 'required|integer');
        $this->form_validation->set_rules('discount', 'lang:items_discount', 'required|integer');


        $description = $this->input->post("description");
        $serialnumber = $this->input->post("serialnumber");
        $price = $this->input->post("price");
        $quantity = $this->input->post("quantity");
        $discount = $this->input->post("discount");


        if ($this->form_validation->run() != FALSE) {
            $this->receiving_lib->edit_item($item_id, $description, $serialnumber, $quantity, $discount, $price);
        } else {
            $data['error'] = $this->lang->line('recvs_error_editing_item');
        }

        $this->_reload($data);
    }

    function delete_item($item_number) {
        $this->receiving_lib->delete_item($item_number);
        $this->_reload();
    }

    function delete_supplier() {
        $this->receiving_lib->delete_supplier();
        $this->_reload();
    }

    function complete() {
        $data['cart'] = $this->receiving_lib->get_cart();
        $data['subtotal'] = $this->receiving_lib->get_subtotal();
        $data['taxes'] = $this->receiving_lib->get_taxes();
        $data['total'] = $this->receiving_lib->get_total();

        //Almacen
        $data['almacen_id'] = $this->receiving_lib->get_almacen() != -1 ? $this->receiving_lib->get_almacen() : $this->Almacen->get_first()->almacen_id;

        $data['receipt_title'] = $this->lang->line('recvs_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a');
        $supplier_id = $this->receiving_lib->get_supplier();
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
        $comment = $this->input->post('comment');
        $emp_info = $this->Employee->get_info($employee_id);
        $payment_type = $this->input->post('payment_type');
        $data['payment_type'] = $this->input->post('payment_type');
        //Alain Multiple payments
        $data['payments'] = $this->receiving_lib->get_payments();
        $data['amount_change'] = to_currency($this->receiving_lib->get_amount_due() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;
        $data['amount_tendered'] = to_currency($this->receiving_lib->get_payments_total());
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;

        if ($supplier_id != -1) {
            $suppl_info = $this->Supplier->get_info($supplier_id);
            $data['supplier'] = $suppl_info->first_name . ' ' . $suppl_info->last_name;
        }

        //yo
        $total_payments = 0;
        foreach ($data['payments'] as $payment) {
            $total_payments += $payment['payment_amount'];
        }

        if (( $this->receiving_lib->get_mode() == 'receive' ) && ( ( to_currency_no_money($data['total']) - $total_payments ) > 1e-6 )) {
            $data['error'] = $this->lang->line('sales_payment_not_cover_total');
            $this->_reload($data);
            return false;
        }

        //SAVE receiving to database
        $data['receiving_id'] = 'RECV ' . $this->Receiving->save($data['cart'], $supplier_id, $employee_id, $comment, $data['payments'], false, $data);

        if ($data['receiving_id'] == 'RECV -1') {
            $data['error_message'] = $this->lang->line('receivings_transaction_failed');
        }

        $this->load->view("receivings/receipt", $data);
        $this->receiving_lib->clear_all();
    }

    function receipt($receiving_id) {
        $receiving_info = $this->Receiving->get_info($receiving_id)->row_array();
        $this->receiving_lib->copy_entire_receiving($receiving_id);
        $data['cart'] = $this->receiving_lib->get_cart();
        $data['payments'] = $this->receiving_lib->get_payments();
        $data['total'] = $this->receiving_lib->get_total();
        $data['receipt_title'] = $this->lang->line('recvs_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a', strtotime($receiving_info['receiving_time']));
        $supplier_id = $this->receiving_lib->get_supplier();
        $emp_info = $this->Employee->get_info($receiving_info['employee_id']);
        $data['payment_type'] = $receiving_info['payment_type'];
        $data['amount_change'] = to_currency($this->receiving_lib->get_amount_due() * -1);
        $data['amount_tendered'] = to_currency($this->receiving_lib->get_payments_total() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;

        if ($supplier_id != -1) {
            $supplier_info = $this->Supplier->get_info($supplier_id);
            $data['supplier'] = $supplier_info->first_name . ' ' . $supplier_info->last_name;
        }
        $data['receiving_id'] = 'RECV ' . $receiving_id;
        $this->receiving_lib->clear_all();
//		$this->load->view("receivings/receipt",$data);
        $this->twiggy->set($data);
        $this->twiggy->display("receivings/receipt");
    }

    function _reload($data = array()) {
        $person_info = $this->Employee->get_logged_in_employee_info();
        $data['cart'] = $this->receiving_lib->get_cart();
        $data['modes'] = array('receive' => $this->lang->line('recvs_receiving'), 'return' => $this->lang->line('recvs_return'));
        $data['mode'] = $this->receiving_lib->get_mode();

        $data['almacenes'] = $this->Almacen->get_all_id();
        $data['almacen'] = $this->receiving_lib->get_almacen();

        $data['subtotal'] = $this->receiving_lib->get_subtotal();
        $data['taxes'] = $this->receiving_lib->get_taxes();
        $data['total'] = $this->receiving_lib->get_total();
        $data['items_module_allowed'] = $this->Employee->has_permission('items', $person_info->person_id);
        $data['payments'] = $this->receiving_lib->get_payments();
        $data['amount_tendered'] = $this->receiving_lib->get_payments_total();
        $data['amount_due'] = $this->receiving_lib->get_amount_due();
        $payments_row = array();
        foreach ($this->Payment->get_all()->result() as $row) {
            $payments_row[$row->payment_id] = $row->payment_type;
        }
        $data['payment_options'] = $payments_row;
        /* $data['payment_options']=array(
          $this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
          $this->lang->line('sales_check') => $this->lang->line('sales_check'),
          $this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
          $this->lang->line('sales_credit') => $this->lang->line('sales_credit')
          ); */

        $supplier_id = $this->receiving_lib->get_supplier();
        if ($supplier_id != -1) {
            $info = $this->Supplier->get_info($supplier_id);
            $data['supplier'] = $info->first_name . ' ' . $info->last_name;
        }
//		$this->load->view("receivings/receiving",$data);
        $this->twiggy->set($data);
        $this->twiggy->display("receivings/receiving");
    }

    function cancel_receiving() {
        //$this->load->view("receivings/receipt",$data);
        $this->receiving_lib->clear_all();
        $this->_reload();
    }

    //Reporte
    function por_pagar($receiving_id, $debe, $payment_id) {

        $data = array();
        $data['debe'] = $debe;

        $data['suppliers'] = array('' => 'No Suppliers');
        foreach ($this->Supplier->get_all()->result() as $supplier) {
            $data['suppliers'][$supplier->person_id] = $supplier->company_name . '-' . $supplier->first_name . ' ' . $supplier->last_name;
        }

        $data['employees'] = array();
        foreach ($this->Employee->get_all()->result() as $employee) {
            $data['employees'][$employee->person_id] = $employee->first_name . ' ' . $employee->last_name;
        }

        $data['receiving_info'] = $this->Receiving->get_info($receiving_id)->row_array();
        $data['receiving_info']['payment_id'] = $payment_id;
        //tipos de pagos de abono.
        $data['payment_options'] = array(
            $this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
            $this->lang->line('sales_check') => $this->lang->line('sales_check'),
            $this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
            $this->lang->line('sales_credit') => $this->lang->line('sales_credit')
        );


        $this->load->view('receivings/porpagar', $data);
    }

}

?>