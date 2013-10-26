<?php
class Receiving extends CI_Model
{
	public function get_info($receiving_id)
	{
		$this->db->from('receivings');
		$this->db->where('receiving_id',$receiving_id);
		return $this->db->get();
	}

	function exists($receiving_id)
	{
		$this->db->from('receivings');
		$this->db->where('receiving_id',$receiving_id);
		$query = $this->db->get();

		return ($query->num_rows()==1);
	}

	function save ($items,$supplier_id,$employee_id,$comment,$payments,$receiving_id=false,$data = false)
	{
		if(count($items)==0)
			return -1;

		//Build payment types string
		$payment_types='';
		foreach($payments as $payment_id=>$payment)
		{
			//$payment_types=$payment_types.$payment['payment_type'].': '.to_currency($payment['payment_amount']).'<br>';
			$payment_types=$payment_types.$this->Payment->get_info($payment['payment_id'])->payment_type.': '.to_currency($payment['payment_amount']).'<br>';
		}
		
		$receivings_data = array(
		'supplier_id'=> $this->Supplier->exists($supplier_id) ? $supplier_id : null,
		'employee_id'=>$employee_id,
		'payment_type'=>$payment_types,
		'comment'=>$comment
		);

		//Run these queries as a transaction, we want to make sure we do all or nothing
		$this->db->trans_start();

		$this->db->insert('receivings',$receivings_data);
		$receiving_id = $this->db->insert_id();

		//Pagos
		foreach($payments as $payment_id=>$payment)
		{
			$receivings_payments_data = array
			(
				'receiving_id'=>$receiving_id,
				'payment_id'=>$payment['payment_id'],
				'payment_amount'=>str_replace(',','.',$payment['payment_amount'])
			);
			$this->db->insert('receivings_payments',$receivings_payments_data);
		}

		foreach($items as $line=>$item)
		{
			$cur_item_info = $this->Item->get_info($item['item_id']);

			$receivings_items_data = array
			(
				'receiving_id'=>$receiving_id,
				'item_id'=>$item['item_id'],
				'line'=>$item['line'],
				'description'=>$item['description'],
				'serialnumber'=>$item['serialnumber'],
				'quantity_purchased'=>to_currency_no_money($item['quantity']),
				'discount_percent'=>$item['discount'],
				'item_cost_price' => $cur_item_info->cost_price,
				'item_unit_price'=>$item['price']
			);

			$this->db->insert('receivings_items',$receivings_items_data);

			//Update stock quantity
			$item_data = array('quantity'=>to_currency_no_money($cur_item_info->quantity + $item['quantity']));
			$this->Item->save($item_data,$item['item_id']);
			
			//Update or insert stock quantity Almacen
			$cur_almacen_stock = $this->Almacen_stock->get_informacion($item['item_id'],$data['almacen_id']);
			$almacen_stock_data = array('cantidad'=>to_currency_no_money($cur_almacen_stock->cantidad + $item['quantity']),
										'almacen_id'=>$data['almacen_id'], 'item_id'=>$item['item_id']);			
			$this->Almacen_stock->save($almacen_stock_data,$item['item_id']);
			
			$qty_recv = to_currency_no_money($item['quantity']);
			$recv_remarks ='RECV '.$receiving_id;
			$inv_data = array
			(
				'trans_date'=>date('Y-m-d H:i:s'),
				'trans_items'=>$item['item_id'],
				'trans_user'=>$employee_id,
				'trans_comment'=>$recv_remarks,
				'trans_inventory'=>$qty_recv
			);
			$this->Inventory->insert($inv_data);

			$supplier = $this->Supplier->get_info($supplier_id);
		}
		$this->db->trans_complete();
		
		if ($this->db->trans_status() === FALSE)
		{
			return -1;
		}


		return $receiving_id;
	}

	function get_receiving_items($receiving_id)
	{
		$this->db->from('receivings_items');
		$this->db->where('receiving_id',$receiving_id);
		return $this->db->get();
	}

	function get_supplier($receiving_id)
	{
		$this->db->from('receivings');
		$this->db->where('receiving_id',$receiving_id);
		return $this->Supplier->get_info($this->db->get()->row()->supplier_id);
	}

//We create a temp table that allows us to do easy report/receiving queries
	public function create_receivings_items_temp_table()
	{
		if($this->db->table_exists('receivings_items_temp'))
		{
			//Borra datos previos
			$this->db->query("drop table ".$this->db->dbprefix('receivings_items_temp'));
		}
		$this->db->query("CREATE  TABLE if not exists ".$this->db->dbprefix('receivings_items_temp')."
		(SELECT date(receiving_time) as receiving_date, ".$this->db->dbprefix('receivings_items').".receiving_id, comment,payment_type, employee_id, 
		".$this->db->dbprefix('items').".item_id, ".$this->db->dbprefix('receivings').".supplier_id, quantity_purchased, item_cost_price, item_unit_price,
		discount_percent, (item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100) as subtotal,
		".$this->db->dbprefix('receivings_items').".line as line, serialnumber, ".$this->db->dbprefix('receivings_items').".description as description,
		ROUND((item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100),2) as total,
		(item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100) - (item_cost_price*quantity_purchased) as profit
		FROM ".$this->db->dbprefix('receivings_items')."
		INNER JOIN ".$this->db->dbprefix('receivings')." ON  ".$this->db->dbprefix('receivings_items').'.receiving_id='.$this->db->dbprefix('receivings').'.receiving_id'."
		INNER JOIN ".$this->db->dbprefix('items')." ON  ".$this->db->dbprefix('receivings_items').'.item_id='.$this->db->dbprefix('items').'.item_id'."
		GROUP BY receiving_id, item_id, line)");
	}
	
	function get_receiving_payments($receiving_id)
	{
		$this->db->select('receivings_payments.payment_amount, payments.payment_type, payments.payment_id');
		$this->db->from('receivings_payments');
		$this->db->join('payments','receivings_payments.payment_id = payments.payment_id');
		$this->db->join('receivings','receivings.receiving_id = receivings_payments.receiving_id');
		$this->db->where('receivings.receiving_id',$receiving_id);
		return $this->db->get();
	}

}
?>
