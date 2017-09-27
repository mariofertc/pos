<?php
require_once ("Secure_area.php");
//require_once ("interfaces/iData_controller.php");
class Abonos extends Secure_area
{
	function __construct()
	{
		parent::__construct('abonos');
		$this->Sale->create_sales_items_temp_table();
		//$this->load->library('sale_lib');
	}

	function index()
	{
		//$this->_reload();
		// $this->output->enable_profiler(TRUE);
		$data['controller_name']=strtolower($this->uri->segment(1));
		$data['form_width']=$this->get_form_width();
		$data['manage_table']=get_abono_manage_table($this->Abono->get_all(),$this);
		$this->load->view('abonos/manage',$data);
	}

	function item_search()
	{
		$suggestions = $this->Item->get_item_search_suggestions($this->input->post('q'),$this->input->post('limit'));
		echo implode("\n",$suggestions);
	}

	function customer_search()
	{
		$suggestions = $this->Customer->get_customer_search_suggestions($this->input->post('q'),$this->input->post('limit'));
		echo implode("\n",$suggestions);
	}

	function select_customer()
	{
		$customer_id = $this->input->post("customer");
		$this->sale_lib->set_customer($customer_id);
		$this->_reload();
	}

	function change_mode()
	{
		$mode = $this->input->post("mode");
		$this->sale_lib->set_mode($mode);
		$this->_reload();
	}

	//Alain Multiple Payments
	function add_payment()
	{		
		$data=array();
		$this->form_validation->set_rules('amount_tendered', 'lang:sales_amount_tendered', 'numeric');
		//$this->form_validation->set_rules(array('field'=>'amount_tendered', 'label'=>'lang:sales_amount_tendered', 'rules'=>'numeric'));
		//$this->form_validation->set_error_delimiters('<div class="error">', '</div>');		
		$io = true;
		$io = $this->form_validation->run();
		if($io == FALSE)
		{
			$data['error']=$this->lang->line('sales_must_enter_numeric');
 			$this->_reload($data);
 			return;
		}
		//$data['warning']=$this->lang->line('sales_must_enter_numeric');
		
		$payment_type=$this->input->post('payment_type');
		$payment_amount=$this->input->post('amount_tendered');
		if(!$this->sale_lib->add_payment($payment_type['payment_id'],$payment_amount, $this->Payment->get_info($payment_type['payment_id'])->payment_type))
		{
			$data['error']='Unable to Add Payment! Please try again!';
		}
		$this->_reload($data);
	}

	//Alain Multiple Payments
	function delete_payment($payment_id)
	{
		$this->sale_lib->delete_payment($payment_id);
		$this->_reload();
	}

	function stock()
	{
		//return $this->sale_lib->out_of_stock($this->input->post("item");)
	}
	
	function pay_details($sale_id=-1)
	{
		$query = $this->Abono->get_abonos($sale_id);
		$data['controller_name']=get_pay_detail_manage_table($query,$this);
		$tot_pagado = 0;
		foreach($query->result() as $datos)
		{
		 $tot_pagado += $datos->abono_amount;
		}
		$data['tot_pagado']= $tot_pagado;
		$this->load->view("abonos/pay_details",$data);
	} 	
	
	function find_abonos_info()
	{
		$sale_number=$this->input->post('scan_item_number');
		echo json_encode($this->Abono->find_abonos_info($item_number));
	}
	
	function add()
	{
		$data=array();
		$mode = $this->sale_lib->get_mode();
		$item_id_or_number_or_receipt = $this->input->post("item");
		$quantity = $mode=="sale" ? 1:-1;
		//$stock = $data['stock'] = $this->sale_lib->get_stock($item_id_or_number_or_receipt);
		if($this->sale_lib->is_valid_receipt($item_id_or_number_or_receipt) && $mode=='return')
		{
			$this->sale_lib->return_entire_sale($item_id_or_number_or_receipt);
		}
		elseif(!$this->sale_lib->add_item($item_id_or_number_or_receipt,$quantity))
		{
			$data['error']=$this->lang->line('sales_unable_to_add_item');
		}
		
		if($this->sale_lib->out_of_stock($item_id_or_number_or_receipt))
		{
			$data['warning'] = $this->lang->line('sales_quantity_less_than_zero');
		}
		$this->_reload($data);
	}

	function edit_item($line)
	{
		$data= array();

		$this->form_validation->set_rules('price', 'lang:items_price', 'required|numeric');
		$this->form_validation->set_rules('quantity', 'lang:items_quantity', 'required|numeric');

        $description = $this->input->post("description");
        $serialnumber = $this->input->post("serialnumber");
		$price = $this->input->post("price");
		$quantity = $this->input->post("quantity");
		$discount = $this->input->post("discount");


		if ($this->form_validation->run() != FALSE)
		{
			$this->sale_lib->edit_item($line,$description,$serialnumber,$quantity,$discount,$price);
		}
		else
		{
			$data['error']=$this->lang->line('sales_error_editing_item');
		}
		
		if($this->sale_lib->out_of_stock($this->sale_lib->get_item_id($line)))
		{
			$data['warning'] = $this->lang->line('sales_quantity_less_than_zero');
		}


		$this->_reload($data);
	}

