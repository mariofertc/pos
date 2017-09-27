<?php

require_once ("Secure_area.php");

class Home extends Secure_area {

    protected $controller_name;

    function __construct() {
        parent::__construct();
        $this->controller_name = strtolower($this->uri->segment(1));
    }

    function index() {
        // $this->output->enable_profiler(TRUE);
        $data['controller_name'] = $this->controller_name;
        $data['title'] = 'home_home';
        $data = array_merge($data,$this->get_summary());
        $this->twig->set($data);
        $this->twig->display('home/home');
//        $this->load->view("home", $data);
    }
    function menu() {
        // $this->output->enable_profiler(TRUE);
        $data['controller_name'] = $this->controller_name;
        $data['title'] = 'home_menu';
        $this->twig->set($data);
        $this->twig->display('home/menu');
//        $this->load->view("home", $data);
    }

    function logout() {
        $this->Employee->logout();
    }

    function get_summary(){
        $data = array();

        //Totales
        $data['total_customer'] = $this->Customer->get_total();
        $data['total_supplier'] = $this->Supplier->get_total();
        $data['total_item'] = $this->Item->get_total();
        $data['total_sales'] = $this->Sale->get_total();
        $data['total_receivings'] = $this->Receiving->get_total();
        $data['total_sales_web'] = $this->orden->get_total();

        //Semanales
        $current_week = strtotime("last monday midnight");
        $pass_week = strtotime("-1 week",$current_week);
        //Mensual
        $today = strtotime("today");
        $last_month = strtotime("-1 month",$today);

        //Convert to date
        $current_week = date('Y-m-d H:i:s', $current_week);
        $pass_week = date('Y-m-d H:i:s', $pass_week);
        $today = date('Y-m-d H:i:s', $today);
        $last_month = date('Y-m-d H:i:s', $last_month);
        
        $data['total_supplier_week'] = $this->get_summary_percent($current_week, $pass_week, $this->Supplier, $data['total_supplier'],'fecha_registro');
        $data['total_item_week'] = $this->get_summary_percent($current_week, $pass_week, $this->Item, $data['total_item'],'fecha_registro');
        $data['total_sales_week'] = $this->get_summary_percent($current_week, $pass_week, $this->Sale, $data['total_sales'],'sale_time');
        $data['total_receivings_week'] = $this->get_summary_percent($current_week, $pass_week, $this->Receiving, $data['total_receivings'],'receiving_time');
        $data['total_sales_web_week'] = $this->get_summary_percent($current_week, $pass_week, $this->orden, $data['total_sales'],'fecha_creacion');

        $sessions = array();
        $nombre = "";
        $user = null;
        $pattern = "person_id|s:";
        foreach($this->sessions->get_all() as $session){
            if (strpos($session->data, $pattern) === false) {
                continue;
            }
            $user = explode($pattern,$session->data);
            $user = explode(':',$user[1]);
            $nombre = $this->Person->get_info($user[0]);
            //if(is_in_array())
            $sessions[] = array_merge((array)$session, array('nombre'=>$nombre->first_name." ".$nombre->last_name));
        }
        $data['sessions'] = $sessions;

        return $data;
    }

    function get_summary_percent($current_week, $pass_week, $model, $total, $field){
        $semana_anterior = $model->get_total(array("$field >"=> $pass_week,"$field <"=> $current_week))/($total==0?1:$total);
        $esta_semana = $model->get_total(array("$field >="=> $current_week)) / ($total==0?1:$total);
        //echo $esta_semana;
        return round(100 * ($esta_semana - $semana_anterior),2);
    }

    function get_summary_per_employee(){
        //Mensual
        $today = strtotime("today");
        $last_month = strtotime("-1 month",$today);

        //Convert to date
        $today = date('Y-m-d H:i:s', $today);
        $last_month = date('Y-m-d H:i:s', $last_month);

        $this->load->model('reports/Summary_employees');
        $model = $this->Summary_employees;
        // $data['by_employee'] = $model->getDataby("concat(Year(`sale_date`), '-', Month(`sale_date`)) month, CONCAT(first_name, ' ',last_name) as employee, count(*) as cnt", array('start_date' => $last_month, 'end_date' => $today));
        $employees = $model->getDataby("CONCAT(first_name, ' ',last_name) as name, count(*) as y, sale_date", array('start_date' => $last_month, 'end_date' => $today));
        $cll_employee = array();
        foreach ($employees as &$employee) {
            $cll_employee[$employee['name']][] = array(strtotime($employee['sale_date'])*1000,(int)$employee['y']);
        }
        
        echo json_encode($cll_employee);
    }
     function get_summary_five_employee(){
        //Mensual
        $today = strtotime("today");
        $last_month = strtotime("-12 month",$today);

        //Convert to date
        $today = date('Y-m-d H:i:s', $today);
        $last_month = date('Y-m-d H:i:s', $last_month);

        $this->load->model('reports/Summary_employees');
        $model = $this->Summary_employees;
        // $data['by_employee'] = $model->getDataby("concat(Year(`sale_date`), '-', Month(`sale_date`)) month, CONCAT(first_name, ' ',last_name) as employee, count(*) as cnt", array('start_date' => $last_month, 'end_date' => $today));
        $employees = $model->getDatabyFiveTop("CONCAT(first_name, ' ',last_name) as name, count(*) as y, sale_date", array('start_date' => $last_month, 'end_date' => $today), 'y desc');
        $cll_employee = array();
        foreach ($employees as &$employee) {
            $cll_employee[$employee['name']][] = (int)$employee['y'];
        }
        
        echo json_encode($cll_employee);
    }

}
