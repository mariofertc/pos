<?php
class Orden extends CI_Model 
{	

    /**
     * Retorna un listado de ordenes de compra enviadas a paypal
     * @param  integer $num    [description]
     * @param  integer $offset [description]
     * @param  string  $where  [description]
     * @param  [type]  $order  [description]
     * @return [array]          Array de ordenes
     */
    function get_all($num = 10, $offset = 0, $where = "", $order = null) {
        if ($order == null)
            $order = "P.fecha_creacion";
        $this->db->select('order_id , W.nombre as usuario , payment_id , estado , valor , descripcion, P.fecha_creacion');
        $this->db->from('paypal P');
        $this->db->join('webusers W', 'P.user_id=W.user_id');
        if ($where != "")
            $this->db->where($where);
        $this->db->order_by($order);
        $this->db->limit($num, $offset);

        return $this->db->get()->result_array();
    }
    
    /**
     * Retorna el numero total de ordenes de compra
     * @param  string $where Filtros
     * @return [integer]        [Total de ordenes]
     */
    function get_total($where='') {
        $this->db->from('paypal');
        if ($where != "")
            $this->db->where($where);
        return $this->db->count_all_results();
    }

	function get_items_by_user($user_id){
		$this->db->where('user_id',$user_id);
		$res = $this->db->get('paypal')->result();
		return $res;
	}

	/**
	 * Retorna una orden de paypal
	 * @param  [type] $orden_id [description]
	 * @return [type]           [description]
	 */
	public function get_info($orden_id)
	{
		$this->db->from('paypal');
		$this->db->where('order_id',$orden_id);
		return $this->db->get()->row();
	}


	/**
	 * Verifica si una orden existe
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	function exists($orden_id){
		echo $orden_id;
		$this->db->where('order_id',$orden_id);
		$res = $this->db->get('paypal');

		return ($res->num_rows()==1);
	}

	/**
	 * Inserta o actualiza una orden de paypal
	 * @param  [array] $data [Info del item]
	 * @return [array]       {error:true/false,ID:}
	 */
	function save($data,$order_id=false){

		if(!$order_id || !$this->exists($order_id)){
			if($this->db->insert('paypal',$data))
				return array('error'=>FALSE,'ID'=>$this->db->insert_id());
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}else{
			$this->db->where('order_id',$order_id);
			if($this->db->update('paypal',$data))
				return array('error'=>FALSE,'ID'=>$order_id);
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}
	}

 }