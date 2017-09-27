<?php
require_once("Report.php");
class Detailed_porpagar extends Report
{
	function __construct()
	{
		parent::__construct();
	}
	
	public function getDataColumns()
	{
		return array('summary' => array($this->lang->line('reports_sale_id'), $this->lang->line('reports_date'), $this->lang->line('reports_items_purchased'), $this->lang->line('reports_sold_by'), $this->lang->line('reports_sold_to'), $this->lang->line('reports_total'), $this->lang->line('reports_debe'), $this->lang->line('reports_payment_type'), $this->lang->line('reports_comments')),
					'details' => array($this->lang->line('reports_name'), $this->lang->line('reports_category'), $this->lang->line('reports_quantity_purchased'), $this->lang->line('reports_total'), $this->lang->line('reports_discount'))
		);		
	}
	
	public function getDataColumnsPorPagar()
	{
		return array($this->lang->line('reports_date'), $this->lang->line('reports_total'), $this->lang->line('reports_payment_type'), $this->lang->line('reports_comments'));
	}
	
	public function getData(array $inputs)
	{
		$this->db->select('rp.payment_id,rp.receiving_id, receiving_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(supplier.first_name," ",supplier.last_name) as supplier_name, sum(total) as total, sum(profit) as profit, receivings_items_temp.payment_type, comment', false);
		$this->db->from('receivings_items_temp');
		$this->db->join('people as employee', 'receivings_items_temp.employee_id = employee.person_id');
		$this->db->join('people as supplier', 'receivings_items_temp.supplier_id = supplier.person_id', 'left');
		$this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
		$this->db->join('payments as p', 'p.payment_id = rp.payment_id');
		$this->db->where('receiving_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		$this->db->where('por_cobrar = 1');
		$this->db->group_by('receiving_id');
		$this->db->order_by('receiving_id');
		
		$data = array();
		$data['summary'] = $this->db->get()->result_array();
		$data['details'] = array();
		$data['porpagar'] = array();
		$data['payments'] = array();
		
		
		//$data[]
		foreach($data['summary'] as $key=>$value)
		{
			$this->db->select('name, category, quantity_purchased, serialnumber,total, discount_percent');
			$this->db->from('receivings_items_temp');
			$this->db->join('items', 'receivings_items_temp.item_id = items.item_id');
			$this->db->where('receiving_id = '.$value['receiving_id']);
			$data['details'][$key] = $this->db->get()->result_array();
			
			
			$this->db->select('receivings_payments.payment_id, payments.payment_type,receivings_payments.payment_amount, receivings_payments.receiving_id, por_cobrar', false);
			$this->db->from('receivings_items_temp');
			$this->db->join('receivings_payments','receivings_payments.receiving_id=receivings_items_temp.receiving_id');
			$this->db->join('payments','payments.payment_id=receivings_payments.payment_id');
			$this->db->where('receivings_payments.receiving_id = '.$value['receiving_id']);
			//$this->db->where('por_cobrar = 1');
			$this->db->group_by('receivings_payments.receiving_id');
			$this->db->group_by('payment_id');
			$data['payments'][$key] = $this->db->get()->result_array();
			foreach($data['payments'][$key] as $pkey=>$pvalue)
			{
			 $this->db->select('porpagar_id,porpagar.amount,porpagar.type,porpagar.comment,porpagar.time');
			 $this->db->from('receivings_items_temp');
			 $this->db->join('porpagar', 'receivings_items_temp.receiving_id = porpagar.receiving_id');
			//$this->db->join('abono as abono_payment', 'sales_items_temp.payment_id = abono_payment.payment_id');
			 $this->db->where('porpagar.payment_id = '.$pvalue['payment_id']);
			 $this->db->where('porpagar.receiving_id = '.$value['receiving_id']);
			 $this->db->group_by('porpagar_id');
			 $data['porpagar'][$key] = $this->db->get()->result_array();
			}
		}
		
		return $data;
	}
	
	public function getSummaryData(array $inputs)
	{
		// $this->db->select('sum(subtotal) as subtotal, sum(total) as total, sum(profit) as profit');
		// $this->db->from('receivings_items_temp');
		// $this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
		// $this->db->join('payments as p', 'p.payment_id = rp.payment_id');
		// $this->db->where('receiving_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		// $this->db->where('por_cobrar = 1');
		$this->db->select('sum(subtotal) as subtotal, sum(total) as total, '.$inputs['total_debe'].' as total_porpagar');
		$this->db->from('receivings_items_temp');
		$this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id');
		$this->db->join('payments as p', 'p.payment_id = rp.payment_id');
		$this->db->where('receiving_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		$this->db->where('por_cobrar = 1');
		//$this->db->group_by('rp.payment_id,rp.receiving_id');
		return $this->db->get()->row_array();
	}
}
?>