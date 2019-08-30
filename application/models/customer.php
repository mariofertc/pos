<?php

class Customer extends Person {
    /*
      Determines if a given person_id is a customer
     */

    function exists($person_id) {
        $this->db->from('customers');
        $this->db->join('people', 'people.person_id = customers.person_id');
        $this->db->where('customers.person_id', $person_id);
        $this->db->where('deleted', 0);
        $query = $this->db->get();
        return ($query->num_rows() == 1);
    }

    /**
     * Verifica si un username ya esta registrado con algun usuario
     * @param  string $username username a verificar
     * @return boolean        TRUE/FALSE
     */
    function check_username($username){
        $this->db->where('username',$username);
        $res = $this->db->get('customers');
        return ($res->num_rows()==1);
    }

    /*
      Returns all the customers
     */

    function get_all_old() {
        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        $this->db->where('deleted', 0);
        $this->db->order_by("last_name", "asc");
        return $this->db->get();
    }

    /*
      Returns all the customers
     */
    function get_all($num = 10, $offset = 0, $where = "", $order = null) {
        if ($order == null)
            $order = "last_name";
        //$this->db->select('id','nombre');
        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        $this->db->order_by($order);
        $this->db->limit($num, $offset);

        return $this->db->get()->result_array();
    }
    
    function get_total($where='') {
        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        return $this->db->count_all_results();
    }

    /*
      Gets information about a particular customer
     */

    function get_info($customer_id) {
        $this->db->start_cache();
        $this->db->from('customers');
        $this->db->join('people', 'people.person_id = customers.person_id');
        $this->db->where('deleted', 0);
        $this->db->stop_cache();
        $this->db->where('customers.person_id', $customer_id);
        $query = $this->db->get();
        if ($query->num_rows() == 0) {
            $this->db->where('zip', $customer_id);
            $query = $this->db->get();
        }
        $this->db->flush_cache();

        if ($query->num_rows() == 1) {
            return $query->row();
        } else {
            //Get empty base parent object, as $customer_id is NOT an customer
            $person_obj = parent::get_info(-1);

            //Get all the fields from customer table
            $fields = $this->db->list_fields('customers');

            //append those fields to base parent object, we we have a complete empty object
            foreach ($fields as $field) {
                $person_obj->$field = '';
            }

            return $person_obj;
        }
    }

