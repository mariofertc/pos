<?php

/**
 * Permita realizar operaciones en la tabla phppos_webusers
 */
class Webuser extends CI_Model{

	function exists($user_id){
		$this->db->where('user_id',$user_id);
		$res = $this->db->get('webusers');

		return ($res->num_rows()==1);
	}

	function save($data,$user_id=false){

		if(!$user_id || !$this->exists($user_id)){
			if($this->db->insert('webusers',$data))
				return array('error'=>FALSE,'ID'=>$this->db->insert_id());
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}else{
			$this->db->where('user_id',$user_id);
			if($this->db->update('webusers',$data))
				return array('error'=>FALSE,'ID'=>$user_id);
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}
	}

	/**
     * Verifica si los datos de un comprados son correctos
     * @param  [string] $username [Nombre de usuario/EMAIL]
     * @param  [string] $password [Password]
     * @return [boolean]         [TRUE/FALSE]
     */
    function login($username, $password)
    {
        $query = $this->db->get_where('webusers', array('email' => $username,'password'=>md5($password)), 1);
        if ($query->num_rows() ==1)
        {
            $row=$query->row();
            $this->session->set_userdata('webuser_data', $row);
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Verifica si las variables de sesión de un WebUser estan seteadas
     * @return boolean true/false
     */
	function is_logged()
	{
		$userdata = $this->session->userdata('webuser_data');
		return !is_null($userdata);
	}
}