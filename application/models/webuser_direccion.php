<?php

/**
 * Permita realizar operaciones en la tabla phppos_direcciones
 */
class Webuser_direccion extends CI_Model{

    /**
     * Retorno todas las direcciones de un usuario
     * @param  [type] $user_id [description]
     * @param  [type] $tipo FACTURA|ENVIO
     * @return [type]          [description]
     */
    function get_by_user($user_id,$tipo="FACTURA"){
        $this->db->where('user_id',$user_id);
        $this->db->where('tipo',$tipo);
        $res = $this->db->get('phppos_direcciones')->row();
        return $res;
    }

    /**
     * Retorna una opinión de un producto
     * @param  [type] $direccion_id [description]
     * @return [type]           [description]
     */
    public function get_info($direccion_id)
    {
        $this->db->from('phppos_direcciones');
        $this->db->where('direccion_id',$direccion_id);
        return $this->db->get()->row();
    }

    /**
     * Verificar si un item existe
     * @param  [type] $direccion_id [description]
     * @return [type]            [description]
     */
	function exists($direccion_id){
		$this->db->where('direccion_id',$direccion_id);
		$res = $this->db->get('phppos_direcciones');

		return ($res->num_rows()==1);
	}

    /**
     * Inserta un registro en la bdd
     * @param  [type]  $data      [description]
     * @param  boolean $direccion_id [description]
     * @return [type]             [description]
     */
	function save($data,$direccion_id=false){
		if(!$direccion_id || !$this->exists($direccion_id)){
			if($this->db->insert('phppos_direcciones',$data))
				return array('error'=>FALSE,'ID'=>$this->db->insert_id());
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}else{
			$this->db->where('direccion_id',$direccion_id);
			if($this->db->update('phppos_direcciones',$data))
				return array('error'=>FALSE,'ID'=>$direccion_id);
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}
	}
}