    /**
     * Devuelve un objeto con la info de un customer con el id de un webuser
     * @param  [type] $webuser_id [description]
     * @return [type]             [description]
     */
    function get_info_by_webuserId($webuser_id) {
        $this->db->from('customers C');
        $this->db->join('people P', 'P.person_id = C.person_id');
        $this->db->join('webusers W', 'W.customer_id = P.person_id');
        $this->db->where('C.deleted', 0);
        $this->db->where('W.user_id', $webuser_id);
        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row();
        } else {
            //Get empty base parent object, as $customer_id is NOT an customer
            $person_obj = parent::get_info(-1);

            //Get all the fields from customer table
            $fields = $this->db->list_fields('customers');

            //append those fields to base parent object, we we have a complete empty object
            foreach ($fields as $field) {
                $person_obj->$field = '';
            }

            return $person_obj;
        }
    }

    /*
      Gets information about multiple customers
     */

    function get_multiple_info($customer_ids) {
        $this->db->from('customers');
        $this->db->join('people', 'people.person_id = customers.person_id');
        $this->db->where('deleted', 0);
        $this->db->where_in('customers.person_id', $customer_ids);
        $this->db->order_by("last_name", "asc");
        return $this->db->get();
    }

    /*
      Coje el Id del Proveedor, con el # de cuenta
     */

    function get_customer_id($account_number) {
        $this->db->from('customers');
        $this->db->where('account_number', $account_number);
        $this->db->where('deleted', 0);

        $query = $this->db->get();

        if ($query->num_rows() == 1) {
            return $query->row()->person_id;
        }

        return false;
    }

    /*
      Inserts or updates a customer
     */

    function save(&$person_data, &$customer_data = false, &$customer_id = false,$d=false) {
		//list($$person_data, $customer_data, $customer_id) = func_get_args();
        $success = false;
        //Run these queries as a transaction, we want to make sure we do all or nothing
        $this->db->trans_start();

        if (parent::save($person_data, $customer_id)) {
            if (!$customer_id or ! $this->exists($customer_id)) {
                $customer_data['person_id'] = $person_data['person_id'];
                $success = $this->db->insert('customers', $customer_data);
            } else {
                $this->db->where('person_id', $customer_id);
                $success = $this->db->update('customers', $customer_data);
            }
        }

        $this->db->trans_complete();
        return $success;
    }

    /*
      Deletes one customer
     */

    function delete($customer_id) {
        $this->db->where('person_id', $customer_id);
        return $this->db->update('customers', array('deleted' => 1));
    }

    /*
      Deletes a list of customers
     */

    function delete_list($customer_ids) {
        $this->db->where_in('person_id', $customer_ids);
        return $this->db->update('customers', array('deleted' => 1));
    }

    /*
      Get search suggestions to find customers
     */

    function get_search_suggestions($search, $limit = 25) {
        $suggestions = array();

        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        $this->db->where("(first_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		last_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		CONCAT(`first_name`,' ',`last_name`) LIKE '%" . $this->db->escape_like_str($search) . "%') and deleted=0");
        $this->db->order_by("last_name", "asc");
        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            $suggestions[] = $row->first_name . ' ' . $row->last_name;
        }

        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        $this->db->where('deleted', 0);
        $this->db->like("email", $search);
        $this->db->order_by("email", "asc");
        $by_email = $this->db->get();
        foreach ($by_email->result() as $row) {
            $suggestions[] = $row->email;
        }

        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        $this->db->where('deleted', 0);
        $this->db->like("phone_number", $search);
        $this->db->order_by("phone_number", "asc");
        $by_phone = $this->db->get();
        foreach ($by_phone->result() as $row) {
            $suggestions[] = $row->phone_number;
        }

        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        $this->db->where('deleted', 0);
        $this->db->like("account_number", $search);
        $this->db->order_by("account_number", "asc");
        $by_account_number = $this->db->get();
        foreach ($by_account_number->result() as $row) {
            $suggestions[] = $row->account_number;
        }

        //only return $limit suggestions
        if (count($suggestions > $limit)) {
            $suggestions = array_slice($suggestions, 0, $limit);
        }
        return $suggestions;
    }

    /*
      Get search suggestions to find customers
     */

    function get_customer_search_suggestions($search, $limit = 25) {
        $suggestions = array();

        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        $this->db->where("(first_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		last_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		CONCAT(`first_name`,' ',`last_name`) LIKE '%" . $this->db->escape_like_str($search) . "%' or 
        zip LIKE '%" . $this->db->escape_like_str($search) . "%') and deleted=0");
        $this->db->order_by("last_name", "asc");
        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            //$suggestions[] = $row->person_id . '|' . $row->first_name . ' ' . $row->last_name;
            if($row->zip)
                $suggestions[] = $row->person_id . '|' . $row->first_name . ' ' . $row->last_name . '|' .$row->zip;
            else
                $suggestions[] = $row->person_id . '|' . $row->first_name . ' ' . $row->last_name;
        }

        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        $this->db->where('deleted', 0);
        $this->db->like("account_number", $search);
        $this->db->order_by("account_number", "asc");
        $by_account_number = $this->db->get();
        foreach ($by_account_number->result() as $row) {
            $suggestions[] = $row->person_id . '|' . $row->account_number;
        }

        //only return $limit suggestions
        if (count($suggestions) > $limit) {
            $suggestions = array_slice($suggestions, 0, $limit);
        }
        return $suggestions;
    }

    /*
      Preform a search on customers
     */
    function search($search) {
        $this->db->from('customers');
        $this->db->join('people', 'customers.person_id=people.person_id');
        $this->db->where("(first_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		last_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		email LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		phone_number LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		account_number LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		CONCAT(`first_name`,' ',`last_name`) LIKE '%" . $this->db->escape_like_str($search) . "%') and deleted=0");
        $this->db->order_by("last_name", "asc");

        return $this->db->get();
    }

    /*
      Attempts to login customer and set session. Returns boolean based on outcome.
     */
    function login($username, $password) {
        $query = $this->db->get_where('customers', array('username' => $username, 'password' => md5($password), 'deleted' => 0), 1);
        if ($query->num_rows() == 1) {
            $row = $query->row();
            $this->session->set_userdata('customer_id', $row->person_id);
            //echo $row->person_id;
            return true;
        }
        return false;
    }

    /*
      Logs out a user by destorying all session data and redirect to market
     */
    function logout() {
        $this->session->sess_destroy();
        redirect('/web/market');
    }

    /*
      Determins if a customer is logged in
     */
    function is_logged_in() {
        return $this->session->userdata('customer_id') != false;
    }

    /*
      Gets information about the currently logged in customer.
     */
    function get_logged_in_customer_info() {
        if ($this->is_logged_in()) {
            return $this->get_info($this->session->userdata('customer_id'));
        }

        return false;
    }
}  