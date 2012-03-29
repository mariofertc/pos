<?php
class Item extends CI_Model
{
	/*
	Determines if a given item_id is an item
	*/
	function exists($item_id)
	{
		//Bug php or mysql version, if it is char explicit convert to number.
		if(!is_numeric($item_id))
			return false;
		$this->db->from('items');
		$this->db->where('item_id',$item_id);
		$this->db->where('deleted',0);
		$query = $this->db->get();
		return ($query->num_rows()==1);
	}

	/*
	Returns all the items
	*/
	function get_all()
	{
		$this->db->from('items');
		$this->db->where('deleted',0);
		$this->db->order_by("name", "asc");
		
		//Aumentar los stocks de las sucursales.
		$items = $this->db->get();
		$almacenes = $this->Almacen->get_all();
		
		foreach($items->result() as $item)
		{
			foreach($almacenes->result() as $almacen)
			{
				$id =  "id".$almacen->almacen_id;
				$item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
			}
		}		
		return $items;
	}

	/*
	Returns all the items
	*/
	function get_all_prov()
	{
		$this->db->from('items');
		$this->db->join('suppliers','suppliers.person_id=items.supplier_id', 'left');
		$this->db->where('items.deleted',0);
		$this->db->order_by("name", "asc");
		
		//Aumentar los stocks de las sucursales.
		$items = $this->db->get();
		$almacenes = $this->Almacen->get_all();
		
		foreach($items->result() as $item)
		{
			foreach($almacenes->result() as $almacen)
			{
				$id =  "id".$almacen->almacen_id;
				$item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
			}
		}		
		// return $this->db->get();
		// var_dump($items);
		return $items;
		
		// return $this->db->get();
	}
	/*
	Returns all the items with limit
	*/
	function get_all_limit($start_row,$limit)
	{
		$this->db->from('items',$start_row,$limit);
		$this->db->where('deleted',0);
		$this->db->order_by("name", "asc");
		$this->db->limit($limit, $start_row);
		// $this->db->limit($start_row, $limit);
		//$this->db->limit(1, 5);
		return $this->db->get();
	}
	
	/*
	Returns all the items with limit
	*/
	function get_all_limit_prov($start_row,$limit)
	{
		$this->db->from('items',$start_row,$limit);
		// $this->db->join('suppliers','suppliers.person_id=items.supplier_id','left');
		$this->db->join('suppliers','suppliers.person_id=items.supplier_id','left');
		$this->db->where('items.deleted',0);
		$this->db->order_by("name", "asc");
		$this->db->limit($limit, $start_row);
		// $this->db->limit($start_row, $limit);
		//$this->db->limit(1, 5);
		
		//Aumentar los stocks de las sucursales.
		$items = $this->db->get();
		$almacenes = $this->Almacen->get_all();
		
		foreach($items->result() as $item)
		{
			foreach($almacenes->result() as $almacen)
			{
				$id =  "id".$almacen->almacen_id;
				$item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
			}
		}		
		return $items;
	}
	
	

	function get_all_filtered($low_inventory=0,$is_serialized=0,$no_description,$almacen_id)
	{
		$this->db->from('items');
		$this->db->join('suppliers','suppliers.person_id=items.supplier_id', 'left');
		if($almacen_id != '')
		{
			$this->db->join('stock_almacenes','stock_almacenes.item_id=items.item_id and phppos_stock_almacenes.almacen_id = '.$almacen_id,'right');
		}
		
		if ($low_inventory !=0 )
		{
			$this->db->where('quantity <=','reorder_level');
		}
		if ($is_serialized !=0 )
		{
			$this->db->where('is_serialized',1);
		}
		if ($no_description!=0 )
		{
			$this->db->where('description','');
		}
		
		$this->db->where('items.deleted',0);
		$this->db->order_by("name", "asc");
		
		//Aumentar los stocks de las sucursales.
		$items = $this->db->get();
		$almacenes = $this->Almacen->get_all();
		
		foreach($items->result() as $item)
		{
			foreach($almacenes->result() as $almacen)
			{
				$id =  "id".$almacen->almacen_id;
				$item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
			}
		}		
		return $items;
	}

