<?php
require_once ("Secure_area.php");
class Boxes extends Secure_area
{
	protected $controller_name;

    function __construct() {
        //Boxes
        // $this->controller_name = strtolower($this->uri->segment(1));
        $this->controller_name = "boxes";
		parent::__construct($this->controller_name);
	}
	
	function index()
	{
		$data['controller_name']=strtolower($this->uri->segment(1));
		$data['form_width']=$this->get_form_width();
		$data['subtitle']='Cierre Diario de Caja';
		$data['manage_table']=get_boxes_manage_table();
		$this->twig->set($data);
        $this->twig->display("boxes/manage");
		// $this->load->view('boxes/manage',$data);
	}

	function mis_datos() {
		$data['controller_name'] = $this->controller_name;
		$data['form_width'] = $this->get_form_width();
		$data['form_height'] = 150;
		// $aColumns = array('box_id', 'close_time', 'comment', 'username');
		$aColumns = array('box_id', 'box_id', 'open_time', 'close_time', 'open_comment', 'comment', 'username', 'open_value', 'close_value');
		//Eventos Tabla
		$cllAccion = array(
				/*'1' => array(
						'function' => "view",
						'common_language' => "common_edit",
						'language' => "_update",
						'width' => $this->get_form_width(),
						'height' => $this->get_form_height()),*/
				'2' => array(
						'function' => "view_close",
						'common_language' => "module_close_box",
						'language' => "_update",
						'width' => $this->get_form_width(),
						'height' => $this->get_form_height()),
				);
		echo getData($this->Box, $aColumns, $cllAccion,TRUE);
	}
	
	function refresh()
	{
		$this->load->view('boxes/manages',$data);
	}
	
	/*
	Returns boxes table data rows. This will be called with AJAX.
	*/
	function search()
	{
		$search=$this->input->post('search');
		$data_rows=get_boxes_manage_table_data_rows($this->Box->search($search),$this);
		echo $data_rows;
	}
	
	/*
	Gives search suggestions based on what is being searched for
	*/
	function suggest()
	{
		$suggestions = $this->Box->get_search_suggestions($this->input->post('q'),$this->input->post('limit'));
		echo implode("\n",$suggestions);
	}
	
	function view($box_id=-1)
	{
		$employee_id=$this->Employee->get_logged_in_employee_info()->person_id;
		if($this->Box->pendiente_cerrar($employee_id)){
			echo line("boxes_pendiente_cerrar");
			return;
		}
		
		$data['info']=$this->Box->get_info($box_id);		
		$this->twig->set($data);
        $this->twig->display("boxes/open_form");
	}

	function view_close($box_id=-1){
		//$data['box_id']=1;
		//$this->load->view("boxes/form",$data);
		
		//$employee_id=$this->Employee->get_logged_in_employee_info()->person_id;
		$box = $this->Box->get_info($box_id);
		$employee_id=$box->employee_id;

		// if($employee_id != $box->employee_id){
		$validate = $this->validate_close($box_id);
		if(!$validate['success']){
			echo $validate['message'];
			return;
		}
		
		//Para ver el cierre del dia
		$this->load->model('reports/Summary_sales');
		$model = $this->Summary_sales;
		/*$fecha_inicio = date('Y-m-d 00:00:00');
		$fecha_fin = date('Y-m-d 23:59:59');*/
		$fecha_inicio = $box->open_time;
		$fecha_fin = date('Y-m-d H:i:s');
		//$fecha_fin = date('Y-m-d',strtotime('-1 second',strtotime('+1 day',strtotime(date('m').'/'.date('d').'/'.date('Y').' 23:59:59'))));
		//$fecha_inicio = '2011-03-23 00:00:00';
		//$fecha_fin = '2011-03-23 23:00:00';
		$this->load->model('reports/Summary_payments');
        $model = $this->Summary_payments;
		$data['info_abonos'] = $model->getSummaryAbonosDataByEmployee(array('start_date' => $fecha_inicio, 'end_date' => $fecha_fin, 'employee_id'=> $box->employee_id));
		$tot_venta = $this->Summary_sales->getSummaryDataByTimeAndEmployee(array('start_date'=>$fecha_inicio, 'end_date'=>$fecha_fin, 'employee_id'=>$employee_id));
		//$tot_venta = $fecha_fin;
		$data['tot_venta'] = $tot_venta;
		$data['box_info'] = $box;

		$this->twig->set($data);
        $this->twig->display("boxes/form");
	}

	function validate_close($box_id){
		$result = array('success'=>TRUE,'message'=>'');
		if(!$this->Box->por_cerrar($box_id))
		{
			$result['message']=$this->lang->line('boxes_close_again');
			$result['success']=FALSE;
		}
		$employee_id=$this->Employee->get_logged_in_employee_info()->person_id;
		$box = $this->Box->get_info($box_id);
		// print_r($box);
		// print_r($employee_id);
		if($employee_id != $box->employee_id){
			$result['message'] .= "</BR>".line("boxes_not_allowed");
			$result['success']=FALSE;
		}
		return $result;
	}

