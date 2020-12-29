<?php
class Sale extends CI_Model
{
	public function get_info($sale_id)
	{
		$this->db->from('sales');
		$this->db->where('sale_id',$sale_id);
		return $this->db->get();
	}

	function exists($sale_id)
	{
		$this->db->from('sales');
		$this->db->where('sale_id',$sale_id);
		$query = $this->db->get();

		return ($query->num_rows()==1);
	}

	function update($sale_data, $sale_id)
	{
		$this->db->where('sale_id', $sale_id);
		$success = $this->db->update('sales',$sale_data);
		
		return $success;
	}

	function get_total($where = null)
	{
		if($where)
			$this->db->where($where);
		return $this->db->from('sales')->count_all_results();
	}

	
	function save($items,$customer_id,$employee_id,$comment,$payments,$sale_id=false,$data = false)
	{
		if(count($items)==0)
			return -1;

		//Alain Multiple payments
		//Build payment types string
		$payment_types='';
		foreach($payments as $payment_id=>$payment)
		{
			//$payment_types=$payment_types.$payment['payment_type'].': '.to_currency($payment['payment_amount']).'<br>';
			$payment_types=$payment_types.$this->Payment->get_info($payment['payment_id'])->payment_type.': '.to_currency($payment['payment_amount']).'<br>';
		}

		$sales_data = array(
		'sale_time' => date('Y-m-d H:i:s'),
		'customer_id'=> $this->Customer->exists($customer_id) ? $customer_id : null,
		'employee_id'=>$employee_id,
		//'payment_id'=>$payment['payment_id'],
		'payment_type'=>$payment_types,
		'comment'=>$comment,
		'almacen_id'=>$data['almacen_id']
		);

		//Add facturation fields
		if($this->config->item('facturacion_electronica'))
		{
			$sales_data['establecimiento'] = (int)$data['establecimiento'];
			$sales_data['punto_emision'] = 1;
			$next_id = $this->get_last_invoice_number($sales_data['establecimiento'], $sales_data['punto_emision']);
			
			$sales_data['numero_secuencial'] = $next_id!==null?$next_id->numero_secuencial+1:1;
		}
		// die();
		

		//Run these queries as a transaction, we want to make sure we do all or nothing
		$this->db->trans_start();

		$this->db->insert('sales',$sales_data);
		$sale_id = $this->db->insert_id();

		foreach($payments as $payment_id=>$payment)
		{
			$sales_payments_data = array
			(
				'sale_id'=>$sale_id,
				'payment_id'=>$payment['payment_id'],
				'payment_amount'=>str_replace(',','.',$payment['payment_amount'])
			);
			$this->db->insert('sales_payments',$sales_payments_data);
		}

		foreach($items as $line=>$item)
		{
			$cur_item_info = $this->Item->get_info($item['item_id']);

			$sales_items_data = array
			(
				'sale_id'=>$sale_id,
				'item_id'=>$item['item_id'],
				'line'=>$item['line'],
				'description'=>$item['description'],
				'serialnumber'=>$item['serialnumber'],
				'quantity_purchased'=>to_currency_no_money($item['quantity']),
				'discount_percent'=>to_currency_no_money($item['discount']),
				'item_cost_price' => $cur_item_info->cost_price,
				'item_unit_price'=>str_replace(",",".",$item['price'])
			);

			$this->db->insert('sales_items',$sales_items_data);

			//Update stock quantity
			$item_data = array('quantity'=>to_currency_no_money($cur_item_info->quantity - $item['quantity']));
			$this->Item->save($item_data,$item['item_id']);
			
			//Update stock quantity Almacen
			// if($data['almacen_id']==-1)
			// {
			// }
			$cur_almacen_stock = $this->Almacen_stock->get_informacion($item['item_id'],$data['almacen_id']);
			$almacen_stock_data = array('cantidad'=>to_currency_no_money($cur_almacen_stock->cantidad - $item['quantity']),
										'almacen_id'=>$data['almacen_id'],
										'item_id'=>$item['item_id']);			
			$this->Almacen_stock->save($almacen_stock_data,$item['item_id']);
			
			//Ramel Inventory Tracking
			//Inventory Count Details
			$qty_buy = to_currency_no_money(-$item['quantity']);
			$sale_remarks ='Vent '.$sale_id;
			$inv_data = array
			(
				'trans_date'=>date('Y-m-d H:i:s'),
				'trans_items'=>$item['item_id'],
				'trans_user'=>$employee_id,
				'trans_comment'=>$sale_remarks,
				'trans_inventory'=>$qty_buy
			);
			$this->Inventory->insert($inv_data);
			//------------------------------------Ramel

			$customer = $this->Customer->get_info($customer_id);
 			if ($customer_id == -1 or $customer->taxable)
 			{
				foreach($this->Item_taxes->get_info($item['item_id']) as $row)
				{
					$this->db->insert('sales_items_taxes', array(
						'sale_id' 	=>$sale_id,
						'item_id' 	=>$item['item_id'],
						'line'      =>$item['line'],
						'name'		=>$row['name'],
						'percent' 	=>$row['percent']
					));
				}
			}
		}
		$this->db->trans_complete();
		
		if ($this->db->trans_status() === FALSE)
		{
			return -1;
		}
		
		return $sale_id;
	}