	/*
	Gets information about a particular item
	*/
	function get_info($item_id)
	{
		$this->db->from('items');
		$this->db->join('suppliers','suppliers.person_id=items.supplier_id', 'left');
		$this->db->where('item_id',$item_id);
		$this->db->where('items.deleted',0);
		
		//Aumentar los stocks de las sucursales.
		$items = $this->db->get();
		$almacenes = $this->Almacen->get_all();
		
		foreach($items->result() as $item)
		{
			foreach($almacenes->result() as $almacen)
			{
				$id =  "id".$almacen->almacen_id;
				$item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
			}
		}		
		

		if($items->num_rows()==1)
		{
			return $items->row();
		}
		else
		{
			//Get empty base parent object, as $item_id is NOT an item
			$item_obj=new stdClass();

			//Get all the fields from items table
			$fields = $this->db->list_fields('items');

			foreach ($fields as $field)
			{
				$item_obj->$field='';
			}

			return $item_obj;
		}
	}

	/*
	Get an item id given an item number
	*/
	function get_item_id($item_number)
	{
		$this->db->from('items');
		$this->db->where('item_number',$item_number);
		$this->db->where('deleted',0);

		$query = $this->db->get();

		if($query->num_rows()==1)
		{
			return $query->row()->item_id;
		}

		return false;
	}

	/*
	Gets information about multiple items
	*/
	function get_multiple_info($item_ids)
	{
		$this->db->from('items');
		$this->db->join('suppliers','suppliers.person_id=items.supplier_id', 'left');
		$this->db->where_in('item_id',$item_ids);
		$this->db->where('items.deleted',0);
		// $this->db->order_by("yo", "asc");
		
		//Aumentar los stocks de las sucursales.
		$items = $this->db->get();
		$almacenes = $this->Almacen->get_all();
		
		foreach($items->result() as $item)
		{
			foreach($almacenes->result() as $almacen)
			{
				$id =  "id".$almacen->almacen_id;
				$item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
			}
		}		
		return $items;
	}

	/*
	Inserts or updates a item
	*/
	function save(&$item_data,$item_id=false)
	{
		if (!$item_id or !$this->exists($item_id))
		{
			if($this->db->insert('items',$item_data))
			{
				$item_data['item_id']=$this->db->insert_id();
				return true;
			}
			return false;
		}

		$this->db->where('item_id', $item_id);
		if($this->db->update('items',$item_data))
		{
		  //$item_data['item_id']=$this->db->update_id();
		  return true;
		}
		return false;
	}

	/*
	Updates multiple items at once
	*/
	function update_multiple($item_data,$item_ids)
	{
		$this->db->where_in('item_id',$item_ids);
		return $this->db->update('items',$item_data);
	}

	/*
	Deletes one item
	*/
	function delete($item_id)
	{
		$this->db->where('item_id', $item_id);
		return $this->db->update('items', array('deleted' => 1));
	}

	/*
	Deletes a list of items
	*/
	function delete_list($item_ids)
	{
		$this->db->where_in('item_id',$item_ids);
		return $this->db->update('items', array('deleted' => 1));
 	}

 	/*
	Get search suggestions to find items
	*/
	function get_search_suggestions($search,$limit=25)
	{
		$suggestions = array();

		$this->db->from('items');
		$this->db->like('name', $search);
		$this->db->where('deleted',0);
		$this->db->order_by("name", "asc");
		$by_name = $this->db->get();
		foreach($by_name->result() as $row)
		{
			$suggestions[]=$row->name;
		}

		$this->db->select('category');
		$this->db->from('items');
		$this->db->where('deleted',0);
		$this->db->distinct();
		$this->db->like('category', $search);
		$this->db->order_by("category", "asc");
		$by_category = $this->db->get();
		foreach($by_category->result() as $row)
		{
			$suggestions[]=$row->category;
		}

		$this->db->from('items');
		$this->db->like('item_number', $search);
		$this->db->where('deleted',0);
		$this->db->order_by("item_number", "asc");
		$by_item_number = $this->db->get();
		foreach($by_item_number->result() as $row)
		{
			$suggestions[]=$row->item_number;
		}


		//only return $limit suggestions
		if(count($suggestions > $limit))
		{
			$suggestions = array_slice($suggestions, 0,$limit);
		}
		return $suggestions;

	}

