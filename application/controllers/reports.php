<?php

require_once ("Secure_area.php");
require_once (APPPATH . "libraries/ofc-library/open-flash-chart.php");

//require_once ("interfaces/iData_controller.php");
//class Reports extends Secure_area implements iPerson_controller
class Reports extends Secure_area {

    function __construct() {
        parent::__construct('reports');
        //$data['form_width']=$this->get_form_width();
        $this->load->helper('report');
    }

    //Initial report listing screen
    function index() {
        $data['controller_name'] = strtolower($this->uri->segment(1));
//		$this->load->view("reports/listing",array());	

        $this->twig->set($data);
        return $this->twig->display('reports/listing');
    }

    /*
      Returns customer table data rows. This will be called with AJAX.
     */

    function search() {
        $this->load->model('reports/Inventory_low');
        $model = $this->Inventory_low;
        $search = $this->input->post('search');
        $data_rows = get_inventory_manage_table_data_rows($model->search($search), $this);
        //echo $data_rows;
        //$tabular_data = array();
        //$report_data = $model->getData(array());
        //$data_rows=get_inventory_manage_table_data_rows($model->search($search),$this);

        $data = array(
            "title" => $this->lang->line('reports_low_inventory_report'),
            "subtitle" => '',
            "headers" => $model->getDataColumns(),
            "data" => $data_rows,
            "summary_data" => $model->getSummaryData(array()),
            "export_excel" => 0,
            "inventario" => 'low'
        );
        $this->load->view("reports/tabular", $data);
    }

    function search_general() {
        $this->load->model('reports/Inventory_summary');
        $model = $this->Inventory_summary;
        $search = $this->input->post('search');
        $data_rows = get_inventory_manage_table_data_rows($model->search($search), $this);
        //echo $data_rows;
        //$tabular_data = array();
        //$report_data = $model->getData(array());
        //$data_rows=get_inventory_manage_table_data_rows($model->search($search),$this);

        $data = array(
            "title" => $this->lang->line('reports_inventory_summary_report'),
            "subtitle" => '',
            "headers" => $model->getDataColumns(),
            "data" => $data_rows,
            "summary_data" => $model->getSummaryData(array()),
            "export_excel" => 0,
            "inventario" => 'sum'
        );
        $this->load->view("reports/tabular", $data);
    }

    /*
      Gives search suggestions based on what is being searched for
     */

    function suggest() {
        // $this->load->model('reports/Inventory_low');	
        // $suggestions = $this->Inventory_low->get_search_suggestions($this->input->post('q'),$this->input->post('limit'));
        // echo implode("\n",$suggestions);
        //$this->load->model('reports/Inventory_low');	
        //$suggestions = $this->Inventory_low->get_search_suggestions($this->input->post('q'),$this->input->post('limit'));
        $suggestions = array();
        $suggestions[] = 'mario ';
        echo implode("\n", $suggestions);
    }

    function _get_common_report_data() {
        $data = array();
        $data['report_date_range_simple'] = get_simple_date_ranges();
        $data['months'] = get_months();
        $data['days'] = get_days();
        $data['years'] = get_years();
        $data['selected_month'] = date('n');
        $data['selected_day'] = date('d');
        $data['selected_year'] = date('Y');

        return $data;
    }

    //Input for reports that require only a date range and an export to excel. (see routes.php to see that all summary reports route here)
    function date_input_excel_export() {
        $data = $this->_get_common_report_data();
//        $this->load->view("reports/date_input_excel_export", $data);
        $this->twig->set($data);
        $this->twig->display("reports//date_input_excel_export");
    }

