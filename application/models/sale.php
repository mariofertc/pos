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
		'comment'=>$comment
		);
		

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
				'item_unit_price'=>$item['price']
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
		//$query = $this->db->get("sales_items_temp");
		//if($query->num_rows()!=0)
		{
			// $this->db->query("CREATE TEMPORARY TABLE if not exists " . $this->db->dbprefix("sales_items_temp") . "(temp varchar(2));");
			// $this->db->query("drop table ".$this->db->dbprefix('sales_items_temp'));
		}
		
		//Borra datos previos
		$this->db->query("truncate table ".$this->db->dbprefix('sales_items_temp'));
		
		$this->db->query("CREATE TABLE if not exists ".$this->db->dbprefix('sales_items_temp')."
		(SELECT date(sale_time) as sale_date, ".$this->db->dbprefix('sales_items').".sale_id, comment, payment_type, customer_id, employee_id, 
		".$this->db->dbprefix('items').".item_id, supplier_id, quantity_purchased, item_cost_price, item_unit_price, SUM(percent) as item_tax_percent,
		discount_percent, (item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100) as subtotal,
		".$this->db->dbprefix('sales_items').".line as line, serialnumber, ".$this->db->dbprefix('sales_items').".description as description,
		ROUND((item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100)*(1+(SUM(percent)/100)),2) as total,
		ROUND((item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100)*(SUM(percent)/100),2) as tax,
		(item_unit_price*quantity_purchased-item_unit_price*quantity_purchased*discount_percent/100) - (item_cost_price*quantity_purchased) as profit
		FROM ".$this->db->dbprefix('sales_items')."
		INNER JOIN ".$this->db->dbprefix('sales')." ON  ".$this->db->dbprefix('sales_items').'.sale_id='.$this->db->dbprefix('sales').'.sale_id'."
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
}
?>