	function delete_item($item_number)
	{
		$this->sale_lib->delete_item($item_number);
		$this->_reload();
	}

	function delete_customer()
	{
		$this->sale_lib->delete_customer();
		$this->_reload();
	}

	function complete()
	{
		$data['cart']=$this->sale_lib->get_cart();
		$data['subtotal']=$this->sale_lib->get_subtotal();
		$data['taxes']=$this->sale_lib->get_taxes();
		$data['total']=$this->sale_lib->get_total();
		$data['receipt_title']=$this->lang->line('sales_receipt');
		$data['transaction_time']= date('m/d/Y h:i:s a');
		$customer_id=$this->sale_lib->get_customer();
		$employee_id=$this->Employee->get_logged_in_employee_info()->person_id;
		$comment = $this->input->post('comment');
		$emp_info=$this->Employee->get_info($employee_id);
		$payment_type = $this->input->post('payment_type');
		$data['payment_type']=$this->input->post('payment_type');
		//Alain Multiple payments
		$data['payments']=$this->sale_lib->get_payments();
		$data['amount_change']=to_currency($this->sale_lib->get_amount_due() * -1);
		$data['employee']=$emp_info->first_name.' '.$emp_info->last_name;

		if($customer_id!=-1)
		{
			$cust_info=$this->Customer->get_info($customer_id);
			$data['customer']=$cust_info->first_name.' '.$cust_info->last_name;
		}

		$total_payments = 0;

		foreach($data['payments'] as $payment)
		{
			$total_payments += $payment['payment_amount'];
		}

		if ( ( $this->sale_lib->get_mode() == 'sale' ) && ( ( to_currency_no_money( $data['total'] ) - $total_payments ) > 1e-6 ) )
		{
			$data['error'] = $this->lang->line('sales_payment_not_cover_total');
			$this->_reload($data);
			return false;
		}

		//SAVE sale to database
		$data['sale_id']='Vent '.$this->Sale->save($data['cart'], $customer_id,$employee_id,$comment,$data['payments']);
		if ($data['sale_id'] == 'Vent -1')
		{
			$data['error_message'] = $this->lang->line('sales_transaction_failed');
		}
		$this->load->view("sales/receipt",$data);
		$this->sale_lib->clear_all();
	}

	function receipt($sale_id)
	{
		$sale_info = $this->Sale->get_info($sale_id)->row_array();
		$this->sale_lib->copy_entire_sale($sale_id);
		$data['cart']=$this->sale_lib->get_cart();
		$data['payments']=$this->sale_lib->get_payments();
		$data['subtotal']=$this->sale_lib->get_subtotal();
		$data['taxes']=$this->sale_lib->get_taxes();
		$data['total']=$this->sale_lib->get_total();
		$data['receipt_title']=$this->lang->line('sales_receipt');
		$data['transaction_time']= date('m/d/Y h:i:s a', strtotime($sale_info['sale_time']));
		$customer_id=$this->sale_lib->get_customer();
		$emp_info=$this->Employee->get_info($sale_info['employee_id']);
		$data['payment_type']=$sale_info['payment_type'];
		$data['amount_change']=to_currency($this->sale_lib->get_amount_due() * -1);
		$data['amount_tendered']=to_currency($this->sale_lib->get_payments_total() * -1);
		$data['employee']=$emp_info->first_name.' '.$emp_info->last_name;

		if($customer_id!=-1)
		{
			$cust_info=$this->Customer->get_info($customer_id);
			$data['customer']=$cust_info->first_name.' '.$cust_info->last_name;
		}
		$data['sale_id']='POS '.$sale_id;
		$this->load->view("sales/receipt",$data);
		$this->sale_lib->clear_all();

	}
	
	function edit($sale_id)
	{
		$data = array();

		$data['customers'] = array('' => 'No Customer');
		foreach ($this->Customer->get_all()->result() as $customer)
		{
			$data['customers'][$customer->person_id] = $customer->first_name . ' '. $customer->last_name;
		}

		$data['employees'] = array();
		foreach ($this->Employee->get_all()->result() as $employee)
		{
			$data['employees'][$employee->person_id] = $employee->first_name . ' '. $employee->last_name;
		}

		$data['sale_info'] = $this->Sale->get_info($sale_id)->row_array();
				
		
		$this->load->view('sales/edit', $data);
	}
	
	function por_cobrar($sale_id)
	{
		$data = array();

		$data['customers'] = array('' => 'No Customer');
		foreach ($this->Customer->get_all()->result() as $customer)
		{
			$data['customers'][$customer->person_id] = $customer->first_name . ' '. $customer->last_name;
		}

		$data['employees'] = array();
		foreach ($this->Employee->get_all()->result() as $employee)
		{
			$data['employees'][$employee->person_id] = $employee->first_name . ' '. $employee->last_name;
		}

		$data['sale_info'] = $this->Sale->get_info($sale_id)->row_array();
		
		//tipos de pagos de abono.
		$data['payment_options']=array(
			$this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
			$this->lang->line('sales_check') => $this->lang->line('sales_check'),
			$this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
			$this->lang->line('sales_credit') => $this->lang->line('sales_credit')
		);
				
		
		$this->load->view('sales/por_cobrar', $data);
	}
	
