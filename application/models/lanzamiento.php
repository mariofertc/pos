<?php

class Lanzamiento extends CI_Model {

    /**
     * Verifica si un lanzamiento ya existe
     * @param  [type] $lanzamiento_id [description]
     * @return [type]                 [description]
     */
    function exists($lanzamiento_id) {
        $this->db->from('lanzamientos');
        $this->db->where('deleted', 0);
        $this->db->where('lanzamiento_id', $lanzamiento_id);
        $query = $this->db->get();

        return ($query->num_rows() == 1);
    }

    /**
     * Devuelve un array de lanzamientos
     * @param  integer $num    [description]
     * @param  integer $offset [description]
     * @param  string  $where  [description]
     * @param  [type]  $order  [description]
     * @return [type]          [description]
     */
    function get_all($num = 10, $offset = 0, $where= "", $order = null) {
        if ($order == null)
            $order = "fecha";
        $this->db->from('lanzamientos');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        $this->db->order_by($order);
        $this->db->limit($num, $offset);
        return $this->db->get()->result_array();
    }

    /**
     * Devuelve los ultimos lanzamientos 
     * @param  integer $num número de lanzmientos
     * @return array      [description]
     */
    function get_ultimos($num=5){
        $this->db->from('lanzamientos');
        $this->db->order_by('fecha','desc');
        $this->db->limit($num);
        $resultado = $this->db->get()->result_array();
        foreach ($resultado as $key => $lanzamiento) {
            $resultado[$key]['imagenes']=$this->file_model->get_all_by_item($lanzamiento['lanzamiento_id'])->result();
            $resultado[$key]['producto']=$this->Item->get_info($lanzamiento['item_id']);
        }
        return $resultado;
    }
    /**
     * Devuelve el total de lanzamientos
     * @param  string $where [description]
     * @return [type]        [description]
     */
    function get_total($where='') {
        $this->db->from('lanzamientos');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        return $this->db->count_all_results();
    }

    /**
     * Devuelve información de un lanzamiento
     * @param  [type] $lanzamiento_id [description]
     * @return [type]              [description]
     */
    function get_info($lanzamiento_id) {
        $this->db->from('lanzamientos');
        $this->db->where('deleted', 0);
        $this->db->where('lanzamiento_id', $lanzamiento_id);
        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row();
        } else {
            $person_obj = new StdClass();
            $fields = $this->db->list_fields('lanzamientos');
            foreach ($fields as $field) {
                $person_obj->$field = '';
            }
            return $person_obj;
        }
    }

    /**
     * Ingresa un lanzamiento
     * @param  [type]  &$lanzamiento_data [description]
     * @param  boolean $lanzamiento_id    [description]
     * @return [type]              [description]
     */
    function save(&$lanzamiento_data, $lanzamiento_id = false) {
        if (!$lanzamiento_id or ! $this->exists($lanzamiento_id)) {
            if ($this->db->insert('lanzamientos', $lanzamiento_data)) {
                $lanzamiento_data['lanzamiento_id'] = $this->db->insert_id();
                return true;
            }
            return false;
        }

        $this->db->where('lanzamiento_id', $lanzamiento_id);
        if ($this->db->update('lanzamientos', $lanzamiento_data)) {
            return true;
        }
        return false;
    }

    /**
     * Borrado lógico de un lanzamiento
     * @param  [type] $lanzamiento_id [description]
     * @return [type]              [description]
     */
    function delete($lanzamiento_id) {
        $this->db->where('lanzamiento_id', $lanzamiento_id);
        return $this->db->update('lanzamientos', array('deleted' => 1));
    }

    /**
     * Borrado lógico de varios lanzamiento
     * @param  [type] $lanzamientos_ids [description]
     * @return [type]               [description]
     */
    function delete_list($lanzamientos_ids) {
        $this->db->where_in('lanzamiento_id', $lanzamientos_ids);
        return $this->db->update('lanzamientos', array('deleted' => 1));
    }

}