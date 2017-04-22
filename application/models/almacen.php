<?php

class Almacen extends CI_Model {
    /*
      Determines if a given person_id is a customer
     */

    function exists($almacen_id) {
        $this->db->from('almacenes');
        $this->db->where('deleted', 0);
        $this->db->where('almacenes.almacen_id', $almacen_id);
        $query = $this->db->get();

        return ($query->num_rows() == 1);
    }

    /*
      Returns all the almacenes
     */

    function get_all($num = 10, $offset = 0, $where = "", $order = null) {
        $this->db->from('almacenes');
        if ($order == null)
            $order = "nombre";

        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        $this->db->order_by($order);
        $this->db->limit($num, $offset);
//        $this->db->order_by("nombre", "asc");
        return $this->db->get()->result_array();
    }
     function get_total($where='') {
        $this->db->from('almacenes');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        return $this->db->count_all_results();
    }

    function get_all_id() {
        $almacenes = array();
        foreach ($this->get_all() as $row) {
            $almacenes[$row['almacen_id']] = $row['nombre'];
        }
        return $almacenes;
    }

    /*
      Gets information about a particular supplier
     */

    function get_info($almacen_id) {
        $this->db->from('almacenes');
        $this->db->where('deleted', 0);
        $this->db->where('almacenes.almacen_id', $almacen_id);
        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row();
        } else {
            //Get empty base parent object, as $supplier_id is NOT an supplier
            //create object with empty properties.
            $fields = $this->db->list_fields('almacenes');
            $almacen_obj = new stdClass;

            foreach ($fields as $field) {
                $almacen_obj->$field = '';
            }
            $almacen_obj->almacen_id = -1;
            return $almacen_obj;
        }
    }

    /**
     * Devuelve el primer almacen registrado
     * @return StdClass Almacen
     */
    function get_first() {
        foreach ($this->get_all() as $almacen) {
            return (object)$almacen;
            //return $almacen;
        }
            //return $almacen;
        return null;
    }

    /*
      Inserts or updates a almacenes
     */

    function save(&$almacen_data, $almacen_id = false) {
        $success = false;
        //Run these queries as a transaction, we want to make sure we do all or nothing
        $this->db->trans_start();


        if (!$almacen_id or ! $this->exists($almacen_id)) {
            $success = $this->db->insert('almacenes', $almacen_data);
        } else {
            $this->db->where('almacen_id', $almacen_id);
            $success = $this->db->update('almacenes', $almacen_data);
        }


        $this->db->trans_complete();
        return $success;
    }

    /*
      Deletes one supplier
     */

    function delete($almacen_id) {
        $this->db->where('almacen_id', $almacen_id);
        return $this->db->update('almacenes', array('deleted' => 1));
    }

    function delete_list($almacen_ids) {
        $this->db->where_in('almacen_id', $almacen_ids);
        return $this->db->update('almacenes', array('deleted' => 1));
    }

    function search($search) {
        $this->db->from('almacenes');
        $this->db->where("(nombre LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		direccion LIKE '%" . $this->db->escape_like_str($search) . "%') and deleted=0");
        $this->db->order_by("nombre", "asc");

        return $this->db->get();
    }

    function get_search_suggestions($search, $limit = 25) {
        $suggestions = array();

        $this->db->from('almacenes');
        $this->db->where('deleted', 0);
        $this->db->like("nombre", $search);
        $this->db->order_by("nombre", "asc");
        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            $suggestions[] = $row->nombre;
        }


        $this->db->from('almacenes');
        $this->db->where("(direccion LIKE '%" . $this->db->escape_like_str($search) . "%') and deleted=0");
        $this->db->order_by("direccion", "asc");
        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            $suggestions[] = $row->direccion;
        }
        $this->db->order_by("account_number", "asc");

        //only return $limit suggestions
        if (count($suggestions > $limit)) {
            $suggestions = array_slice($suggestions, 0, $limit);
        }
        return $suggestions;
    }

    /*
      Get search suggestions to find suppliers
     */

    function get_almacenes_search_suggestions($search, $limit = 25) {
        $suggestions = array();

        $this->db->from('almacenes');
        $this->db->where('deleted', 0);
        $this->db->like("nombre", $search);
        $this->db->order_by("nombre", "asc");
        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            $suggestions[] = $row->nombre;
        }


        $this->db->from('almacenes');
        $this->db->where("(direccion LIKE '%" . $this->db->escape_like_str($search) . "%') and deleted=0");
        $this->db->order_by("direccion", "asc");
        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            $suggestions[] = $row->direccion;
        }
        $this->db->order_by("account_number", "asc");

        //only return $limit suggestions
        if (count($suggestions > $limit)) {
            $suggestions = array_slice($suggestions, 0, $limit);
        }
        return $suggestions;
    }
}