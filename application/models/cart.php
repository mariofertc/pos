<?php
class Cart extends CI_Model 
{	


	function get_items_by_user($user_id){
		$this->db->where('user_id',$user_id);
		$res = $this->db->get('cart')->result();
		$productos = array();
		foreach ($res as $key => $item) {
			$producto = $this->Item->get_info($item->item_id);
			$producto->cart_id=$item->cart_id;
			$producto->cantidad=$item->cantidad;
			$productos[]=$producto;
		}
		return $productos;
	}

	/**
	 * Verifica si un producto ya esta en el carrito
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	function exists($data){
		$this->db->where('user_id',$data['user_id']);
		$this->db->where('item_id',$data['item_id']);
		$res = $this->db->get('cart');

		return ($res->num_rows()==1);
	}

	/**
	 * Inserta o actualiza un elemento del carrito
	 * @param  [array] $data [Info del item]
	 * @return [array]       {error:true/false,ID:}
	 */
	function save($data){

		if(!$this->exists($data)){
			if($this->db->insert('cart',$data))
				return array('error'=>FALSE,'ID'=>$this->db->insert_id());
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}else{
			$this->db->where('user_id',$data['user_id']);
			$this->db->where('item_id',$data['item_id']);
			if($this->db->update('cart',$data))
				return array('error'=>FALSE,'ID'=>$data['item_id']);
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}
	}

	/**
	 * Elimina un elemento del carrito
	 * @param  [type] $cart_id [Clave primaria]
	 * @return [type]          [description]
	 */
	function delete($cart_id)
	{
		$this->db->where('cart_id', $cart_id);
		return $this->db->delete('cart');
	}
	
	/**
	 * Elimina los elementos del carrito que le pertenecen a usuario
	 * @param  [type] $user_id [Clave primaria del usuario]
	 * @return [type]          [description]
	 */
	function delete_by_user($user_id)
	{
		$this->db->where('user_id', $user_id);
		return $this->db->delete('cart');
	}

 }