	function get_last_invoice_number($establecimiento, $punto_emision){
		$this->db->from('sales');
		$this->db->where('establecimiento',$establecimiento);
		$this->db->where('punto_emision',$punto_emision);
		$this->db->select_max('numero_secuencial');
		$query = $this->db->get();
		return $query->row();
	}
	
	function delete($sale_id)
	{
		//Run these queries as a transaction, we want to make sure we do all or nothing
		$this->db->trans_start();
		
		$this->db->delete('sales_payments', array('sale_id' => $sale_id)); 
		$this->db->delete('sales_items_taxes', array('sale_id' => $sale_id)); 
		$this->db->delete('sales_items', array('sale_id' => $sale_id)); 
		$this->db->delete('sales', array('sale_id' => $sale_id)); 
		
		$this->db->trans_complete();
				
		return $this->db->trans_status();
	}

	function get_sale_items($sale_id)
	{
		$this->db->from('sales_items');
		$this->db->where('sale_id',$sale_id);
		return $this->db->get();
	}

	function get_sale_payments_old($sale_id)
	{
		$this->db->from('sales_payments');
		$this->db->where('sale_id',$sale_id);
		return $this->db->get();
	}
	
	function get_sale_payments($sale_id)
	{
		$this->db->select('sales_payments.payment_amount, payments.payment_type, payments.payment_id');
		$this->db->from('payments');
		$this->db->join('sales_payments','sales_payments.payment_id = payments.payment_id');
		//$this->db->join('people', 'people.person_id = suppliers.person_id');
		$this->db->where('sales_payments.sale_id',$sale_id);
		return $this->db->get();
	}

	function get_customer($sale_id)
	{
		$this->db->from('sales');
		$this->db->where('sale_id',$sale_id);
		return $this->Customer->get_info($this->db->get()->row()->customer_id);
	}

