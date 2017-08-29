<?php

require_once ("secure_area.php");

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
        $data['total_ventas'] = $this->Sale->get_total();
        $data['total_compras'] = $this->Receiving->get_total();
        $data['total_ventas_web'] = $this->orden->get_total();

        //Semanales
        $start_week = strtotime("last monday midnight");
        $end_week = strtotime("+1 week",$start_week);

        //echo CI_VERSION;
        //echo "yo";
        //var_dump( local_to_gmt($start_week));
        //var_dump( local_to_gmt($end_week));
        //die();

        $semana_anterior = $this->Customer->get_total(array('fecha_registro >'=>date("sunday", strtotime("last week monday"))));
        $esta_semana = $this->Customer->get_total(array('fecha_registro >'=>date("sunday", strtotime("last week monday"))));
        $data['total_customer'] = $this->Customer->get_total();
        $data['total_supplier'] = $this->Supplier->get_total();
        $data['total_item'] = $this->Item->get_total();
        $data['total_ventas'] = $this->Sale->get_total();
        $data['total_compras'] = $this->Receiving->get_total();
        $data['total_ventas_web'] = $this->orden->get_total();

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

}