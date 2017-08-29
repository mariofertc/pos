<?php

require_once ("secure_area.php");

class Payments extends Secure_area {

    function __construct() {
        parent::__construct('payments');
    }

    function index() {
        $data['controller_name'] = strtolower($this->uri->segment(1));
        $data['form_width'] = $this->get_form_width();
        $data['form_height'] = $this->get_form_height();
        $data['manage_table'] = get_payment_manage_table();
        //$this->load->view('payments/manage',$data);
        $this->twig->set($data);
        $this->twig->display('payments/manage');
    }
    
    function mis_datos() {
        $aColumns = array('payment_id', 'payment_type', 'por_cobrar');
//        var_dump($aColumns);
        //Eventos Tabla
        $cllAccion = array(
            '1' => array(
                'function' => "view",
                'common_language' => "common_edit",
                'language' => "_update",
                'width' => $this->get_form_width(),
                'height' => $this->get_form_height())
        );
        echo getData($this->Payment, $aColumns, $cllAccion);
    }

    /*
      Returns supplier table data rows. This will be called with AJAX.
     */

    function search() {
        $search = $this->input->post('search');
        $data_rows = get_payment_manage_table_data_rows($this->Payment->search($search), $this);
        echo $data_rows;
    }

    /*
      Gives search suggestions based on what is being searched for
     */

    function suggest() {
        $suggestions = $this->Payment->get_search_suggestions($this->input->post('q'), $this->input->post('limit'));
        echo implode("\n", $suggestions);
    }

    /*
      Loads the supplier edit form
     */

    function view($payment_id = -1) {
        $data['payment_info'] = $this->Payment->get_info($payment_id);
        $data['yo'] = 's';
        $this->twig->set($data);
        $this->twig->display("payments/form");
    }

    /*
      Inserts/updates a supplier
     */

    function save($payment_id = -1) {
        $payment_data = array(
            'payment_type' => $this->input->post('payment_type'),
            'por_cobrar' => $this->input->post('por_cobrar'),
            'have_plazo' => $this->input->post('have_plazo'),
            'payment_days' => $this->input->post('payment_days'),
            'payment_months' => $this->input->post('payment_months'),
            'share' => $this->input->post('share')
        );

        $payment_data['payment_days'] = $payment_data['payment_days'] == '' ? 0 : $payment_data['payment_days'];
        $payment_data['payment_months'] = $payment_data['payment_months'] == '' ? 0 : $payment_data['payment_months'];
        $payment_data['share'] = $payment_data['share'] == '' ? 0 : $payment_data['share'];

        if ($this->Payment->save($payment_data, $payment_id)) {
            //New payments
            if ($payment_id == -1) {
                echo json_encode(array('success' => true, 'message' => $this->lang->line('payment_successful_adding'),
                    'payment_id' => $payment_data['payment_id']));
            } else { //previous supplier
                echo json_encode(array('success' => true, 'message' => $this->lang->line('payment_successful_updating'),
                    'payment_id' => $payment_id));
            }
        } else {//failure
            echo json_encode(array('success' => false, 'message' => $this->lang->line('payment_error_adding_updating'),
                'payment_id' => -1));
        }
    }

    /*
      This deletes suppliers from the suppliers table
     */

    function delete() {
        $payment_to_delete = $this->input->post('ids');

        if ($this->Payment->delete_list($payment_to_delete)) {
            echo json_encode(array('success' => true, 'message' => $this->lang->line('payments_successful_deleted') . ' ' .
                count($payments_to_delete) . ' ' . $this->lang->line('payments_one_or_multiple')));
        } else {
            echo json_encode(array('success' => false, 'message' => $this->lang->line('payments_cannot_be_deleted')));
        }
    }

    /*
      Gets one row for a supplier manage table. This is called using AJAX to update one row.
     */

    function get_row() {
        $payment_id = $this->input->post('row_id');
        $data_row = get_payment_data_row($this->Payment->get_info($payment_id), $this);
        echo $data_row;
    }

    /*
      get the width for the add/edit form
     */

    function get_form_width() {
        return 360;
        //return 370;
    }
    function get_form_height() {
        return 350;
        //return 370;
    }

}

?>