	//We create a temp table that allows us to do easy report/sales queries
	public function create_sales_items_temp_table()
	{
		$sql_prefix = "";
		if($this->db->table_exists('phppos_sales_items_temp'))
		{
			//Borra datos previos
			//$this->db->query("drop table ".$this->db->dbprefix('sales_items_temp'));
			$this->db->query("delete from " . $this->db->dbprefix('sales_items_temp'));
			$sql_prefix = "insert into ";
		}else{
			$sql_prefix = "create table if not exists ";
		}
		$this->db->query('SET SQL_BIG_SELECTS=1'); 
		//$this->db->query("insert into ".$this->db->dbprefix('sales_items_temp')."
		//$this->db->query("CREATE TABLE if not exists ".$this->db->dbprefix('sales_items_temp')."
		$this->db->query($sql_prefix.$this->db->dbprefix('sales_items_temp')."
		(SELECT sale_time, date(sale_time) as sale_date, TIME(sale_time) as sale_date_time, ".$this->db->dbprefix('sales_items').".sale_id, comment, payment_type, customer_id, employee_id, 
		".$this->db->dbprefix('items').".item_id, supplier_id, quantity_purchased, item_cost_price, item_unit_price, SUM(percent) as item_tax_percent,
		discount_percent, (item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100) as subtotal,
		".$this->db->dbprefix('sales_items').".line as line, serialnumber, ".$this->db->dbprefix('sales_items').".description as description,
		ROUND((item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100)*(1+(SUM(percent)/100))," . config('precision').") as total,
		ROUND((item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100)*(SUM(percent)/100)," . config('precision').") as tax,
		(item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100) - (item_cost_price*quantity_purchased) as profit, nombre as almacen, phppos_almacenes.almacen_id as almacen_id,
		esign_state
		FROM ".$this->db->dbprefix('sales_items')."
		INNER JOIN ".$this->db->dbprefix('sales')."
		ON  ".$this->db->dbprefix('sales_items').'.sale_id='.$this->db->dbprefix('sales').'.sale_id'."
		LEFT OUTER JOIN ".$this->db->dbprefix('almacenes')." ON  ".$this->db->dbprefix('sales').'.almacen_id='.$this->db->dbprefix('almacenes').'.almacen_id'."
		INNER JOIN ".$this->db->dbprefix('items')." ON  ".$this->db->dbprefix('sales_items').'.item_id='.$this->db->dbprefix('items').'.item_id'."
		LEFT OUTER JOIN ".$this->db->dbprefix('suppliers')." ON  ".$this->db->dbprefix('items').'.supplier_id='.$this->db->dbprefix('suppliers').'.person_id'."
		LEFT OUTER JOIN ".$this->db->dbprefix('sales_items_taxes')." ON  "
		.$this->db->dbprefix('sales_items').'.sale_id='.$this->db->dbprefix('sales_items_taxes').'.sale_id'." and "
		.$this->db->dbprefix('sales_items').'.item_id='.$this->db->dbprefix('sales_items_taxes').'.item_id'." and "
		.$this->db->dbprefix('sales_items').'.line='.$this->db->dbprefix('sales_items_taxes').'.line'."
		GROUP BY sale_id, item_id, line)");

		//Update null item_tax_percents to be 0 instead of null
		$this->db->where('item_tax_percent IS NULL');
		$this->db->update('sales_items_temp', array('item_tax_percent' => 0));

		//Update null tax to be 0 instead of null
		$this->db->where('tax IS NULL');
		$this->db->update('sales_items_temp', array('tax' => 0));

		//Update null subtotals to be equal to the total as these don't have tax
		$this->db->query('UPDATE '.$this->db->dbprefix('sales_items_temp'). ' SET total=subtotal WHERE total IS NULL');
	}

	/**
	 * Get all sales made. Since ESign implementation.
	 */
	public function get_all($num = 0, $offset = 0, $where, $order = null)
	{
		$this->db->select('sale_id, sale_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, 
		CONCAT(customer.first_name," ",customer.last_name) as customer_name, sum(subtotal) as subtotal, 
		sum(total) as total, sum(tax) as tax, sum(profit) as profit, payment_type, comment, sale_date_time,
		esign_state', 
		false);
		$this->db->from('sales_items_temp');
		$this->db->join('people as employee', 'sales_items_temp.employee_id = employee.person_id');
		$this->db->join('people as customer', 'sales_items_temp.customer_id = customer.person_id', 'left');
		if ($where != "")
            $this->db->where($where);
		$this->db->group_by('sale_id');
		$this->db->order_by('sale_id', 'desc');
		/*if($order != "")
			$this->db->order_by($order);*/
        $this->db->limit($num, $offset);

		return $this->db->get()->result_array();
	}
	/*function get_total($where = '') {
        $this->db->from('sales_items_temp');
        if ($where != "")
            $this->db->where($where);
		$this->db->group_by('sale_id');
        return $this->db->count_all_results();
    }*/
}
