<?php

class Articulo_blog extends CI_Model {

    /**
     * Verifica si un articulo ya existe
     * @param  [type] $articulo_id [description]
     * @return [type]                 [description]
     */
    function exists($articulo_id) {
        $this->db->from('articulo_blog');
        $this->db->where('deleted', 0);
        $this->db->where('articulo_id', $articulo_id);
        $query = $this->db->get();

        return ($query->num_rows() == 1);
    }

    /**
     * Devuelve un array de articulos
     * @param  integer $num    [description]
     * @param  integer $offset [description]
     * @param  string  $where  [description]
     * @param  [type]  $order  [description]
     * @return [type]          [description]
     */
    function get_all($num = 10, $offset = 0, $where= "", $order = null) {
        if ($order == null)
            $order = "fecha";
        $this->db->from('articulo_blog');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        $this->db->order_by($order);
        $this->db->limit($num, $offset);
        return $this->db->get()->result_array();
    }

    /**
     * Devuelve los ultimos articulos 
     * @param  integer $num número de lanzmientos
     * @return array      [description]
     */
    function get_ultimos($num=5){
        $this->db->from('articulo_blog');
        $this->db->order_by('fecha','desc');
        $this->db->limit($num);
        $resultado = $this->db->get()->result_array();
        foreach ($resultado as $key => $articulo) {
            $resultado[$key]['imagenes']=$this->file_model->get_all(
                array(
                    'item_id'=>$articulo['articulo_id'],
                    'controller'=> 'blog'
                ))->result();
        }
        return $resultado;
    }
    /**
     * Devuelve el total de articulos
     * @param  string $where [description]
     * @return [type]        [description]
     */
    function get_total($where='') {
        $this->db->from('articulo_blog');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        return $this->db->count_all_results();
    }

    /**
     * Devuelve información de un articulo
     * @param  [type] $articulo_id [description]
     * @return [type]              [description]
     */
    function get_info($articulo_id) {
        $this->db->from('articulo_blog');
        $this->db->where('deleted', 0);
        $this->db->where('articulo_id', $articulo_id);
        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row();
        } else {
            $person_obj = new StdClass();
            $fields = $this->db->list_fields('articulo_blog');
            foreach ($fields as $field) {
                $person_obj->$field = '';
            }
            return $person_obj;
        }
    }

    /**
     * Ingresa un articulo
     * @param  [type]  &$articulo_data [description]
     * @param  boolean $articulo_id    [description]
     * @return [type]              [description]
     */
    function save(&$articulo_data, $articulo_id = false) {
        if (!$articulo_id or ! $this->exists($articulo_id)) {
            if ($this->db->insert('articulo_blog', $articulo_data)) {
                $articulo_data['articulo_id'] = $this->db->insert_id();
                return true;
            }
            return false;
        }

        $this->db->where('articulo_id', $articulo_id);
        if ($this->db->update('articulo_blog', $articulo_data)) {
            return true;
        }
        return false;
    }

    /**
     * Borrado lógico de un articulo
     * @param  [type] $articulo_id [description]
     * @return [type]              [description]
     */
    function delete($articulo_id) {
        $this->db->where('articulo_id', $articulo_id);
        return $this->db->update('articulo_blog', array('deleted' => 1));
    }

    /**
     * Borrado lógico de varios articulo
     * @param  [type] $articulos_ids [description]
     * @return [type]               [description]
     */
    function delete_list($articulos_ids) {
        $this->db->where_in('articulo_id', $articulos_ids);
        return $this->db->update('articulo_blog', array('deleted' => 1));
    }

}