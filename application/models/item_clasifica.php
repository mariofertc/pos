<?php

class Item_Clasifica extends CI_Model {

    function exists($id) {
        //Bug php or mysql version, if it is char explicit convert to number.
        if (!is_numeric($id))
            return false;
        $this->db->from('items_category');
        $this->db->where('item_category_id', $id);
        $this->db->where('deleted', 0);
        $query = $this->db->get();
        return ($query->num_rows() == 1);
    }
    
    function get_all($num = 10, $offset = 0, $where, $order = null) {
        if ($order == null)
            $order = "items_category.name";
        $this->db->select('items_category.*');
        $this->db->from('items_category');
        $this->db->join('items', 'items.item_id=items_category.item_id');
        $this->db->join('category', 'items_category.category_id=category.category_id');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('items_category.deleted', 0);
        $this->db->order_by($order);
        $this->db->limit($num, $offset);
        return $this->db->get()->result_array();
    }

    function get_total($where = '') {
        $this->db->from('items_category');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        return $this->db->count_all_results();
    }

    function save(&$data, $id = false) {
        if (!$id or ! $this->exists($id)) {
            if ($this->db->insert('items_category', $data)) {
                $data['item_category_id'] = $this->db->insert_id();
                return true;
            }
            return false;
        }
        $this->db->where('item_category_id', $id);
        if ($this->db->update('items_category', $data)) {
            return true;
        }
        return false;
    }

    /*
      Deletes one item
     */

    function delete($item_id,$category_id) {
        $this->db->where('item_category_id', $category_id);
        return $this->db->update('items_category', array('deleted' => 1));
    }
    function delete_not($item_category_id) {
        $this->db->where_not_in('item_category_id', $item_category_id);
        $response = $this->db->update('items_category', array('deleted' => 1));
        //echo $this->db->last_query();
        return $response;
    }

}
