<?php
require_once("Report.php");
class Summary_payments extends Report
{
	function __construct()
	{
		parent::__construct();
	}
	
	public function getDataColumns()
	{
		return array($this->lang->line('reports_payment_type'), $this->lang->line('reports_total'));
	}
	
	public function getData(array $inputs)
	{
		$this->db->select('payments.payment_type, SUM(payment_amount) as payment_amount, almacen', false);
		$this->db->from('sales_payments');
		//$this->db->join('sales', 'sales.sale_id=sales_payments.sale_id');
		$this->db->join('payments', 'payments.payment_id=sales_payments.payment_id');
		$this->db->join('sales_items_temp', 'sales_items_temp.sale_id=sales_payments.sale_id');
		 if (isset($inputs['almacen_id']))
            if ($inputs['almacen_id'] != 0)
                $this->db->where('almacen_id = ' . $inputs['almacen_id']);
		$this->db->where('date(sale_date) BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');
		$this->db->group_by("payments.payment_type");
		return $this->db->get()->result_array();
	}
	
	public function getSummaryData(array $inputs)
	{
		$this->db->select('sum(subtotal) as subtotal, sum(total) as total, sum(tax) as tax, sum(profit) as profit');
		$this->db->from('sales_items_temp');
		$this->db->join('items', 'sales_items_temp.item_id = items.item_id');
		 if (isset($inputs['almacen_id']))
            if ($inputs['almacen_id'] != 0)
                $this->db->where('almacen_id = ' . $inputs['almacen_id']);
		$this->db->where('sale_date BETWEEN "'. $inputs['start_date']. '" and "'. $inputs['end_date'].'"');

		return $this->db->get()->row_array();
	}
}