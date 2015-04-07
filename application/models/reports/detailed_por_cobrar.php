<?php
require_once("report.php");
class Detailed_por_cobrar extends Report
{
	function __construct()
	{
		parent::__construct();
	}
	
	public function getDataColumns()
	{
		return array('summary' => array($this->lang->line('reports_sale_id'), $this->lang->line('reports_date'), $this->lang->line('reports_items_purchased'), $this->lang->line('reports_sold_by'), $this->lang->line('reports_sold_to'), $this->lang->line('reports_total'), $this->lang->line('reports_debe'), $this->lang->line('reports_payment_type'), $this->lang->line('reports_comments')),
					'details' => array($this->lang->line('reports_name'), $this->lang->line('reports_category'), $this->lang->line('reports_serial_number'), $this->lang->line('reports_description'), $this->lang->line('reports_quantity_purchased'), $this->lang->line('reports_subtotal'), $this->lang->line('reports_total'), $this->lang->line('reports_tax'), $this->lang->line('reports_profit'),$this->lang->line('reports_discount'))
		);		
	}
	
	public function getDataColumnsAbono()
	{
		return array($this->lang->line('reports_date'), $this->lang->line('reports_total'), $this->lang->line('reports_payment_type'), $this->lang->line('reports_comments'));
	}
	
	public function getData(array $inputs)
	{
		$this->db->select('sales_items_temp.sale_id, sale_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(customer.first_name," ",customer.last_name) as customer_name, sum(total) as total, sales_items_temp.payment_type, comment', false);
		$this->db->from('sales_items_temp');
		$this->db->join('people as employee', 'sales_items_temp.employee_id = employee.person_id');
		$this->db->join('people as customer', 'sales_items_temp.customer_id = customer.person_id', 'left');
		// $this->db->join('abonos as abono_sale', 'sales_items_temp.sale_id = abono_sale.sale_id', 'left');
		// $this->db->join('abonos as abono_payment', 'sales_items_temp.payment_id = abono_payment.sale_id', 'left');
		$this->db->join('sales_payments as sp', 'sp.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->join('payments as p1', 'sp.payment_id = p1.payment_id', 'left outer');
		// $this->db->join('sales_payments as ss', 'ss.sale_id = sales_items_temp.sale_id');
		//$this->db->ar_join[] ='LEFT JOIN phppos_sales_payments on (phppos_sales_payments.payment_id = phppos_sales_items_temp.payment_id and phppos_sales_payments.sale_id = phppos_sales_items_temp.sale_id)';
		$this->db->join('payments as p', 'p.payment_id = sp.payment_id');
		$this->db->where('sale_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		$this->db->where('p.por_cobrar = 1');
		//$this->db->where('sp.sale_id','sales_items_temp.sale_id');
		$this->db->group_by('sales_items_temp.sale_id');
		$this->db->order_by('sales_items_temp.sale_id');

		$data = array();
		$data['summary'] = $this->db->get()->result_array();
		$data['details'] = array();
		$data['abonos'] = array();
		$data['payments'] = array();
		
		
		//$data[]
		foreach($data['summary'] as $key=>$value)
		{
			$this->db->select('name, category, quantity_purchased, serialnumber, sales_items_temp.description, subtotal,total, tax, profit, discount_percent');
			$this->db->from('sales_items_temp');
			$this->db->join('items', 'sales_items_temp.item_id = items.item_id');
			$this->db->where('sale_id = '.$value['sale_id']);
			$data['details'][$key] = $this->db->get()->result_array();
			
			$this->db->select('sales_payments.payment_id, payments.payment_type,sales_payments.payment_amount, sales_payments.sale_id, por_cobrar', false);
			$this->db->from('sales_items_temp');
			$this->db->join('sales_payments','sales_payments.sale_id=sales_items_temp.sale_id');
			$this->db->join('payments','payments.payment_id=sales_payments.payment_id');
			$this->db->where('sales_payments.sale_id = '.$value['sale_id']);
			//$this->db->where('por_cobrar = 1');
			$this->db->group_by('sales_payments.sale_id');
			$this->db->group_by('payment_id');
			$data['payments'][$key] = $this->db->get()->result_array();
			
			foreach($data['payments'][$key] as $pkey=>$pvalue)
			{
			 $this->db->select('abono_id,abono_amount,abono_type,abono_comment,abono_time');
			 $this->db->from('sales_items_temp');
			 $this->db->join('abonos', 'sales_items_temp.sale_id = abonos.sale_id');
			//$this->db->join('abono as abono_payment', 'sales_items_temp.payment_id = abono_payment.payment_id');
			 $this->db->where('abonos.payment_id = '.$pvalue['payment_id']);
			 $this->db->where('abonos.sale_id = '.$value['sale_id']);
			 $this->db->group_by('abono_id');
			 $data['abonos'][$key] = $this->db->get()->result_array();
			}
		}
		
		return $data;
	}
	
	public function getSummaryData(array $inputs)
	{
		$this->db->select('sum(subtotal) as subtotal, sum(total) as total, '. $inputs['total_abono'] .' as total_por_cobrar');
		$this->db->from('sales_items_temp');
		$this->db->where('sale_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		
		return $this->db->get()->row_array();
	}
}
?>