	function get_item_search_suggestions($search,$limit=25)
	{
		$suggestions = array();

		$this->db->from('items');
		$this->db->where('deleted',0);
		$this->db->like('name', $search);
		$this->db->order_by("name", "asc");
		$by_name = $this->db->get();
		foreach($by_name->result() as $row)
		{
			$suggestions[]=$row->item_id.'|'.$row->name;
		}

		$this->db->from('items');
		$this->db->where('deleted',0);
		$this->db->like('item_number', $search);
		$this->db->order_by("item_number", "asc");
		$by_item_number = $this->db->get();
		foreach($by_item_number->result() as $row)
		{
			$suggestions[]=$row->item_id.'|'.$row->item_number;
			//$suggestions[]=$row->item_id.'|'.$row->name;
		}

		//only return $limit suggestions
		if(count($suggestions > $limit))
		{
			$suggestions = array_slice($suggestions, 0,$limit);
		}
		return $suggestions;

	}

	function get_category_suggestions($search)
	{
		$suggestions = array();
		$this->db->distinct();
		$this->db->select('category');
		$this->db->from('items');
		$this->db->like('category', $search);
		$this->db->where('deleted', 0);
		$this->db->order_by("category", "asc");
		$by_category = $this->db->get();
		foreach($by_category->result() as $row)
		{
			$suggestions[]=$row->category;
		}

		return $suggestions;
	}

	/*
	Preform a search on items
	*/
	function search($search)
	{
		$this->db->from('items');
		$this->db->join('suppliers','suppliers.person_id=items.supplier_id','left');
		$this->db->where("(name LIKE '%".$this->db->escape_like_str($search)."%' or 
		item_number LIKE '%".$this->db->escape_like_str($search)."%' or 
		category LIKE '%".$this->db->escape_like_str($search)."%') and phppos_items.deleted=0");
		$this->db->order_by("name", "asc");
		
		//Aumentar los stocks de las sucursales.
		$items = $this->db->get();
		$almacenes = $this->Almacen->get_all();
		
		foreach($items->result() as $item)
		{
			foreach($almacenes->result() as $almacen)
			{
				$id =  "id".$almacen->almacen_id;
				$item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
			}
		}		
		return $items;
		
	}

	function get_categories()
	{
		$this->db->select('category');
		$this->db->from('items');
		$this->db->where('deleted',0);
		$this->db->distinct();
		$this->db->order_by("category", "asc");

		return $this->db->get();
	}
	
	function get_almacen($item_id)
	{
		$this->db->from('items');
		$this->db->join('almacenes','almacenes.almacen_id=items.almacen_id', 'left');
		$this->db->where('item_id',$item_id);
		$this->db->where('items.deleted',0);
		
		$query = $this->db->get();

		if($query->num_rows()==1)
		{
			return $query->row();
		}
		else
		{
			return null;
		}
	}
	function get_almacenes($item_id,$almacen_id)
	{
		$this->db->from('items');
		$this->db->join('stock_almacenes','stock_almacenes.item_id=items.item_id', 'left');
		$this->db->join('almacenes','almacenes.almacen_id=stock_almacenes.almacen_id', 'left');
		$this->db->where('stock_almacenes.item_id',$item_id);
		$this->db->where('stock_almacenes.almacen_id',$almacen_id);
		$this->db->where('items.deleted',0);
		
		$query = $this->db->get();

		if($query->num_rows()==1)
		{
			return $query->row();
		}
		else
		{
			return null;
		}
	}
}
?>