	function delete($sale_id)
	{
		$data = array();
		
		if ($this->Sale->delete($sale_id))
		{
			$data['success'] = true;
		}
		else
		{
			$data['success'] = false;
		}
		
		$this->load->view('sales/delete', $data);
		
	}
	
	function save($sale_id,$payment_id)
	{
		$abono_data = array(
			'abono_amount' => $this->input->post('abono_amount'),
			'abono_type' => $this->input->post('abono_type'),
			'abono_comment' => $this->input->post('abono_comment'),
			'abono_time' => date('Y-m-d', strtotime($this->input->post('date'))),
			'payment_id' => $payment_id,
			'sale_id' => $sale_id
		);
		
		if ($this->Abono->save($abono_data))
		{
			echo json_encode(array('success'=>true,'message'=>$this->lang->line('porpagar_successfully_updated'),'sale_id'=>$sale_id));
		}
		else
		{
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('porpagar_unsuccessfully_updated')));
		}
	}

	function _reload($data=array())
	{		
		$person_info = $this->Employee->get_logged_in_employee_info();
		$data['cart']=$this->sale_lib->get_cart();
		$data['modes']=array('sale'=>$this->lang->line('sales_sale'),'return'=>$this->lang->line('sales_return'));
		$data['mode']=$this->sale_lib->get_mode();
		$data['subtotal']=$this->sale_lib->get_subtotal();
		$data['taxes']=$this->sale_lib->get_taxes();
		$data['total']=$this->sale_lib->get_total();
		$data['items_module_allowed'] = $this->Employee->has_permission('items', $person_info->person_id);
		//Alain Multiple Payments
		$data['payments_total']=$this->sale_lib->get_payments_total();
		$data['amount_due']=$this->sale_lib->get_amount_due();
		$data['payments']=$this->sale_lib->get_payments();
		
		$payments_row = array();
		foreach($this->Payment->get_all()->result() as $row)
		{
			$payments_row[$row->payment_id]=$row->payment_type;				
		}
		$data['payment_options']=$payments_row;
		
		/*$data['payment_options']=array(
			$this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
			$this->lang->line('sales_check') => $this->lang->line('sales_check'),
			$this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
			$this->lang->line('sales_credit') => $this->lang->line('sales_credit')
		);*/

		$customer_id=$this->sale_lib->get_customer();
		if($customer_id!=-1)
		{
			$info=$this->Customer->get_info($customer_id);
			$data['customer']=$info->first_name.' '.$info->last_name;
		}
		
		//Si ya se ha cerrado la caja.
		if($this->Box->ya_cerrado())
			$data['error'] = $this->lang->line('boxes_close_sale');
		$this->load->view("sales/register",$data);
	}

    function cancel_sale()
    {
    	$this->sale_lib->clear_all();
    	$this->_reload();

    }
	

	function view($sale_id=-1, $payment_id=-1, $debe=0)
	// function view($sale_id=-1, $payment_id=-1)
	{
		$data['sale_id']=$sale_id;
		$data['payment_id']=$payment_id;
		$data['debe']=$debe;
		
		//die($data['sale_id'].'-'.$data['payment_id'].'-'.$data['debe']);
		$data['payment_options']=array(
			$this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
			$this->lang->line('sales_check') => $this->lang->line('sales_check'),
			$this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
			$this->lang->line('sales_credit') => $this->lang->line('sales_credit')
		);
		$this->load->view("abonos/form",$data);
	}
	function get_row()
	{
		//$sale_id = $this->input->post('row_id');
		$sale_id = $this->input->post('row_id');
		$data_row=get_abono_data_row($this->Abono->get_sale($sale_id),$this);
		echo $data_row;
	}
	
	function search()
	{
		$search=$this->input->post('search');
		$search_id=$this->input->post('id');
		$data_rows=get_abono_manage_table_data_rows($this->Abono->search($search, $search_id),$this);
		echo $data_rows;
	}
	function suggest()
	{
		$suggestions = $this->Abono->get_search_suggestions($this->input->post('q'),$this->input->post('limit'));
		echo implode("\n",$suggestions);
	}
	
	function refresh()
	{
		$en_mora=$this->input->post('en_mora');
		$tiene_deuda=$this->input->post('tiene_deuda');

		$data['search_section_state']=$this->input->post('search_section_state');
		$data['en_mora']=$this->input->post('en_mora');
		$data['tiene_deuda']=$this->input->post('tiene_deuda');
		$data['controller_name']=strtolower($this->uri->segment(1));
		$data['form_width']=$this->get_form_width();
		$data['manage_table']=get_abono_manage_table($this->Abono->get_all_filtered($en_mora,$tiene_deuda),$this);
		$this->load->view('abonos/manage',$data);
	}

	/*
	get the width for the add/edit form
	*/
	function get_form_width()
	{
		return 360;
	}
}
?>