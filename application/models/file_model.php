<?php

/**
 * Description of file_model
 *
 * @author Mario Torres
 */
class File_Model extends CI_Model {

    function insert($data, $id = -1) {
        $this->db->insert('files', $data);
        return $this->db->insert_id();
    }
    function delete($name) {
        $this->db->where('name',$name);
        return $this->db->delete('files');
    }
    function get_file_by_name($name) {
        $this->db->where('name',$name);
        return $this->db->get('files');
    }
    function get_all_by_item($id) {
        $this->db->where('item_id',$id);
        $result = $this->db->get('files');
//        echo $this->db->last_query();
        return $result;
        
        /*$sql = 'SELECT `id`, `type`, `title`, `description` FROM `'
                    . $this->options['db_table'] . '` WHERE `name`=?';
            $query = $this->db->prepare($sql);
            $query->bind_param('s', $file->name);
            $query->execute();
            $query->bind_result(
                    $id, $type, $title, $description
            );*/
    }

}
