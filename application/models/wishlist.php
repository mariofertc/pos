<?php
class Wishlist extends CI_Model 
{	

	function get_items_by_user($user_id){
		$this->db->where('user_id',$user_id);
		$res = $this->db->get('wishlist')->result();
		$productos = array();
		foreach ($res as $key => $item) {
			$producto = $this->Item->get_info($item->item_id);
			$producto->wlist_id=$item->wlist_id;
			$productos[]=$producto;
		}
		return $productos;
	}

	/**
	 * Verifica si un producto ya esta en  la lista de deseos
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	function exists($data){
		$this->db->where('user_id',$data['user_id']);
		$this->db->where('item_id',$data['item_id']);
		$res = $this->db->get('wishlist');

		return ($res->num_rows()==1);
	}

	/**
	 * Inserta o actualiza un elemento de la lista de deseos
	 * @param  [array] $data [Info del item]
	 * @return [array]       {error:true/false,ID:}
	 */
	function save($data){

		if(!$this->exists($data)){
			if($this->db->insert('wishlist',$data))
				return array('error'=>FALSE,'ID'=>$this->db->insert_id());
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}else{
			$this->db->where('user_id',$data['user_id']);
			$this->db->where('item_id',$data['item_id']);
			if($this->db->update('wishlist',$data))
				return array('error'=>FALSE,'ID'=>$data['item_id']);
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}
	}

	/**
	 * Elimina un elemento de la lista de deseos
	 * @param  [type] $wlist_id [Clave primaria]
	 * @return [type]          [description]
	 */
	function delete($wlist_id)
	{
		$this->db->where('wlist_id', $wlist_id);
		return $this->db->delete('wishlist');
	}
	

 }