<?php
class Payment extends CI_Model
{	
	/*
	Determines if a given person_id is a customer
	*/
	function exists($payment_id)
	{
		$this->db->from('payments');	
		//$this->db->join('people', 'people.person_id = suppliers.person_id');
		$this->db->where('deleted', 0);
		$this->db->where('payments.payment_id',$payment_id);
		$query = $this->db->get();
		
		return ($query->num_rows()==1);
	}
	
	/*
	Returns all the suppliers
	*/
	function get_all()
	{
		$this->db->from('payments');
		//$this->db->join('people','suppliers.person_id=people.person_id');			
		$this->db->where('deleted', 0);
		$this->db->order_by("sort", "asc");
		return $this->db->get();		
	}
	
	/*
	Gets information about a particular supplier
	*/
	function get_info($payment_id)
	{
		$this->db->from('payments');	
		$this->db->where('deleted', 0);
		$this->db->where('payments.payment_id',$payment_id);
		$query = $this->db->get();
		
		if($query->num_rows()==1)
		{
			return $query->row();
		}
		else
		{
			//Get empty base parent object, as $supplier_id is NOT an supplier
			$payment_obj = new stdClass();
			
			//Get all the fields from supplier table
			$fields = $this->db->list_fields('payments');
			
			//append those fields to base parent object, we we have a complete empty object
			foreach ($fields as $field)
			{
				$payment_obj->$field='';
			}
			
			return $payment_obj;
		}
	}
	
	/*
	Gets information about multiple suppliers
	*/
	function get_multiple_info($payments_ids)
	{
		$this->db->from('payments');
		// $this->db->join('people', 'people.person_id = suppliers.person_id');		
		$this->db->where('deleted', 0);
		$this->db->where_in('payments.payment_id',$payments_ids);
		$this->db->order_by("payment_id", "asc");
		return $this->db->get();		
	}
	
	/*
	Inserts or updates a suppliers
	*/
	function save(&$payment_data,$payment_id=false)
	{
		$success=false;
		//Run these queries as a transaction, we want to make sure we do all or nothing
		//$this->db->trans_start();
		
		
			if (!$payment_id or !$this->exists($payment_id))
			{
				$success = $this->db->insert('payments',$payment_data);				
				//$payment_data['payment_id'] = $person_data['person_id'];
				$payment_data['payment_id']=$this->db->insert_id();
			}
			else
			{
				$this->db->where('payment_id', $payment_id);
				$success = $this->db->update('payments',$payment_data);
			}
			
		
		
		//$this->db->trans_complete();		
		return $success;
	}
	
	/*
	Deletes one supplier
	*/
	function delete($payment_id)
	{
		$this->db->where('payment_id', $payment_id);
		return $this->db->update('payments', array('deleted' => 1));
	}
	
	/*
	Deletes a list of suppliers
	*/
	function delete_list($payment_ids)
	{
		$this->db->where_in('payment_id',$payment_ids);
		return $this->db->update('payments', array('deleted' => 1));
 	}
 	
 	/*
	Get search suggestions to find suppliers
	*/
	function get_search_suggestions($search,$limit=25)
	{
		$suggestions = array();
		
		$this->db->from('payments');
		// $this->db->join('people','suppliers.person_id=people.person_id');	
		$this->db->where('deleted', 0);
		$this->db->like("payment_type",$search);
		$this->db->order_by("payment_type", "asc");		
		$by_payment_name = $this->db->get();
		foreach($by_payment_name->result() as $row)
		{
			$suggestions[]=$row->payment_type;		
		}
		//only return $limit suggestions
		if(count($suggestions > $limit))
		{
			$suggestions = array_slice($suggestions, 0,$limit);
		}
		return $suggestions;
	
	}
	
	/*
	Get search suggestions to find suppliers
	*/
	function get_payments_search_suggestions($search,$limit=25)
	{
		$suggestions = array();
		
		$this->db->from('payments');
		// $this->db->join('people','suppliers.person_id=people.person_id');	
		$this->db->where('deleted', 0);
		$this->db->like("payment_type",$search);
		$this->db->order_by("payment_type", "asc");		
		$by_payment_name = $this->db->get();
		foreach($by_payment_name->result() as $row)
		{
			$suggestions[]=$row->payment_id.'|'.$row->payment_type;		
		}
		//only return $limit suggestions
		if(count($suggestions > $limit))
		{
			$suggestions = array_slice($suggestions, 0,$limit);
		}
		return $suggestions;

	}
	/*
	Perform a search on suppliers
	*/
	function search($search)
	{
		$this->db->from('payments');
		// $this->db->join('people','suppliers.person_id=people.person_id');
		$this->db->where("payment_type LIKE '%".$this->db->escape_like_str($search)."%' and deleted=0");		
		$this->db->order_by("payment_type", "asc");
		
		return $this->db->get();	
	}

}
?>
