<?php
class Sessions extends CI_Model
{
	public function get_all(){
		$query = $this->db->get('sessions');
		return $query->result();
	}
}