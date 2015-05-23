<?php

require_once ("person_controller.php");

class Suppliers extends Person_controller {
    protected $controller_name = "";
    function __construct() {
        $this->controller_name = 'suppliers';
        parent::__construct($this->controller_name);
    }

    function index() {
        $data['controller_name'] = strtolower($this->uri->segment(1));
        $data['form_width'] = $this->get_form_width();
//        $data['manage_table'] = get_supplier_manage_table($this->Supplier->get_all(), $this);
        $data['manage_table'] = get_supplier_manage_table();
//        $this->load->view('suppliers/manage', $data);
        $this->twiggy->set($data);
        $this->twiggy->display('suppliers/manage');
    }

    function mis_datos() {
        $data['controller_name'] = $this->controller_name;
        $data['form_width'] = $this->get_form_width();
        $data['form_height'] = 150;
        $aColumns = array('person_id', 'company_name', 'last_name', 'first_name', 'email', 'phone_number');
        //Eventos Tabla
        $cllAccion = array(
            '1' => array(
                'function' => "view",
                'common_language' => "common_edit",
                'language' => "_update",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height()),
        );
        echo getData($this->Supplier, $aColumns, $cllAccion);
    }

    /*
      Returns supplier table data rows. This will be called with AJAX.
     */

    function search() {
        $search = $this->input->post('search');
        $data_rows = get_supplier_manage_table_data_rows($this->Supplier->search($search), $this);
        echo $data_rows;
    }

    /*
      Gives search suggestions based on what is being searched for
     */

    function suggest() {
        $suggestions = $this->Supplier->get_search_suggestions($this->input->post('q'), $this->input->post('limit'));
        echo implode("\n", $suggestions);
    }

    /*
      Loads the supplier edit form
     */

    function view($supplier_id = -1) {
        $data['person_info'] = $this->Supplier->get_info($supplier_id);
//        $this->load->view("suppliers/form", $data);
        $this->twiggy->set($data);
        $this->twiggy->display("suppliers/form");
    }

    /*
      Inserts/updates a supplier
     */

    function save($supplier_id = -1) {
        $person_data = array(
            'first_name' => $this->input->post('first_name'),
            'last_name' => $this->input->post('last_name'),
            'email' => $this->input->post('email'),
            'phone_number' => $this->input->post('phone_number'),
            'address_1' => $this->input->post('address_1'),
            'address_2' => $this->input->post('address_2'),
            'city' => $this->input->post('city'),
            'state' => $this->input->post('state'),
            'zip' => $this->input->post('zip'),
            'country' => $this->input->post('country'),
            'comments' => $this->input->post('comments')
        );
        $supplier_data = array(
            'company_name' => $this->input->post('company_name'),
            'account_number' => $this->input->post('account_number') == '' ? null : $this->input->post('account_number'),
        );
        if ($this->Supplier->save($person_data, $supplier_data, $supplier_id)) {
            //New supplier
            if ($supplier_id == -1) {
                echo json_encode(array('success' => true, 'message' => $this->lang->line('suppliers_successful_adding') . ' ' .
                    $supplier_data['company_name'], 'person_id' => $supplier_data['person_id']));
            } else { //previous supplier
                echo json_encode(array('success' => true, 'message' => $this->lang->line('suppliers_successful_updating') . ' ' .
                    $supplier_data['company_name'], 'person_id' => $supplier_id));
            }
        } else {//failure
            echo json_encode(array('success' => false, 'message' => $this->lang->line('suppliers_error_adding_updating') . ' ' .
                $supplier_data['company_name'], 'person_id' => -1));
        }
    }

    /*
      This deletes suppliers from the suppliers table
     */

    function delete() {
        $suppliers_to_delete = $this->input->post('ids');

        if ($this->Supplier->delete_list($suppliers_to_delete)) {
            echo json_encode(array('success' => true, 'message' => $this->lang->line('suppliers_successful_deleted') . ' ' .
                count($suppliers_to_delete) . ' ' . $this->lang->line('suppliers_one_or_multiple')));
        } else {
            echo json_encode(array('success' => false, 'message' => $this->lang->line('suppliers_cannot_be_deleted')));
        }
    }

