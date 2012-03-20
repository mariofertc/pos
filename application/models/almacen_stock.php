<?php
class Almacen_stock extends CI_Model
{	
	/*
	Determines if a given person_id is a customer
	*/
	function exists($item_id,$almacen_id)
	{
		$this->db->from('stock_almacenes');	
		// $this->db->where('deleted', 0);
		$this->db->where('stock_almacenes.almacen_id',$almacen_id);
		$this->db->where('stock_almacenes.item_id',$item_id);
		$query = $this->db->get();
		
		return ($query->num_rows()==1);
	}
	
	function get_cantidad($item_id,$almacen_id)
	{
		$cantidad = 0;
		$almacen_stock = $this->get_informacion($item_id,$almacen_id);
		//var_dump($almacen_stock);
		
		if(!isset($almacen_stock))
			return $cantidad;
		//foreach($almacen_stock->result() as $row)
		{
			$cantidad=$almacen_stock->cantidad;
		}
		return $cantidad;
	}
	function get_informacion($item_id,$almacen_id)
	{
		$this->db->from('stock_almacenes');	
		$this->db->where('stock_almacenes.item_id',$item_id);
		$this->db->where('stock_almacenes.almacen_id',$almacen_id);
		$query = $this->db->get();
		
		if($query->num_rows()==1)
		{
			return $query->row();
		}
		else
		{
			// return null;
			$fields = $this->db->list_fields('stock_almacenes');
			$stockalmacen_obj = new stdClass;
			
			foreach ($fields as $field)
			{
				$stockalmacen_obj->$field='';
			}
			$stockalmacen_obj->item_id = -1;
			return $stockalmacen_obj;
		}
		
	}
	
	function get_info($item_id)
	{
		$this->db->from('stock_almacenes');	
		// $this->db->where('deleted', 0);
		$this->db->where('stock_almacenes.item_id',$item_id);
		$query = $this->db->get();
		
		if($query->num_rows()==1)
		{
			return $query->row();
		}
		else
		{
			$fields = $this->db->list_fields('stock_almacenes');
			$stockalmacen_obj = new stdClass;
			
			foreach ($fields as $field)
			{
				$stockalmacen_obj->$field='';
			}
			$stockalmacen_obj->item_id = -1;
			return $stockalmacen_obj;
		}
	}
	
	function suma_stock($item_id)
	{
		$this->db->from('stock_almacenes');	
		// $this->db->where('deleted', 0);
		$this->db->where('stock_almacenes.item_id',$item_id);
		$query = $this->db->get();
		
		$stock = 0;
		foreach($query->result() as $almacen_stock)
		{
			$stock+=$almacen_stock->cantidad;
		}
		return $stock;
	}
	
	function save(&$stock_data,$item_id=false)
	{
		if ((!$item_id or !$stock_data['almacen_id'])or !$this->exists($item_id,$stock_data['almacen_id']))
		{
			if($this->db->insert('stock_almacenes',$stock_data))
			{
				$stock_data['item_id']=$this->db->insert_id();
				return true;
			}
			return false;
		}

		$this->db->where('item_id', $item_id);
		$this->db->where('almacen_id', $stock_data['almacen_id']);
		if($this->db->update('stock_almacenes',$stock_data))
		{
		  return true;
		}
		return false;
	}
}
?>