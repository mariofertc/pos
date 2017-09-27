<?php
require_once("Report.php");
class Inventory_low extends Report
{
	function __construct()
	{
		parent::__construct();
	}
	
	public function getDataColumns()
	{
		return array($this->lang->line('reports_item_name'), $this->lang->line('reports_item_number'), $this->lang->line('reports_description'), $this->lang->line('reports_count'), $this->lang->line('reports_reorder_level'));
	}
	
	public function getData(array $inputs)
	{
		$this->db->select('name, item_number, quantity, reorder_level, description');
		$this->db->from('items');
		$this->db->where('quantity <= reorder_level and deleted=0');
		$this->db->order_by('name');
		
		return $this->db->get()->result_array();

	}
	
	public function getSummaryData(array $inputs)
	{
		return array();
	}
	
	//yop
	/*
	Get search suggestions to find customers
	*/
	function get_search_suggestions($search,$limit=25)
	{
		$suggestions = array();
		
		$this->db->from('items');
		$this->db->where("(name LIKE '%".$this->db->escape_like_str($search)."%' or 
		description LIKE '%".$this->db->escape_like_str($search)."%' or 
		CONCAT(`name`,' ',`description`) LIKE '%".$this->db->escape_like_str($search)."%') and deleted=0 AND quantity <= reorder_level");
		$this->db->order_by("name", "asc");		
		$by_name = $this->db->get();
		foreach($by_name->result() as $row)
		{
			$suggestions[]=$row->first_name.' '.$row->last_name;
		}
		
		//only return $limit suggestions
		if(count($suggestions > $limit))
		{
			$suggestions = array_slice($suggestions, 0,$limit);
		}
		return $suggestions;
	
	}

	/*
	Preform a search on inventory
	*/
	function search($search)
	{
		$this->db->from('ITEMS');
		//$this->db->join('items','inventory.trans_items=items.item_id');	
		$this->db->where("(name LIKE '%".$this->db->escape_like_str($search)."%' or 
		description LIKE '%".$this->db->escape_like_str($search)."%' or 
		CONCAT(`name`,' ',`description`) LIKE '%".$this->db->escape_like_str($search)."%') and deleted=0 AND quantity <= reorder_level");		
		$this->db->order_by("name", "asc");
		
		//return $this->db->get();	
		return $this->db->get();
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