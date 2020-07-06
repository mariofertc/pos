<?php

class Item extends CI_Model {
    /*
      Determines if a given item_id is an item
     */

    function exists($item_id) {
        //Bug php or mysql version, if it is char explicit convert to number.
        if (!is_numeric($item_id))
            return false;
        $this->db->from('items');
        $this->db->where('item_id', $item_id);
        $this->db->where('deleted', 0);
        $query = $this->db->get();
        return ($query->num_rows() == 1);
    }

    function exists_item_number($item_number, $item_id=null) {
        $this->db->from('items');
        $this->db->where('item_number', $item_number);
        if(!is_null($item_id))
            $this->db->where('item_id!=', $item_id);
        $this->db->where('deleted', 0);
        $query = $this->db->get();
        return ($query->num_rows() == 1);
    }

    function get_all($num = 0, $offset = 0, $where, $order = null,$where_in=null) {

        if ($order == null)
            $order = "name";
        //$this->db->select('id','nombre');
        $this->db->select('items.*,suppliers.company_name');
        $this->db->from('items');
        $this->db->join('suppliers', 'suppliers.person_id=items.supplier_id', 'left');
        //TODO: No se puede ya que devuelve una fila por cada ocurrencia en el almacen_item
        //$this->db->join('stock_almacenes', 'stock_almacenes.item_id=items.item_id', 'left');
        
//        $this->db->join('items_taxes', 'items_taxes.item_id=items.item_id', 'left');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('items.deleted', 0);
        if(!is_null($where_in))
            foreach ($where_in as $key => $value) {
                $this->db->where_in($key,$value);
            }
        $this->db->order_by($order);
        $this->db->limit($num, $offset);
        //Aumentar los stocks de las sucursales.
        $items = $this->db->get()->result_array();
        //var_dump($this->db->last_query());
        $almacenes = $this->Almacen->get_all();
        foreach ($items as &$item) {
            foreach ($almacenes as $almacen) {
                $id = "id" . $almacen['almacen_id'];
                $item[$id] = $this->Almacen_stock->get_cantidad($item['item_id'], $almacen['almacen_id']);
            }
            //Aumenta taxes
            $item_tax_info = $this->Item_taxes->get_info($item['item_id']);
            $tax_percents = '';
            foreach ($item_tax_info as $tax_info) {
                $tax_percents.=$tax_info['percent'] . '%, ';
            }
            $item['tax_percents'] = substr($tax_percents, 0, -2);
            $item['imagenes']=$this->file_model->get_all_by_item($item['item_id'])->result();
        }
        return $items;
    }

    function get_total($where = '') {
        $this->db->from('items');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        return $this->db->count_all_results();
    }

    /*
      Returns all the items
     */

    function get_all_old() {
        $this->db->from('items');
        $this->db->where('deleted', 0);
        $this->db->order_by("name", "asc");

        //Aumentar los stocks de las sucursales.
        $items = $this->db->get();
        $almacenes = $this->Almacen->get_all();

        foreach ($items->result() as $item) {
            foreach ($almacenes->result() as $almacen) {
                $id = "id" . $almacen->almacen_id;
                $item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
            }
        }
        return $items;
    }

    /*
      Returns all the items
     */

    function get_total_items() {
        $this->db->from('items');
        $this->db->join('suppliers', 'suppliers.person_id=items.supplier_id', 'left');
        $this->db->where('items.deleted', 0);
        $this->db->order_by("name", "asc");
        $result = $this->db->get();
        return $result->num_rows();
    }

    /**
     * Returns all the items
     * Deprecated
     */
    function get_all_prov() {
        $this->db->from('items');
        $this->db->join('suppliers', 'suppliers.person_id=items.supplier_id', 'left');
        $this->db->where('items.deleted', 0);
        $this->db->order_by("name", "asc");

        //Aumentar los stocks de las sucursales.
        $items = $this->db->get();
        $almacenes = $this->Almacen->get_all();

        foreach ($items->result() as $item) {
            foreach ($almacenes->result() as $almacen) {
                $id = "id" . $almacen->almacen_id;
                $item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
            }
        }
        // return $this->db->get();
        // var_dump($items);
        return $items;

        // return $this->db->get();
    }

    /*
      Returns all the items with limit
     */

    function get_all_limit($start_row, $limit) {
        $this->db->from('items', $start_row, $limit);
        $this->db->where('deleted', 0);
        $this->db->order_by("name", "asc");
        $this->db->limit($limit, $start_row);
        // $this->db->limit($start_row, $limit);
        //$this->db->limit(1, 5);
        return $this->db->get();
    }

