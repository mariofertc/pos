<?php
require_once("Report.php");
class Summary_taxes extends Report
{
	function __construct()
	{
		parent::__construct();
	}
	
	public function getDataColumns()
	{
		return array($this->lang->line('reports_tax_percent'), $this->lang->line('reports_subtotal'), $this->lang->line('reports_total'), $this->lang->line('reports_tax'));
	}
	
	public function getData(array $inputs)
	{
		 $this->db->select('concat(item_tax_percent, "%") as percent, sum(subtotal) as subtotal, sum(total) as total, sum(tax) as tax,sum(profit) as profit, almacen');
        $this->db->from('sales_items_temp');
        $this->db->join('items', 'sales_items_temp.item_id = items.item_id');
        if (isset($inputs['almacen_id']))
            if ($inputs['almacen_id'] != 0)
                $this->db->where('almacen_id = ' . $inputs['almacen_id']);
        $this->db->group_by('percent');
        $this->db->where('sale_date BETWEEN "' . $inputs['start_date'] . '" and "' . $inputs['end_date'] . '"');
        $this->db->order_by('percent');

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