	function view_child_row($box_id=-1){
		$box = $this->Box->get_info($this->input->get('box_id'));		

		$fecha_inicio = $box->open_time;
		$fecha_fin = $box->close_time?$box->close_time:date('Y-m-d H:i:s');

		$this->load->model('reports/Summary_payments');
        $model = $this->Summary_payments;
        $data['info_abonos'] = $model->getSummaryAbonosDataByEmployee(array('start_date' => $fecha_inicio, 'end_date' => $fecha_fin, 'employee_id'=> $box->employee_id));
        $data['info'] = $model->getSummaryDataByEmployee(array('start_date' => $fecha_inicio, 'end_date' => $fecha_fin, 'employee_id'=> $box->employee_id));
        $data['open_value'] = $box->open_value;
        /*$graph_data = array();
        foreach ($report_data as $row) {
            $graph_data[$row['payment_type']] = (double)$row['payment_amount'];
        }*/
// var_dump($data);
        $this->twig->set($data);
        $temp = $this->twig->renderView("boxes/view_child_row");
        echo json_encode(array('html'=>$temp));

        return;
	}	
	
	function find_box_info()
	{
		$box_number=$this->input->post('scan_box_number');
		echo json_encode($this->Box->find_box_info($box_number));
	}
	
	function get_cc()
	{
		if(!$this->CI->session->userdata('cc'))
			$this->set_cc(null);

		return $this->CI->session->userdata('cc');
	}

	function set_cc($cc_data)
	{
		$this->CI->session->set_userdata('cc',$cc_data);
	}
	
	/*
	Inserts/updates a boxes
	*/
	function save($box_id=-1)
	{
		//if(!$this->Box->por_cerrar($box_id))
		$validate = $this->validate_close($box_id);
		if(!$validate['success'])
		{
			$validate['box_id'] = -1;
			// echo json_encode(array('success'=>false,'message'=>$this->lang->line('boxes_close_again'), 
			echo json_encode($validate);
		  return;
		}
		//Si esta deacuerdo sigue.
		$box_data = array(
			'comment'=>$this->input->post('comment'),
			'close_value'=>$this->input->post('close_value'),
			'close_time'=> date('Y-m-d H:i:s')
		);
		$cur_box_info = $this->Box->get_info($box_id);
		if($this->Box->save($box_data,$box_id))
		{
			//New box
			if($box_id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$this->lang->line('boxes_successful_adding').' '.
				$box_data['comment'],'box_id'=>$box_data['box_id']));
				$box_id = $box_data['box_id'];
			}
			else //previous item
			{
				echo json_encode(array('success'=>true,'message'=>$this->lang->line('boxes_successful_updating').' '.
				$box_data['comment'],'box_id'=>$box_id));
			}
		
		
				//echo json_encode(array('success'=>true,'message'=>$this->lang->line('boxes_succesfull_close').' '.
				//$box_data['close_time'],'box_id'=>$box_data['box_id']));
				//$box_id = $box_data['box_id'];
		}
		else
		{
		//echo json_encode(array('success'=>false,'message'=>$this->lang->line('items_error_adding_updating').' '.
		  //echo json_encode(array('success'=>false,'message'=>'Vamos '.
			//$box_data['comment'],'item_id'=>-1));
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('boxes_error_close').' '.
			$box_id,'box_id'=>-1));
		}
	}

	/*
	Inserts/updates a boxes
	*/
	function save_open($box_id=-1)
	{
		$employee_id=$this->Employee->get_logged_in_employee_info()->person_id;
		if($this->Box->pendiente_cerrar($employee_id)){
			echo json_encode(array('success'=>FALSE,'message'=>$this->lang->line("boxes_pendiente_cerrar"),'box_id'=>-1));
			return;
		}
		$box_data = array(
		'open_comment'=>$this->input->post('open_comment'),
		'open_value'=>$this->input->post('open_value'),
		'employee_id'=>$employee_id,
		'open_time' => date('Y-m-d H:i:s')
		);
		//$cur_box_info = $this->Box->get_info($box_id);
		if($this->Box->save($box_data,$box_id))
		{
			//Set CI
			//$this->set_cc(date("Y-m-d"));	
			//New box
			if($box_id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$this->lang->line('boxes_successful_open').'. '.
				$box_data['open_comment'],'box_id'=>$box_data['box_id']));
				$box_id = $box_data['box_id'];
			}
			else //previous item
			{
				echo json_encode(array('success'=>true,'message'=>$this->lang->line('boxes_successful_open_updating').' '.
				$box_data['comment'],'box_id'=>$box_id));
			}
		
		
				//echo json_encode(array('success'=>true,'message'=>$this->lang->line('boxes_succesfull_close').' '.
				//$box_data['close_time'],'box_id'=>$box_data['box_id']));
				//$box_id = $box_data['box_id'];
		}
		else
		{
		//echo json_encode(array('success'=>false,'message'=>$this->lang->line('items_error_adding_updating').' '.
		  //echo json_encode(array('success'=>false,'message'=>'Vamos '.
			//$box_data['comment'],'item_id'=>-1));
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('boxes_error_open').' '.
			$box_id,'box_id'=>-1));
		}
	}
	
	/*
	This deletes customers from the customers table
	*/
	function delete()
	{
		$boxes_to_delete=$this->input->post('ids');
		
		if($this->Box->delete_list($boxes_to_delete))
		{
			echo json_encode(array('success'=>true,'message'=>$this->lang->line('boxes_successful_deleted').' '.
			count($boxes_to_delete).' '.$this->lang->line('boxes_one_or_multiple')));
		}
		else
		{
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('boxes_cannot_be_deleted')));
		}
	}
	
	function get_form_width() {
        return 560;
    }

    function get_form_height() {
        return 550;
    }
	function get_row()
	{
		$box_id = $this->input->post('row_id');
		$data_row=get_box_data_row($this->Box->get_info($box_id),$this);
		echo $data_row;
	}
}
?>