    /*
      Returns all the items with limit
     */

    function get_all_limit_prov($start_row, $limit) {
        $this->db->from('items', $start_row, $limit);
        // $this->db->join('suppliers','suppliers.person_id=items.supplier_id','left');
        $this->db->join('suppliers', 'suppliers.person_id=items.supplier_id', 'left');
        $this->db->where('items.deleted', 0);
        $this->db->order_by("name", "asc");
        $this->db->limit($limit, $start_row);
        // $this->db->limit($start_row, $limit);
        //$this->db->limit(1, 5);
        //Aumentar los stocks de las sucursales.
        $items = $this->db->get();
        $almacenes = $this->Almacen->get_all();

        foreach ($items->result() as $item) {
            foreach ($almacenes->result() as $almacen) {
                $id = "id" . $almacen->almacen_id;
                $item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
            }
        }
        return $items;
    }

    function get_all_filtered($low_inventory = 0, $is_serialized = 0, $no_description, $almacen_id) {
        $this->db->from('items');
        $this->db->join('suppliers', 'suppliers.person_id=items.supplier_id', 'left');
        if ($almacen_id != '') {
            $this->db->join('stock_almacenes', 'stock_almacenes.item_id=items.item_id and phppos_stock_almacenes.almacen_id = ' . $almacen_id, 'right');
        }

        if ($low_inventory != 0) {
            $this->db->where('quantity <=', 'reorder_level');
        }
        if ($is_serialized != 0) {
            $this->db->where('is_serialized', 1);
        }
        if ($no_description != 0) {
            $this->db->where('description', '');
        }

        $this->db->where('items.deleted', 0);
        $this->db->order_by("name", "asc");

        //Aumentar los stocks de las sucursales.
        $items = $this->db->get();
        $almacenes = $this->Almacen->get_all();

        foreach ($items->result() as $item) {
            foreach ($almacenes as $almacen) {
                $id = "id" . $almacen['almacen_id'];
                $item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen['almacen_id']);
            }
        }
        return $items;
    }

    /**
     *  Gets information about a particular item
     * @param type $item_id
     * @return \stdClass
     */
    function get_info($item_id) {
        $this->db->from('items');
        $this->db->join('suppliers', 'suppliers.person_id=items.supplier_id', 'left');
        $this->db->where('item_id', $item_id);
        $this->db->where('items.deleted', 0);
        //$this->db->where('suppliers.deleted', 0);

        //Aumentar los stocks de las sucursales.
        $items = $this->db->get();
        $almacenes = $this->Almacen->get_all();

        foreach ($items->result() as $item) {
            foreach ($almacenes as $almacen) {
                $id = "id" . $almacen['almacen_id'];
                $item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen['almacen_id']);
            }
        }


        if ($items->num_rows() == 1) {
            return $items->row();
        } else {
            //Get empty base parent object, as $item_id is NOT an item
            $item_obj = new stdClass();

            //Get all the fields from items table
            $fields = $this->db->list_fields('items');

            foreach ($fields as $field) {
                $item_obj->$field = '';
            }

            return $item_obj;
        }
    }
    
    /**
     *  Gets stock about a particular item
     * @param type $item_id
     * @return \stdClass
     */
    function get_item_stock($item_id) {
        $this->db->from('items');
        $this->db->where('item_id', $item_id);
        $this->db->where('items.deleted', 0);

        //Aumentar los stocks de las sucursales.
        $items = $this->db->get();
        $almacenes = $this->Almacen->get_all();
        $stock = 0;

        foreach ($items->result() as $item) {
            foreach ($almacenes as $almacen) {
                $stock += $this->Almacen_stock->get_cantidad($item->item_id, $almacen['almacen_id']);
            }
        }
        return $stock;
    }
    
    /**
     *  Gets existens categories
     * @return int
     */
    function get_category() {
        $this->db->from('category');
        $this->db->where('deleted', 0);
        return $this->db->get();
    }

    /*
      Get an item id given an item number
     */

    function get_item_id($item_number) {
        $this->db->from('items');
        $this->db->where('item_number', $item_number);
        $this->db->where('deleted', 0);

        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row()->item_id;
        }

        return false;
    }
    
    function get_item_by($column, $item_value) {
        $this->db->from('items');
        $this->db->where($column, $item_value);
        $this->db->where('deleted', 0);

        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row();
        }
        if ($query->num_rows() > 1) {
            return $query->last_row();
        }

        return false;
    }

    /*
      Gets information about multiple items
     */

    function get_multiple_info($item_ids) {
        $this->db->from('items');
        $this->db->join('suppliers', 'suppliers.person_id=items.supplier_id', 'left');
        $this->db->where_in('item_id', $item_ids);
        $this->db->where('items.deleted', 0);
        // $this->db->order_by("yo", "asc");
        //Aumentar los stocks de las sucursales.
        $items = $this->db->get();
        $almacenes = $this->Almacen->get_all();

        foreach ($items->result() as $item) {
            foreach ($almacenes->result() as $almacen) {
                $id = "id" . $almacen->almacen_id;
                $item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
            }
        }
        return $items;
    }

    /*
      Inserts or updates a item
     */

    function save(&$item_data, $item_id = false) {
        if (!$item_id or ! $this->exists($item_id)) {
            if ($this->db->insert('items', $item_data)) {
                $item_data['item_id'] = $this->db->insert_id();
                return true;
            }
            return false;
        }

        $this->db->where('item_id', $item_id);
        if ($this->db->update('items', $item_data)) {
            //$item_data['item_id']=$this->db->update_id();
            return true;
        }
        return false;
    }

    /*
      Updates multiple items at once
     */

    function update_multiple($item_data, $item_ids) {
        $this->db->where_in('item_id', $item_ids);
        return $this->db->update('items', $item_data);
    }

    /*
      Deletes one item
     */

    function delete($item_id) {
        $this->db->where('item_id', $item_id);
        return $this->db->update('items', array('deleted' => 1));
    }

    /*
      Deletes a list of items
     */

    function delete_list($item_ids) {
        $this->db->where_in('item_id', $item_ids);
        return $this->db->update('items', array('deleted' => 1));
    }

    /*
      Get search suggestions to find items
     */

    function get_search_suggestions($search, $limit = 25) {
        $suggestions = array();

        $this->db->from('items');
        $this->db->like('name', $search);
        $this->db->where('deleted', 0);
        $this->db->order_by("name", "asc");
        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            $suggestions[] = $row->name;
        }

        $this->db->select('category');
        $this->db->from('items');
        $this->db->where('deleted', 0);
        $this->db->distinct();
        $this->db->like('category', $search);
        $this->db->order_by("category", "asc");
        $by_category = $this->db->get();
        foreach ($by_category->result() as $row) {
            $suggestions[] = $row->category;
        }

        $this->db->from('items');
        $this->db->like('item_number', $search);
        $this->db->where('deleted', 0);
        $this->db->order_by("item_number", "asc");
        $by_item_number = $this->db->get();
        foreach ($by_item_number->result() as $row) {
            $suggestions[] = $row->item_number;
        }


        //only return $limit suggestions
        if (count($suggestions > $limit)) {
            $suggestions = array_slice($suggestions, 0, $limit);
        }
        return $suggestions;
    }

    function get_item_search_suggestions($search, $limit = 25) {
        $suggestions = array();

        $this->db->from('items');
        $this->db->where('deleted', 0);
        $this->db->like('name', $search);
        $this->db->order_by("name", "asc");
        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            $suggestions[] = $row->item_id . '|' . $row->name;
        }

        $this->db->from('items');
        $this->db->where('deleted', 0);
        $this->db->like('item_number', $search);
        $this->db->order_by("item_number", "asc");
        $by_item_number = $this->db->get();
        foreach ($by_item_number->result() as $row) {
            $suggestions[] = $row->item_id . '|' . $row->item_number;
            //$suggestions[]=$row->item_id.'|'.$row->name;
        }

        //only return $limit suggestions
        if (count($suggestions) > $limit) {
            $suggestions = array_slice($suggestions, 0, $limit);
        }
        return $suggestions;
    }

    function get_category_suggestions($search) {
        $suggestions = array();
        $this->db->distinct();
        $this->db->select('category');
        $this->db->from('items');
        $this->db->like('category', $search);
        $this->db->where('deleted', 0);
        $this->db->order_by("category", "asc");
        $by_category = $this->db->get();
        foreach ($by_category->result() as $row) {
            $suggestions[] = $row->category;
        }

        return $suggestions;
    }
    
    function get_suggestions($search,$by) {
        $suggestions = array();
        $this->db->distinct();
        $this->db->select($by);
        $this->db->from('items');
        $this->db->like($by, $search);
        $this->db->where('deleted', 0);
        $this->db->order_by($by, "asc");
        $by_category = $this->db->get();
        foreach ($by_category->result() as $row) {
            $suggestions[] = $row->$by;
        }
        return $suggestions;
    }

    /*
      Preform a search on items
     */

    function search($search) {
        $this->db->from('items');
        $this->db->join('suppliers', 'suppliers.person_id=items.supplier_id', 'left');
        $this->db->where("(name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		item_number LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		category LIKE '%" . $this->db->escape_like_str($search) . "%') and phppos_items.deleted=0");
        $this->db->order_by("name", "asc");

        //Aumentar los stocks de las sucursales.
        $items = $this->db->get();
        $almacenes = $this->Almacen->get_all();

        foreach ($items->result() as $item) {
            foreach ($almacenes->result() as $almacen) {
                $id = "id" . $almacen->almacen_id;
                $item->$id = $this->Almacen_stock->get_cantidad($item->item_id, $almacen->almacen_id);
            }
        }
        return $items;
    }

    /**
     * Retorna el nombre y el numero de elementos agrupados por la columna requerida
     * @param  string  $columna       Nombre de la columna a agrupar
     * @param  integer $num           Numero de elementos
     * @param  integer $offset        Saltarse cuantos
     * @param  string  $columna_orden Ordena por esta columna
     * @return array                 [description]
     */
    function get_count_column($columna="category",$num=10,$offset=0,$columna_orden="total", $where = null) {
        $this->db->select($columna.' as filtro, count(*) as total');
        $this->db->from('items');
        $this->db->where('deleted', 0);
        if($where !== null)
            $this->db->where($where);
        $this->db->limit($num,$offset);
        $this->db->group_by($columna);
        $this->db->order_by($columna_orden, "desc");

        return $this->db->get();
    }

    /**
     * [get_tags description]
     * @return [type] [description]
     */
    function get_tags($where = null){
        $this->db->select('tags');
        $this->db->from('items');
        $this->db->where('deleted',0);
        if($where !== null)
            $this->db->where($where);
        
        $this->db->group_by('tags');
        $this->db->order_by('tags',"desc");

        $resultado = $this->db->get()->result_array();
        $tags=array();
        foreach ($resultado as $key => $value) {
            $tag=explode(",", trim($value['tags']));
            if(!empty($tag))
                if(!isset($tags[$tag[0]]))
                    $tags[$tag[0]]=array();
                if(isset($tag[1]))
                    array_push($tags[$tag[0]],$tag[1] );
            
        }
        return $tags;
    }

    function get_categories() {
        $this->db->select('category');
        $this->db->from('items');
        $this->db->where('deleted', 0);
        $this->db->distinct();
        $this->db->order_by("category", "asc");

        return $this->db->get();
    }

    function get_almacen($item_id) {
        $this->db->from('items');
        $this->db->join('almacenes', 'almacenes.almacen_id=items.almacen_id', 'left');
        $this->db->where('item_id', $item_id);
        $this->db->where('items.deleted', 0);

        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row();
        } else {
            return null;
        }
    }

    function get_almacenes($item_id, $almacen_id) {
        $this->db->from('items');
        $this->db->join('stock_almacenes', 'stock_almacenes.item_id=items.item_id', 'left');
        $this->db->join('almacenes', 'almacenes.almacen_id=stock_almacenes.almacen_id', 'left');
        $this->db->where('stock_almacenes.item_id', $item_id);
        $this->db->where('stock_almacenes.almacen_id', $almacen_id);
        $this->db->where('items.deleted', 0);

        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row();
        } else {
            return null;
        }
    }

    /**
     * Devuelve un array con el precio minimo y maximo de todos los productos
     * @return [type] [description]
     */
    function get_limites_precios(){
        $this->db->select('min(unit_price) as minimo,max(unit_price) as maximo');
        $this->db->from('items');
        $this->db->where('deleted', 0);

        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            //$query->row()->maximo=round($query->row()->maximo,0);
            //$query->row()->minimo=round($query->row()->minimo,0);
            $query->row()->maximo=ceil($query->row()->maximo);
            $query->row()->minimo=floor($query->row()->minimo);
            return $query->row();
        } else {
            return null;
        }

    }

    function get_details($item_id){
        $this->db->from('phppos_inventory');
        $this->db->join('phppos_people','trans_user = person_id');

        $this->db->where('trans_items', $item_id);
        $this->db->order_by("trans_date", "desc");
        return $this->db->get()->result();
//         $trans_items_id = $item_info->item_id;
// $query=mysql_query("select * from  where ='" .$trans_items_id. "' ORDER BY trans_date DESC" );
    }
}
