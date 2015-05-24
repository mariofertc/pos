<?php
require_once ("secure_area.php");
class Boxes extends Secure_area
{
	function __construct()
	{
		parent::__construct('boxes');
	}
	
	function index()
	{
		$data['controller_name']=strtolower($this->uri->segment(1));
		$data['form_width']=$this->get_form_width();
		$data['subtitle']='Cierre Diario de Caja';
		$data['manage_table']=get_boxes_manage_table($this->Box->get_all(),$this);
		$this->load->view('boxes/manage',$data);
		//$this->load->view('boxes/form',$data);
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
	
	
	/*
	Loads the customer edit form
	*/
	function view($box_id=-1)
	{
		//$data['box_id']=1;
		//$this->load->view("boxes/form",$data);
		
		$data['box_info']=$this->Box->get_info($box_id);
		
		//Para ver el cierre del dia
		$this->load->model('reports/Summary_sales');
		$model = $this->Summary_sales;
		$fecha_inicio = date('Y-m-d 00:00:00');
		$fecha_fin = date('Y-m-d 23:59:59');
		//$fecha_fin = date('Y-m-d',strtotime('-1 second',strtotime('+1 day',strtotime(date('m').'/'.date('d').'/'.date('Y').' 23:59:59'))));
		//$fecha_inicio = '2011-03-23 00:00:00';
		//$fecha_fin = '2011-03-23 23:00:00';
		
		$tot_venta = $this->Summary_sales->getSummaryData(array('start_date'=>$fecha_inicio, 'end_date'=>$fecha_fin));
		//$tot_venta = $fecha_fin;
		$data['tot_venta'] = $tot_venta;
		//$data['item_tax_info']=$this->Item_taxes->get_info($item_id);
		$this->load->view("boxes/form",$data);
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
		if($this->Box->ya_cerrado())
		{
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('boxes_close_again'), 
			'box_id'=>-1));
		  return;
		}
		//Si esta deacuerdo sigue.
		$employee_id=$this->Employee->get_logged_in_employee_info()->person_id;
		$box_data = array(
		'comment'=>$this->input->post('comment'),
		'employee_id'=>$employee_id
		);
		$cur_box_info = $this->Box->get_info($box_id);
		if($this->Box->save($box_data,$box_id))
		{
			//Set CI
			//$this->set_cc(date("Y-m-d"));

	
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
	
	/*
	get the width for the add/edit form
	*/
	function get_form_width()
	{			
		return 350;
	}
	function get_row()
	{
		$box_id = $this->input->post('row_id');
		$data_row=get_box_data_row($this->Box->get_info($box_id),$this);
		echo $data_row;
	}
}
?>