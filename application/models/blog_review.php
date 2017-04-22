<?php

/**
 * Permita realizar operaciones en la tabla phppos_blog_reviews
 */
class Blog_review extends CI_Model{

    /**
     * Retorno todas las opiniones de un articulo
     * @param  [type] $articulo_id [description]
     * @return [type]          [description]
     */
    function get_by_articulo($articulo_id){
        $this->db->where('articulo',$articulo_id);
        $res = $this->db->get('phppos_blog_reviews')->result();
        return $res;
    }

    /**
     * Retorna una opinión de un articulo
     * @param  [type] $review_id [description]
     * @return [type]           [description]
     */
    public function get_info($review_id)
    {
        $this->db->from('phppos_blog_reviews');
        $this->db->where('review_id',$review_id);
        return $this->db->get()->row();
    }

    /**
     * Verificar si una entrada existe
     * @param  [type] $review_id [description]
     * @return [type]            [description]
     */
	function exists($review_id){
		$this->db->where('review_id',$review_id);
		$res = $this->db->get('phppos_blog_reviews');

		return ($res->num_rows()==1);
	}

    /**
     * Inserta un registro en la bdd
     * @param  [type]  $data      [description]
     * @param  boolean $review_id [description]
     * @return [type]             [description]
     */
	function save($data,$review_id=false){
		if(!$review_id || !$this->exists($review_id)){
			if($this->db->insert('phppos_blog_reviews',$data))
				return array('error'=>FALSE,'ID'=>$this->db->insert_id());
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}else{
			$this->db->where('review_id',$review_id);
			if($this->db->update('phppos_blog_reviews',$data))
				return array('error'=>FALSE,'ID'=>$review_id);
			else
				return array('error'=>TRUE,'msg'=>$this->db->_error_message(),'code'=>$this->db->_error_number());
		}
	}
}