    //Summary sales report
    function summary_sales($start_date, $end_date, $almacen_id, $export_excel = 0) {
        $this->load->model('reports/Summary_sales');
        $model = $this->Summary_sales;
        $tabular_data = array();
        // if($almacen_id != 0)
        // $report_data = $model->getData(array('start_date'=>$start_date, 'end_date'=>$end_date));
        // else
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date, 'almacen_id' => $almacen_id));

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['sale_date'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']));
        }

        $data = array(
            "title" => ($almacen_id != 0 ? $row['almacen'] : '') . ' ' . $this->lang->line('reports_sales_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date, 'almacen_id' => $almacen_id)),
            "export_excel" => $export_excel
        );
        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    function export_excel($datos) {
        extract($datos);
        ob_start();
        //$filename = trim($filename);
        $filename = str_replace(array(' ', '/', '\\'), '', $title);
        $filename .= "_Export.xls";
        header('Content-type: application/ms-excel');
        header('Content-Disposition: attachment; filename=' . $filename);
        echo implode("\t", array_values($headers)) . "\r\n";
        foreach ($data as $row) {
            echo implode("\t", array_values($row)) . "\r\n";
        }
        $content = ob_end_flush();
//        echo $content;
        die();
    }

    function specific_summary_sale_input() {
        $data = $this->_get_common_report_data();
        $data['specific_input_name'] = $this->lang->line('reports_almacen');

        $almacenes = array('Todos');
        foreach ($this->Almacen->get_all() as $almacen) {
            $almacenes[$almacen['almacen_id']] = $almacen['nombre'];
        }
        //var_dump($almacenes);
        $data['specific_input_data'] = $almacenes;
//        $this->load->view("reports/specific_input", $data);
        $this->twig->set($data);
        $this->twig->display('reports/specific_input');
//        $this->load->view("reports/specific_input", $data);
    }

    //Fin Específico SummarySale
    //Summary categories report
    function summary_categories($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Summary_categories');
        $model = $this->Summary_categories;
        $tabular_data = array();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['category'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']));
        }

        $data = array(
            "title" => $this->lang->line('reports_categories_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );
        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    //Summary customers report
    function summary_customers($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Summary_customers');
        $model = $this->Summary_customers;
        $tabular_data = array();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['customer'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']));
        }

        $data = array(
            "title" => $this->lang->line('reports_customers_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    //Summary suppliers report
    function summary_suppliers($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Summary_suppliers');
        $model = $this->Summary_suppliers;
        $tabular_data = array();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['supplier'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']));
        }

        $data = array(
            "title" => $this->lang->line('reports_suppliers_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    //Summary items report
    function summary_items($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Summary_items');
        $model = $this->Summary_items;
        $tabular_data = array();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        foreach ($report_data as $row) {
            $tabular_data[] = array(character_limiter($row['name'], 16), $row['quantity_purchased'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']));
        }

        $data = array(
            "title" => $this->lang->line('reports_items_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    /**
    *  Summary employees report
    **/
    function summary_employees($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Summary_employees');
        $model = $this->Summary_employees;
        $tabular_data = array();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['employee'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']));
        }

        $data = array(
            "title" => $this->lang->line('reports_employees_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    //Summary taxes report
    function summary_taxes($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Summary_taxes');
        $model = $this->Summary_taxes;
        $tabular_data = array();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['percent'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']));
        }

        $data = array(
            "title" => $this->lang->line('reports_taxes_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    //Summary discounts report
    function summary_discounts($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Summary_discounts');
        $model = $this->Summary_discounts;
        $tabular_data = array();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['discount_percent'], $row['count']);
        }

        $data = array(
            "title" => $this->lang->line('reports_discounts_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    function summary_payments($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Summary_payments');
        $model = $this->Summary_payments;
        $tabular_data = array();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['payment_type'], to_currency($row['payment_amount']));
        }

        $data = array(
            "title" => $this->lang->line('reports_payments_summary_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    //Input for reports that require only a date range. (see routes.php to see that all graphical summary reports route here)
    function date_input() {
        $data = $this->_get_common_report_data();
//        $this->load->view("reports/date_input", $data);
        $this->twig->set($data);
        $this->twig->display("reports/date_input");
    }

    /**
     * Graphical summary sales report
     * @param type $start_date
     * @param type $end_date
     */
    function graphical_summary_sales($start_date, $end_date) {
        $this->load->model('reports/Summary_sales');
        $model = $this->Summary_sales;
        $data = array(
            "title" => $this->lang->line('reports_sales_summary_report'),
            "data_file" => site_url("reports/graphical_summary_sales_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "summary_almacen" => $model->getSummaryAlmacenes(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    /**
     * Resume gráfico de ventas
     */
    function graphical_summary_sales_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_sales');
        $model = $this->Summary_sales;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[] = array(strtotime($row['sale_date'])*1000,(double)$row['total']);
        }

        //Almacenes
        $datos_almacenes = $model->getAlmacenes(array('start_date' => $start_date, 'end_date' => $end_date));
        $graph_datos = array();

        $cllColores = array();
        foreach ($datos_almacenes as $row) {
            //$graph_datos[$row['almacen']][date('m/d/Y', strtotime($row['sale_date']))] = $row['total'];
            $graph_datos[$row['almacen']][] = array(strtotime($row['sale_date'])*1000,(double)$row['total']);
            //$cllColores[$row['almacen']] = random_color();
        }
        //var_dump($graph_datos);

        $data = array(
            "title" => $this->lang->line('reports_sales_summary_report'),
            "yaxis_label" => $this->lang->line('reports_revenue'),
            "xaxis_label" => $this->lang->line('reports_date'),
            "data" => $graph_data,
            "datos" => $graph_datos,
            "colores" => $cllColores,
            "type" => 'spline',
            "xaxis_type" => 'datetime'
        );
        echo json_encode($data);
    }

    /**
     * Resume gráfico de ventas
     */
    function graphical_summary_sales_graph_old($start_date, $end_date) {
        $this->load->model('reports/Summary_sales');
        $model = $this->Summary_sales;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[date('m/d/Y', strtotime($row['sale_date']))] = $row['total'];
        }

        //Almacenes
        $datos_almacenes = $model->getAlmacenes(array('start_date' => $start_date, 'end_date' => $end_date));
        $graph_datos = array();

        $cllColores = array();
        foreach ($datos_almacenes as $row) {
            $graph_datos[$row['almacen']][date('m/d/Y', strtotime($row['sale_date']))] = $row['total'];
            $cllColores[$row['almacen']] = random_color();
        }
        //var_dump($graph_datos);

        $data = array(
            "title" => $this->lang->line('reports_sales_summary_report'),
            "yaxis_label" => $this->lang->line('reports_revenue'),
            "xaxis_label" => $this->lang->line('reports_date'),
            "data" => $graph_data,
            "datos" => $graph_datos,
            "colores" => $cllColores
        );
        $this->load->view("reports/graphs/line", $data);
    }

    //Graphical summary items report
    function graphical_summary_items($start_date, $end_date) {
        $this->load->model('reports/Summary_items');
        $model = $this->Summary_items;
        $data = array(
            "title" => $this->lang->line('reports_items_summary_report'),
            "data_file" => site_urL("reports/graphical_summary_items_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    /**
     * The actual Graph
     * @param type $start_date
     * @param type $end_date
     */
    function graphical_summary_items_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_items');
        $model = $this->Summary_items;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[$row['name']] = $row['total'];
        }

        $data = array(
            "title" => $this->lang->line('reports_items_summary_report'),
            "xaxis_label" => $this->lang->line('reports_revenue'),
            "yaxis_label" => $this->lang->line('reports_items'),
            "data" => $graph_data
        );

        $this->load->view("reports/graphs/hbar", $data);
    }

    /**
     * Reports Summary Categories
     */
    function graphical_summary_categories($start_date, $end_date) {
        $this->load->model('reports/Summary_categories');
        $model = $this->Summary_categories;

        $data = array(
            "title" => $this->lang->line('reports_categories_summary_report'),
            "data_file" => site_urL("reports/graphical_summary_categories_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    //The actual graph data
    function graphical_summary_categories_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_categories');
        $model = $this->Summary_categories;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            //$graph_data[$row['category']] = $row['total'];
            $graph_data[$row['category']] = (double)$row['total'];
            //$graph_data[$row['category']][] = array($row['category'],(double)$row['total']);
        }

        $data = array(
            "title" => $this->lang->line('reports_categories_summary_report'),
            "data" => $graph_data,
            "type" => 'pie'
        );
        echo json_encode($data);

        //$this->load->view("reports/graphs/pie", $data);
    }

    function graphical_summary_suppliers($start_date, $end_date) {
        $this->load->model('reports/Summary_suppliers');
        $model = $this->Summary_suppliers;
        $data = array(
            "title" => $this->lang->line('reports_suppliers_summary_report'),
            "data_file" => site_urL("reports/graphical_summary_suppliers_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    //The actual graph data
    function graphical_summary_suppliers_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_suppliers');
        $model = $this->Summary_suppliers;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[$row['supplier']] = $row['total'];
        }

        $data = array(
            "title" => $this->lang->line('reports_suppliers_summary_report'),
            "data" => $graph_data
        );

        $this->load->view("reports/graphs/pie", $data);
    }

    function graphical_summary_employees($start_date, $end_date) {
        $this->load->model('reports/Summary_employees');
        $model = $this->Summary_employees;

        $data = array(
            "title" => $this->lang->line('reports_employees_summary_report'),
            "data_file" => site_urL("reports/graphical_summary_employees_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    //The actual graph data
    function graphical_summary_employees_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_employees');
        $model = $this->Summary_employees;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[$row['employee']] = $row['total'];
        }

        $data = array(
            "title" => $this->lang->line('reports_employees_summary_report'),
            "data" => $graph_data
        );

        $this->load->view("reports/graphs/pie", $data);
    }

    function graphical_summary_taxes($start_date, $end_date) {
        $this->load->model('reports/Summary_taxes');
        $model = $this->Summary_taxes;
        $data = array(
            "title" => $this->lang->line('reports_taxes_summary_report'),
            "data_file" => site_urL("reports/graphical_summary_taxes_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    //The actual graph data
    function graphical_summary_taxes_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_taxes');
        $model = $this->Summary_taxes;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[$row['percent']] = $row['total'];
        }

        $data = array(
            "title" => $this->lang->line('reports_taxes_summary_report'),
            "data" => $graph_data
        );

        $this->load->view("reports/graphs/pie", $data);
    }

    //Graphical summary customers report
    function graphical_summary_customers($start_date, $end_date) {
        $this->load->model('reports/Summary_customers');
        $model = $this->Summary_customers;

        $data = array(
            "title" => $this->lang->line('reports_customers_summary_report'),
            "data_file" => site_urL("reports/graphical_summary_customers_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    //The actual graph data
    function graphical_summary_customers_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_customers');
        $model = $this->Summary_customers;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            //$graph_data[$row['customer']] = $row['total'];
            $graph_data[$row['customer']][] = (double)$row['total'];
        }

        $data = array(
            "title" => $this->lang->line('reports_customers_summary_report'),
            "xaxis_label" => $this->lang->line('reports_revenue'),
            "yaxis_label" => $this->lang->line('reports_customers'),
            "data" => $graph_data,
            "type" => 'column',
            "xaxis_type" => 'int'
        );

        echo json_encode($data);

        //$this->load->view("reports/graphs/hbar", $data);
    }

    //Graphical summary discounts report
    function graphical_summary_discounts($start_date, $end_date) {
        $this->load->model('reports/Summary_discounts');
        $model = $this->Summary_discounts;

        $data = array(
            "title" => $this->lang->line('reports_discounts_summary_report'),
            "data_file" => site_urL("reports/graphical_summary_discounts_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    //The actual graph data
    function graphical_summary_discounts_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_discounts');
        $model = $this->Summary_discounts;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[$row['discount_percent']] = $row['count'];
        }

        $data = array(
            "title" => $this->lang->line('reports_discounts_summary_report'),
            "yaxis_label" => $this->lang->line('reports_count'),
            "xaxis_label" => $this->lang->line('reports_discount_percent'),
            "data" => $graph_data
        );

        $this->load->view("reports/graphs/bar", $data);
    }

    function graphical_summary_payments($start_date, $end_date) {
        $this->load->model('reports/Summary_payments');
        $model = $this->Summary_payments;

        $data = array(
            "title" => $this->lang->line('reports_payments_summary_report'),
            "data_file" => site_urL("reports/graphical_summary_payments_graph/$start_date/$end_date"),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date))
        );
        $this->twig->set($data);
        $this->twig->display('reports/graphical');
    }

    //The actual graph data
    function graphical_summary_payments_graph($start_date, $end_date) {
        $this->load->model('reports/Summary_payments');
        $model = $this->Summary_payments;
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[$row['payment_type']] = $row['payment_amount'];
        }

        $data = array(
            "title" => $this->lang->line('reports_payments_summary_report'),
            "yaxis_label" => $this->lang->line('reports_revenue'),
            "xaxis_label" => $this->lang->line('reports_payment_type'),
            "data" => $graph_data
        );
        $this->load->view("reports/graphs/pie", $data);
    }

    function specific_customer_input() {
        $data = $this->_get_common_report_data();
        $data['specific_input_name'] = $this->lang->line('reports_customer');

        $customers = array();
        foreach ($this->Customer->get_all(1000,0) as $customer) {
            $customers[$customer['person_id']] = $customer['first_name'] . ' ' . $customer['last_name'];
        }
        $data['specific_input_data'] = $customers;
//        $this->load->view("reports/specific_input", $data);
         $this->twig->set($data);
        $this->twig->display('reports/specific_input');
    }

    function specific_customer($start_date, $end_date, $customer_id, $export_excel = 0) {
        $this->load->model('reports/Specific_customer');
        $model = $this->Specific_customer;

        $headers = $model->getDataColumns();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date, 'customer_id' => $customer_id));

        $summary_data = array();
        $details_data = array();

        foreach ($report_data['summary'] as $key => $row) {
            $summary_data[] = array(anchor('sales/receipt/' . $row['sale_id'], 'POS ' . $row['sale_id'], array('target' => '_blank')), $row['sale_date'], $row['items_purchased'], $row['employee_name'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']), $row['payment_type'], $row['comment']);

            foreach ($report_data['details'][$key] as $drow) {
                $details_data[$key][] = array($drow['name'], $drow['category'], $drow['serialnumber'], $drow['description'], $drow['quantity_purchased'], to_currency($drow['subtotal']), to_currency($drow['total']), to_currency($drow['tax']), to_currency($drow['profit']), $drow['discount_percent'] . '%');
            }
        }

        $customer_info = $this->Customer->get_info($customer_id);
        $data = array(
            "title" => $customer_info->first_name . ' ' . $customer_info->last_name . ' ' . $this->lang->line('reports_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "summary_data" => $summary_data,
            "details_data" => $details_data,
            "overall_summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date, 'customer_id' => $customer_id)),
            "export_excel" => $export_excel,
            'data' => $summary_data
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }
//        $this->load->view("reports/tabular_details", $data);
         $this->twig->set($data);
        $this->twig->display("reports/tabular_details");
    }

    function specific_employee_input() {
        $data = $this->_get_common_report_data();
        $data['specific_input_name'] = $this->lang->line('reports_employee');

        $employees = array();
        foreach ($this->Employee->get_all()->result() as $employee) {
            $employees[$employee->person_id] = $employee->first_name . ' ' . $employee->last_name;
        }
        $data['specific_input_data'] = $employees;
//        $this->load->view("reports/specific_input", $data);
         $this->twig->set($data);
        $this->twig->display('reports/specific_input');
    }

    function specific_employee($start_date, $end_date, $employee_id, $export_excel = 0) {
        $this->load->model('reports/Specific_employee');
        $model = $this->Specific_employee;

        $headers = $model->getDataColumns();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date, 'employee_id' => $employee_id));

        $summary_data = array();
        $details_data = array();

        foreach ($report_data['summary'] as $key => $row) {
            $summary_data[] = array(anchor('sales/receipt/' . $row['sale_id'], 'POS ' . $row['sale_id'], array('target' => '_blank')), $row['sale_date'], $row['items_purchased'], $row['customer_name'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']), $row['payment_type'], $row['comment']);

            foreach ($report_data['details'][$key] as $drow) {
                $details_data[$key][] = array($drow['name'], $drow['category'], $drow['serialnumber'], $drow['description'], $drow['quantity_purchased'], to_currency($drow['subtotal']), to_currency($drow['total']), to_currency($drow['tax']), to_currency($drow['profit']), $drow['discount_percent'] . '%');
            }
        }

        $employee_info = $this->Employee->get_info($employee_id);
        $data = array(
            "title" => $employee_info->first_name . ' ' . $employee_info->last_name . ' ' . $this->lang->line('reports_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "summary_data" => $summary_data,
            "details_data" => $details_data,
            "overall_summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date, 'employee_id' => $employee_id)),
            "export_excel" => $export_excel,
            'data' => $summary_data
        );
         if ($export_excel == 1) {
            return $this->export_excel($data);
        }

//        $this->load->view("reports/tabular_details", $data);
         $this->twig->set($data);
        $this->twig->display("reports/tabular_details");
    }

    function detailed_sales($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Detailed_sales');
        $model = $this->Detailed_sales;

        $headers = $model->getDataColumns();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $summary_data = array();
        $details_data = array();

        foreach ($report_data['summary'] as $key => $row) {
            $summary_data[] = array(anchor('sales/edit/' . $row['sale_id'], 'POS ' . $row['sale_id'], array('target' => '_blank')), $row['sale_date'], $row['items_purchased'], $row['employee_name'], $row['customer_name'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']), $row['payment_type'], $row['comment']);

//            foreach ($report_data['details'][$key] as $drow) {
//                $details_data[$key][] = array($drow['name'], $drow['category'], $drow['serialnumber'], $drow['description'], $drow['quantity_purchased'], to_currency($drow['subtotal']), to_currency($drow['total']), to_currency($drow['tax']), to_currency($drow['profit']), $drow['discount_percent'] . '%');
//            }
        }

        $data = array(
            "title" => $this->lang->line('reports_detailed_sales_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "summary_data" => $summary_data,
            "details_data" => $details_data,
            "overall_summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }

        $this->twig->set($data);
        $this->twig->display("reports/tabular_details");

//        $this->load->view("reports/tabular_details", $data);
    }

    function detailed_sales_old($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Detailed_sales');
        $model = $this->Detailed_sales;

        $headers = $model->getDataColumns();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $summary_data = array();
        $details_data = array();

        foreach ($report_data['summary'] as $key => $row) {
            $summary_data[] = array(anchor('sales/edit/' . $row['sale_id'], 'POS ' . $row['sale_id'], array('target' => '_blank')), $row['sale_date'], $row['items_purchased'], $row['employee_name'], $row['customer_name'], to_currency($row['subtotal']), to_currency($row['total']), to_currency($row['tax']), to_currency($row['profit']), $row['payment_type'], $row['comment']);

            foreach ($report_data['details'][$key] as $drow) {
                $details_data[$key][] = array($drow['name'], $drow['category'], $drow['serialnumber'], $drow['description'], $drow['quantity_purchased'], to_currency($drow['subtotal']), to_currency($drow['total']), to_currency($drow['tax']), to_currency($drow['profit']), $drow['discount_percent'] . '%');
            }
        }

        $data = array(
            "title" => $this->lang->line('reports_detailed_sales_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "summary_data" => $summary_data,
            "details_data" => $details_data,
            "overall_summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

        if ($export_excel == 1) {
            return $this->export_excel($data);
        }

        $this->twig->set($data);
        $this->twig->display("reports/tabular_details");

//        $this->load->view("reports/tabular_details", $data);
    }

    function detailed_por_cobrar($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Detailed_por_cobrar');
        $model = $this->Detailed_por_cobrar;

        $headers = $model->getDataColumns();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $summary_data = array();
        $details_data = array();
        $total_abono = 0;

        foreach ($report_data['summary'] as $key => $row) {

            $summary_data[] = array(null, $row['sale_date'], $row['items_purchased'], $row['employee_name'], $row['customer_name'], $row['total'], $row['payment_amount'], $row['payment_type'], $row['comment']);

            foreach ($report_data['details'][$key] as $drow) {
                $details_data[$key][] = array($drow['name'], $drow['category'], $drow['serialnumber'], $drow['description'], $drow['quantity_purchased'], to_currency($drow['subtotal']), to_currency($drow['total']), to_currency($drow['tax']), to_currency($drow['profit']), $drow['discount_percent'] . '%');
            }
            $sum_abono = 0;
            $line = 0;
            $sum_pagos = 0;
            $payment_id = null;
            foreach ($report_data['payments'][$key] as $drow) {
                if ($drow['por_cobrar'] == '1') {
                    $sum_pagos+=$drow['payment_amount'];
                    $payment_id = $drow['payment_id'];
                }
            }
            foreach ($report_data['abonos'][$key] as $drow) {
                if ($line == 0) {
                    $details_data[$key][] = $model->getDataColumnsAbono();
                    $line = 1;
                }
                $details_data[$key][] = array(date('m/d/Y', strtotime($drow['abono_time'])), $drow['abono_amount'], $drow['abono_type'], $drow['abono_comment']);
                $sum_abono+=$drow['abono_amount'];
            }
            //$sumary_data[$key] = $sumary_data[$key];
            //array_push($sumary_data[$line],'22s');
            // $debe = $summary_data[$key][5]-$sum_abono <= 0?0:$summary_data[$key][5]-$sum_abono;
            $debe = $sum_pagos - $sum_abono <= 0 ? 0 : $sum_pagos - $sum_abono;
            $summary_data[$key][0] = anchor('sales/por_cobrar/' . $row['sale_id'] . '/' . to_currency_no_money($debe) . '/' . $payment_id, 'POS ' . $row['sale_id'], array('target' => '_blank'));
            $summary_data[$key][6] = to_currency($debe);
            $summary_data[$key][5] = to_currency($summary_data[$key][5]);
            $total_abono += $debe;
        }

        $data = array(
            "title" => $this->lang->line('reports_detailed_por_cobrar_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "summary_data" => $summary_data,
            "details_data" => $details_data,
            "overall_summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date, 'total_abono' => $total_abono)),
            "export_excel" => $export_excel
        );

        $this->load->view("reports/tabular_details", $data);
    }

    function detailed_porpagar($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Detailed_porpagar');
        $model = $this->Detailed_porpagar;

        $headers = $model->getDataColumns();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $summary_data = array();
        $details_data = array();
        $debe = 0;
        $total_debe = 0;
        foreach ($report_data['summary'] as $key => $row) {

            //$summary_data[] = array(null, $row['sale_date'], $row['items_purchased'], $row['employee_name'], $row['customer_name'],  $row['total'], $row['payment_amount'],$row['payment_type'], $row['comment']);
            $summary_data[] = array(null, $row['receiving_date'], $row['items_purchased'], $row['employee_name'], $row['supplier_name'], $row['total'], null, $row['payment_type'], $row['comment']);

            foreach ($report_data['details'][$key] as $drow) {
                $details_data[$key][] = array($drow['name'], $drow['category'], $drow['quantity_purchased'], to_currency($drow['total']), $drow['discount_percent'] . '%');
            }
            $sum_abono = 0;
            $line = 0;
            $sum_pagos = 0;
            $payment_id = null;
            foreach ($report_data['payments'][$key] as $drow) {
                if ($drow['por_cobrar'] == '1') {
                    $sum_pagos+=$drow['payment_amount'];
                    $payment_id = $drow['payment_id'];
                }
            }
            foreach ($report_data['porpagar'][$key] as $drow) {
                if ($line == 0) {
                    $details_data[$key][] = $model->getDataColumnsPorPagar();
                    $line = 1;
                }
                $details_data[$key][] = array(date('m/d/Y', strtotime($drow['time'])), $drow['amount'], $drow['type'], $drow['comment']);
                $sum_abono+=$drow['amount'];
            }
            //$sumary_data[$key] = $sumary_data[$key];
            //array_push($sumary_data[$line],'22s');
            // $debe = $summary_data[$key][5]-$sum_abono <= 0?0:$summary_data[$key][5]-$sum_abono;
            $debe = $sum_pagos - $sum_abono <= 0 ? 0 : $sum_pagos - $sum_abono;
            $summary_data[$key][0] = anchor('receivings/por_pagar/' . $row['receiving_id'] . '/' . to_currency_no_money($debe) . '/' . $payment_id, 'RECV ' . $row['receiving_id'], array('target' => '_blank'));
            $summary_data[$key][6] = to_currency($debe);
            $summary_data[$key][5] = to_currency($summary_data[$key][5]);
            $total_debe += $debe;
        }

        $data = array(
            "title" => $this->lang->line('reports_detailed_por_pagar_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "summary_data" => $summary_data,
            "details_data" => $details_data,
            "overall_summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date, 'total_debe' => $total_debe)),
            "export_excel" => $export_excel
        );

        $this->load->view("reports/tabular_details", $data);
    }

    function detailed_receivings($start_date, $end_date, $export_excel = 0) {
        $this->load->model('reports/Detailed_receivings');
        $model = $this->Detailed_receivings;

        $headers = $model->getDataColumns();
        $report_data = $model->getData(array('start_date' => $start_date, 'end_date' => $end_date));

        $summary_data = array();
        $details_data = array();

        foreach ($report_data['summary'] as $key => $row) {
            $summary_data[] = array(anchor('receivings/receipt/' . $row['receiving_id'], 'RECV ' . $row['receiving_id'], array('target' => '_blank')), $row['receiving_date'], $row['items_purchased'], $row['employee_name'], $row['supplier_name'], to_currency($row['total']), $row['payment_type'], $row['comment']);

            foreach ($report_data['details'][$key] as $drow) {
                $details_data[$key][] = array($drow['name'], $drow['category'], $drow['quantity_purchased'], to_currency($drow['total']), $drow['discount_percent'] . '%');
            }
        }

        $data = array(
            "title" => $this->lang->line('reports_detailed_receivings_report'),
            "subtitle" => date('m/d/Y', strtotime($start_date)) . '-' . date('m/d/Y', strtotime($end_date)),
            "headers" => $model->getDataColumns(),
            "summary_data" => $summary_data,
            "details_data" => $details_data,
            "overall_summary_data" => $model->getSummaryData(array('start_date' => $start_date, 'end_date' => $end_date)),
            "export_excel" => $export_excel
        );

//        $this->load->view("reports/tabular_details", $data);
        $this->twig->set($data);
        $this->twig->display("reports/tabular_details");
    }

    function excel_export() {
        $this->load->view("reports/excel_export", array());
    }

    function inventory_low($export_excel = 0) {
        $this->load->model('reports/Inventory_low');
        $model = $this->Inventory_low;
        $tabular_data = array();
        $report_data = $model->getData(array());
        foreach ($report_data as $row) {
            $tabular_data[] = array($row['name'], $row['item_number'], $row['description'], $row['quantity'], $row['reorder_level']);
        }

        $data = array(
            "title" => $this->lang->line('reports_low_inventory_report'),
            "subtitle" => '',
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array()),
            "export_excel" => $export_excel,
            "inventario" => 'low'
        );

//        $this->load->view("reports/tabular", $data);
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    function inventory_low_almacen($almacen_id, $export_excel = 0) {
        // $this->output->enable_profiler(true);
        $this->load->model('reports/Inventory_low_almacen');
        $model = $this->Inventory_low_almacen;
        $tabular_data = array();
        $report_data = $model->getData(array('almacen_id' => $almacen_id));
        foreach ($report_data as $row) {
            $tabular_data[] = array($row['name'], $row['item_number'], $row['description'], $row['quantity'], $row['reorder_level']);
        }

        $data = array(
            "title" => $this->lang->line('reports_low_inventory_report'),
            "subtitle" => 'Almac&eacute;n ' . (($almacen_id != 0) ? $row['nombre'] : ''),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => $model->getSummaryData(array()),
            "export_excel" => $export_excel,
            "inventario" => 'low'
        );

//        $this->load->view("reports/tabular", $data);
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    function inventory_summary($export_excel = 0) {
        $this->load->model('reports/Inventory_summary');
        $model = $this->Inventory_summary;
        $tabular_data = array();
        $report_data = $model->getData(array());
        $total_items = 0;
        $total_valor = 0;

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['name'], $row['item_number'], $row['description'], $row['quantity'], $row['reorder_level'], $row['total']);
            $total_items += $row['quantity'];
            $total_valor += $row['total'];
        }

        $data = array(
            "title" => $this->lang->line('reports_inventory_summary_report'),
            "subtitle" => '',
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => array('items' => $total_items, 'items_purchased' => $total_valor),
            "export_excel" => $export_excel,
            // "total_items" => $total_items,
            // "total_valor" => $total_valor,
            "inventario" => 'sum'
        );

        $this->load->view("reports/tabular", $data);
    }

    function inventory_summary_almacen($almacen_id, $export_excel = 0) {
        $this->load->model('reports/Inventory_summary_almacen');
        $model = $this->Inventory_summary_almacen;
        $tabular_data = array();
        $report_data = $model->getData(array("almacen_id" => $almacen_id));
        $total_items = 0;
        $total_valor = 0;

        foreach ($report_data as $row) {
            $tabular_data[] = array($row['name'], $row['item_number'], $row['description'], $row['quantity'], $row['reorder_level'], $row['total']);
            $total_items += $row['quantity'];
            $total_valor += $row['total'];
        }

        $data = array(
            "title" => $this->lang->line('reports_inventory_summary_report'),
            "subtitle" => 'Almac&eacute;n ' . (($almacen_id != 0) ? $row['nombre'] : ''),
            "headers" => $model->getDataColumns(),
            "data" => $tabular_data,
            "summary_data" => array('items' => $total_items, 'items_purchased' => $total_valor),
            "export_excel" => $export_excel,
            // "total_items" => $total_items,
            // "total_valor" => $total_valor,
            "inventario" => 'sum'
        );

//        $this->load->view("reports/tabular", $data);
        $this->twig->set($data);
        $this->twig->display("reports/tabular");
    }

    //Específico SummarySale. Esto elimina los dos metodos de arriba.
    function specific_summary_almacen_input() {
        $data = $this->_get_common_report_data();
        $data['specific_input_name'] = $this->lang->line('reports_almacen');

        $almacenes = array('Todos');
        foreach ($this->Almacen->get_all() as $almacen) {
            $almacenes[$almacen['almacen_id']] = $almacen['nombre'];
        }
        //var_dump($almacenes);
        $data['specific_input_data'] = $almacenes;
//        $this->load->view("reports/specific_input_almacen", $data);
        $this->twig->set($data);
        $this->twig->display("reports/specific_input_almacen");
    }

    function do_line($result) {
        extract($result);
        $this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
        $this->output->set_header("Pragma: public");
        $line_data = array();
        $line_dataA1 = array();
        $labels = array();
        foreach ($data as $label => $value) {
            $line_data[] = (float) $value;
            $labels[] = (string) $label;
        }
        $hol = new hollow_dot();
        $hol->size(3)->halo_size(1)->tooltip('#x_label#<br>#val#');

        $line = new line();
        $line->set_default_dot_style($hol);
        $line->set_values($line_data);
        $line->set_colour(random_color());
        $line->set_key('Total', 12);

//New lines stores
        $chart = new open_flash_chart();
//        $chart->set_title(new title($title));
        $chart->set_title($title);
        $chart->add_element($line);
        $color = "fffff";
        foreach ($datos as $label => $valor) {
            $line_data = null;
            foreach ($valor as $dato) {
                $line_data[] = (float) $dato;
                //$labels[] = (string)$dato;
            }
            $line = null;
            $line = new line();
            $line->set_default_dot_style($hol);
            $line->set_values($line_data);
            $color = random_color();
            $line->set_colour($color);
            $line->set_key($label, 12);
            $chart->add_element($line);
        }
        $x = new x_axis();
        $x->steps(count($data) > 10 ? (int) (count($data) / 4) : 1);
        $x->set_labels_from_array($labels);
        $chart->set_x_axis($x);

        $y = new y_axis();
        $y->set_tick_length(7);
        $y->set_range(0, (count($data) > 0 ? max($data) : 0) + 25, ((count($data) > 0 ? max($data) : 0) + 25) / 10);
        $chart->set_y_axis($y);
// $chart->set_y_legend("222");
        $chart->set_bg_colour("#f3f3f3");


        if (isset($yaxis_label)) {
            $y_legend = new y_legend($yaxis_label);
            $y_legend->set_style('{font-size: 20px; color: #000000}');
            $chart->set_y_legend($y_legend);
        }

        if (isset($xaxis_label)) {
            $x_legend = new x_legend($xaxis_label);
            $x_legend->set_style('{font-size: 20px; color: #000000}');
            $chart->set_x_legend($x_legend);
        }
        echo $chart->toPrettyString();
    }

}
