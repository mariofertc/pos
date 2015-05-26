<?php
class Box extends CI_Model 
{	
	function insert($inventory_data)
	{
		return $this->db->insert('inventory',$inventory_data);
	}
	/*
	Inserts or updates a customer
	*/
	function save(&$box_data,$box_id=false)
	{
		//$success=false;
		//Run these queries as a transaction, we want to make sure we do all or nothing
		//$this->db->trans_start();
		//$success = $this->db->insert('boxes',$box_data);
		//return false;
		if (!$box_id or !$this->exists($box_id))
		{
			if($this->db->insert('boxes',$box_data))
			{
				$box_data['box_id']=$this->db->insert_id();
				return true;
			}
			return false;
		}

		$this->db->where('box_id', $box_id);
		if($this->db->update('boxes',$box_data))
		{
		  return true;
		}
		//$this->db->trans_complete();		
		return false;
	}
	
	/*
	Get search suggestions to find items
	*/
	function get_search_suggestions($search,$limit=25)
	{
		$suggestions = array();

		$this->db->from('boxes');
		$this->db->like('comment', $search);
		$this->db->where('deleted',0);
		$this->db->order_by("comment", "desc");
		$by_comment = $this->db->get();
		foreach($by_comment->result() as $row)
		{
			$suggestions[]=$row->comment;
		}

		//only return $limit suggestions
		if(count($suggestions > $limit))
		{
			$suggestions = array_slice($suggestions, 0,$limit);
		}
		return $suggestions;

	}
	
	/*
	Returns all the boxes
	*/
	function get_all()
	{
		$this->db->from('boxes');
		$this->db->order_by("close_time", "desc");
		return $this->db->get();
	}
	
	/*
	Gets information about a particular item
	*/
	function get_info($box_id)
	{
	//echo "yo";
		$this->db->from('boxes');
		$this->db->where('box_id',$box_id);
		$this->db->where('deleted',0);
		
		$query = $this->db->get();

		if($query->num_rows()==1)
		{
			return $query->row();
		}
		else
		{
			//Get empty base parent object, as $item_id is NOT an item
			$box_obj=new stdClass();

			//Get all the fields from items table
			$fields = $this->db->list_fields('boxes');

			foreach ($fields as $field)
			{
				$box_obj->$field='';
			}

			return $box_obj;
		}
	}
	
	/*
	Determines if a given box_id is an box
	*/
	function exists($box_id)
	{
		$this->db->from('boxes');
		$this->db->where('box_id',$box_id);
		$this->db->where('deleted',0);
		$query = $this->db->get();

		return ($query->num_rows()==1);
	}
	
	/*
	Preform a search on boxes
	*/
	function search($search)
	{
		$this->db->from('boxes');
		$this->db->where("(comment LIKE '%".$this->db->escape_like_str($search)."%') and deleted=0");
		$this->db->order_by("close_time", "desc");
		return $this->db->get();	
	}
	/*
	Verifica si ya se ha cerrado la caja del día.
	*/
	function ya_cerrado()
	{
		$this->db->from('boxes');
		$this->db->where("substr(close_time,1,10) = '".date("Y-m-d")."' and deleted=0");		
		$query = $this->db->get();	
		return ($query->num_rows()>=1);
	}
	
	/*
	Deletes a list of boxes
	*/
	function delete_list($box_ids)
	{
		$this->db->where_in('box_id',$box_ids);
		return $this->db->update('boxes', array('deleted' => 1));
 	}
}

?>