<?php
require_once("Report.php");
class Summary_employees extends Report
{
	function __construct()
	{
		parent::__construct();
	}
	
	public function getDataColumns()
	{
		return array($this->lang->line('reports_employee'), $this->lang->line('reports_subtotal'), $this->lang->line('reports_total'), $this->lang->line('reports_tax'), $this->lang->line('reports_profit'));
	}
	
	public function getData(array $inputs)
	{
		$this->db->select('CONCAT(first_name, " ",last_name) as employee, sum(subtotal) as subtotal, sum(total) as total, sum(tax) as tax, sum(profit) as profit, count(*) as cantidad', false);
		$this->db->from('sales_items_temp');
		$this->db->join('employees', 'employees.person_id = sales_items_temp.employee_id');
		$this->db->join('people', 'employees.person_id = people.person_id');
		$this->db->where('sale_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		$this->db->group_by('employee_id');
		$this->db->order_by('last_name');

		return $this->db->get()->result_array();		
	}
	
	public function getSummaryData(array $inputs)
	{
		$this->db->select('sum(subtotal) as subtotal, sum(total) as total, sum(tax) as tax, sum(profit) as profit');
		$this->db->from('sales_items_temp');
		$this->db->join('employees', 'employees.person_id = sales_items_temp.employee_id');
		$this->db->join('people', 'employees.person_id = people.person_id');
		$this->db->where('sale_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');

		return $this->db->get()->row_array();
	}

	public function getDataby($select = "", array $inputs)
	{
		if($select)
		$this->db->select($select, false);
		else
		$this->db->select('CONCAT(first_name, " ",last_name) as employee, sum(subtotal) as subtotal, sum(total) as total, sum(tax) as tax, sum(profit) as profit, count(*) as cantidad', false);
		$this->db->from('sales_items_temp');
		$this->db->join('employees', 'employees.person_id = sales_items_temp.employee_id');
		$this->db->join('people', 'employees.person_id = people.person_id');
		$this->db->where('sale_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		$this->db->group_by('employee_id');
		$this->db->group_by("Year(sale_date)");
		$this->db->group_by("Month(sale_date)");
		$this->db->order_by("Year(sale_date)","Month(sale_date)");
		return $this->db->get()->result_array();		
	}
	public function getDatabyFiveTop($select = "", array $inputs, $order=null)
	{
		if($select)
		$this->db->select($select, false);
		else
		$this->db->select('CONCAT(first_name, " ",last_name) as employee, sum(subtotal) as subtotal, sum(total) as total, sum(tax) as tax, sum(profit) as profit, count(*) as cantidad', false);
		$this->db->from('sales_items_temp');
		$this->db->join('employees', 'employees.person_id = sales_items_temp.employee_id');
		$this->db->join('people', 'employees.person_id = people.person_id');
		$this->db->where('sale_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		$this->db->group_by('employee_id');
		if($order)
		$this->db->order_by($order);
		$this->db->limit(5,0);
		return $this->db->get()->result_array();		
	}
}