    /*
      Gets one row for a supplier manage table. This is called using AJAX to update one row.
     */

    function get_row() {
        $person_id = $this->input->post('row_id');
        $data_row = get_supplier_data_row($this->Supplier->get_info($person_id), $this);
        echo $data_row;
    }

    /**
     * Display form: Import data from an excel file
     * @author: Nguyen OJB, Mario T.
     * @since: 10.1
     */
    function excel_import() {
        $this->load->view("suppliers/excel_import", null);
    }

    /**
     * Read data from excel file -> save it to databse
     * @author: Nguyen OJB, Mario T.
     * @since: 10.1
     */
    function do_excel_import() {
        $msg = "do_excel_import";
        $failCodes = null;
        $successCode = null;
        if ($_FILES['file_path']['error'] != UPLOAD_ERR_OK) {
            $msg = $this->lang->line('items_excel_import_failed');
            echo json_encode(array('success' => false, 'message' => $msg));
            return;
        } else {
            try {
                $this->load->library('spreadsheetexcelreader');
                $this->spreadsheetexcelreader->store_extended_info = false;
                $success = $this->spreadsheetexcelreader->read($_FILES['file_path']['tmp_name']);

                $rowCount = $this->spreadsheetexcelreader->rowcount(0);
                if ($rowCount > 2) {
                    for ($i = 3; $i <= $rowCount; $i++) {
                        $account_number = $this->spreadsheetexcelreader->val($i, 'A');
                        $supplier_id = $this->Supplier->get_supplier_id($account_number);
                        $supplier_data = array(
                            'account_number' => $account_number,
                            'company_name' => $this->spreadsheetexcelreader->val($i, 'B')
                        );
                        //$item_id = $this->Item->get_item_id($item_code);
                        $person_data = array(
                            'first_name' => $this->spreadsheetexcelreader->val($i, 'C'),
                            'last_name' => $this->spreadsheetexcelreader->val($i, 'D'),
                            'phone_number' => $this->spreadsheetexcelreader->val($i, 'E'),
                            'email' => $this->spreadsheetexcelreader->val($i, 'F'),
                            'address_1' => $this->spreadsheetexcelreader->val($i, 'G'),
                            'address_2' => $this->spreadsheetexcelreader->val($i, 'H'),
                            'city' => $this->spreadsheetexcelreader->val($i, 'I'),
                            'state' => $this->spreadsheetexcelreader->val($i, 'J'),
                            'zip' => $this->spreadsheetexcelreader->val($i, 'K'),
                            'country' => $this->spreadsheetexcelreader->val($i, 'L'),
                            'comments' => $this->spreadsheetexcelreader->val($i, 'M')
                        );
//die ($supplier_id);
                        if ($this->Supplier->save($person_data, $supplier_data, $supplier_id)) {
                            
                        } else {//insert or update item failure
                            $failCodes[] = $this->spreadsheetexcelreader->val($i, 'A');
                            //echo json_encode( array('success'=>true,'message'=>'Your upload file has no data or not in supported format.') );
                        }
                    }
                } else {
                    // rowCount < 2
                    echo json_encode(array('success' => true, 'message' => 'Your upload file has no data or not in supported format.'));
                    return;
                }
            } catch (Exception $e) {
                //echo 'Caught exception: ',  $e->getMessage(), "\n";
                // echo json_encode( array('success'=>false,'message'=>$e->getMessage()) );
                echo json_encode(array('success' => false, 'message' => 'vamos'));
                break;
            }
        }

        $success = true;
        if (count($failCodes) > 1) {
            $msg = "Most suppliers imported. But some were not, here is list of their CODE (" . count($failCodes) . "): " . implode(", ", $failCodes);
            $success = false;
        } else {
            $msg = "Import suppliers successful";
        }

        echo json_encode(array('success' => $success, 'message' => $msg));
    }

    /*
      get the width for the add/edit form
     */
    function get_form_width() {
        return 350;
    }
    function get_form_height() {
        return 550;
    }

}

?>